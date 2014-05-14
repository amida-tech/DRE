var mongo = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

var merge = require('../models/merges');
var allergy = require('../models/allergies');
var StorageFiles = require('../models/storage_files');

// Connection

var databaseName = 'dre';

var db = null;
var grid = null;

exports.connectDatabase = function connectDatabase(server, callback) {
    mongo.Db.connect('mongodb://' + server + '/' + databaseName, function(err, dbase) {
        if (err) {
            callback(err);
        } else {
            db = dbase;
            grid = new mongo.Grid(dbase, 'storage');
            mongoose.connect('mongodb://' + server + '/'+ databaseName);
            callback();
        }
    });
};

// Records

//Saves raw file to gridFS.
exports.saveRecord = function(patKey, inboundFile, inboundFileInfo, inboundXMLType, callback) {
    var buffer = new Buffer(inboundFile);

    var fileMetadata = {patKey: patKey};
    if (inboundXMLType) {
        fileMetadata.fileClass = inboundXMLType;
    }

    console.log(patKey);
    grid.put(buffer, {
        metadata: fileMetadata,
        filename: inboundFileInfo.name,
        content_type: inboundFileInfo.type,
    }, function(err, fileInfo) {
        if (err) {
            callback(err);
        } else {
            /*Relax for now pending further investigation, seems to be chunking overhead.*/
            //if (fileInfo.length !== inboundFileInfo.size) {
            //  callback('file size mismatch');
            //} else {
            callback(null, fileInfo);
            //}
        }
    });
};

exports.getRecordList = function(patKey, callback) {
    db.collection('storage.files', function(err, recordCollection) {
        if (err) {
            callback(err);
        } else {
            recordCollection.find({"metadata.patKey": patKey}, function(err, findResults) {
                findResults.toArray(function(err, recordArray) {
                    var recordResponseArray = [];
                    for (var i = 0; i < recordArray.length; i++) {
                        var recordJSON = {};

                        recordJSON.file_id = recordArray[i]._id;
                        recordJSON.file_name = recordArray[i].filename;
                        recordJSON.file_size = recordArray[i].length;
                        recordJSON.file_mime_type = recordArray[i].contentType;
                        recordJSON.file_upload_date = recordArray[i].uploadDate;

                        if (recordArray[i].metadata.fileClass) {
                            recordJSON.file_class = recordArray[i].metadata.fileClass;
                        }

                        recordResponseArray.push(recordJSON);
                    }

                    callback(null, recordResponseArray);
                });
            });
        }
    });
};

exports.getRecord = function(fileId, callback) {
    //Removed owner validation for demo purposes.
    db.collection('storage.files', function(err, coll) {
        if (err) {
            callback(err);
        } else {
            var objectID = new ObjectId(fileId);
            coll.findOne({"_id": objectID}, function(err, results) {
                if (err) {
                    callback(err);
                } else if (results) {
                    grid.get(objectID, function(err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            var returnFile = data.toString();
                            callback(null, results.filename, returnFile);
                        }
                    });
                } else {
                    callback(new Error('no file'));
                }
            });
        }
    });
};

exports.recordCount = function(patKey, callback) {
    StorageFiles.count({"metadata.patKey" : patKey}, function(err, count) {
        callback(err, count);
    });
};

// Allergies

//Get all allergies.
exports.getAllergies = function(patKey, callback) {
    var query = allergy.find({patKey: patKey}).lean().populate('metadata.attribution', 'record_id merge_reason merged');
    query.exec(function(err, allergyResults) {
        if (err) {
            callback(err);
        } else {
            StorageFiles.populate(allergyResults, {path: 'metadata.attribution.record_id', select: 'filename'}, function(err, docs) {
                if (err) {
                    callback(err);
                } else {
                    //May be part of model?
                    var serverityReference = {
                            "Mild": 1,
                            "Mild to Moderate": 2,
                            "Moderate": 3,
                            "Moderate to Severe": 4,
                            "Severe": 5,
                            "Fatal": 6
                    };
                    for (var i=0;i<docs.length;i++) {
                        for (severity in serverityReference) {
                            if (severity.toUpperCase() === docs[i].severity.toUpperCase()) {
                                docs[i].severity_weight = serverityReference[severity];
                            }
                        }
                    }
                    callback(null, docs);
                }
            });
        }
    });
};

var updateAllergy = function(input_allergy, callback) {
    input_allergy.save(function(err, saveObject) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveObject);
        }
    });
};

//Gets a single allergy based on id.
var getAllergy = exports.getAllergy = function(input_id, callback) {
    allergy.findOne({_id: input_id}, function(err, allergyEntry) {
        if (err) {
            callback(err);
        } else {
            callback(null, allergyEntry);
        }
    });
};

//Saves an array of incoming allergies.
exports.saveNewAllergies = function(patKey, inputArray, sourceID, callback) {
    function saveAllergyObject(allergySaveObject, allergyObjectNumber, inputSourceID, callback) {
        var tempAllergy = new allergy(allergySaveObject);

        tempAllergy.save(function(err, saveResults) { // TODO: double save, logic needs to be updated
            if (err) {
                callback(err);
            } else {
                var tmpMergeEntry = {
                        entry_type: 'allergy',
                        allergy_id: saveResults._id,
                        record_id: inputSourceID,
                        merged: new Date(),
                        merge_reason: 'new'
                };

                saveMerge(tmpMergeEntry, function(err, mergeResults) {
                    if (err) {
                        callback(err);
                    } else {
                        tempAllergy.metadata.attribution.push(mergeResults._id);
                        tempAllergy.patKey = patKey;
                        tempAllergy.save(function(err, saveResults) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, allergyObjectNumber);
                            }
                        });
                    }
                });
            }
        });
    }

    for (var i = 0; i < inputArray.length; i++) {
        var allergyObject = inputArray[i];
        saveAllergyObject(allergyObject, i, sourceID, function(err, savedObjectNumber) {
            if (savedObjectNumber === (inputArray.length - 1)) {
                callback(null);
            }
        });
    }
};

var updateAllergyAndMerge = function(input_allergy, mergeInfo, callback) {
    var tmpMergeEntry = {
        entry_type: 'allergy',
        allergy_id: input_allergy._id,
        record_id: mergeInfo.record_id,
        merged: new Date(),
        merge_reason: mergeInfo.merge_reason
    };

    saveMerge(tmpMergeEntry, function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            input_allergy.metadata.attribution.push(saveResults._id);
            updateAllergy(input_allergy, function(err, saveObject) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

exports.addAllergyMergeEntry = function(update_id, mergeInfo, callback) {
    getAllergy(update_id, function(err, currentAllergy) {
        //console.log(currentAllergy);
        //Needs to get added to, but held out of match for now.
        //currentAllergy.metadata.attribution.push({
        //  record_id: newSourceID,
        //  attributed: new Date(),
        //  attribution: 'duplicate'
        //});

        updateAllergyAndMerge(currentAllergy, mergeInfo, function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};

exports.allergyCount = function(conditions, callback) {
    allergy.count(conditions, function(err, count) {
        callback(err, count);
    });
};

// Merges

exports.getMerges = function(callback) {
    var query = merge.find().populate('allergy_id record_id', 'name severity filename uploadDate');
    query.exec(function (err, mergeResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, mergeResults);
        }
    });
};

var saveMerge = function(mergeObject, callback) {
    var saveMerge = new merge(mergeObject);

    saveMerge.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveResults);
        }
    });
};

exports.mergeCount = function(conditions, callback) {
    merge.count(conditions, function(err, count) {
        callback(err, count);
    });
};
