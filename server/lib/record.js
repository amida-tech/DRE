var mongo = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var sectionEntry = require('../models/sectionEntry');
var StorageFiles = require('../models/storage_files');

// Connection

var databaseName = 'dre';

var db = null;
var grid = null;

exports.connectDatabase = function connectDatabase(server, callback) {
    if (db != null) {
        callback();
        return;
    }
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

var getSection = exports.getSection = function(type, patKey, callback) {
    var sectionModel = sectionEntry.getModel(type);
    var query = sectionModel.find({patKey: patKey}).lean().populate('metadata.attribution', 'record_id merge_reason merged');
    query.exec(function(err, results) {
        if (err) {
            callback(err);
        } else {
            StorageFiles.populate(results, {path: 'metadata.attribution.record_id', select: 'filename'}, function(err, docs) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, docs);
                }
            });
        }
    });
};

exports.getAllergies = function(patKey, callback) {
    getSection('allergy', patKey, callback);
};

var updateEntry = function(input_entry, callback) {
    input_entry.save(function(err, saveObject) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveObject);
        }
    });
};

var getEntry = exports.getEntry = function(type, input_id, callback) {
    var model = sectionEntry.getModel(type);
    model.findOne({_id: input_id}, function(err, entry) {
        if (err) {
            callback(err);
        } else {
            callback(null, entry);
        }
    });    
};

//Gets a single allergy based on id.
var getAllergy = exports.getAllergy = function(input_id, callback) {
    getEntry('allergy', input_id, callback);
};

var saveNewEntries = exports.saveNewEntries = function(type, patKey, inputArray, sourceID, callback) {
    function saveEntry(entryObject, entryObjectNumber, inputSourceID, callback) {
        var model = sectionEntry.getModel(type);
        var tempEntry = new model(entryObject);

        tempEntry.save(function(err, saveResults) { // TODO: double save, logic needs to be updated
            if (err) {
                callback(err);
            } else {
                var tmpMergeEntry = {
                    entry_type: type,
                    entry_id: saveResults._id,
                    record_id: inputSourceID,
                    merged: new Date(),
                    merge_reason: 'new'
                };

                saveMerge(tmpMergeEntry, function(err, mergeResults) {
                    if (err) {
                        callback(err);
                    } else {
                        tempEntry.metadata.attribution.push(mergeResults._id);
                        tempEntry.patKey = patKey;
                        tempEntry.save(function(err, saveResults) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, entryObjectNumber);
                            }
                        });
                    }
                });
            }
        });
    }

    for (var i = 0; i < inputArray.length; i++) {
        var entryObject = inputArray[i];
        saveEntry(entryObject, i, sourceID, function(err, savedObjectNumber) {
            if (savedObjectNumber === (inputArray.length - 1)) {
                callback(null);
            }
        });
    }
};

//Saves an array of incoming allergies.
exports.saveNewAllergies = function(patKey, inputArray, sourceID, callback) {
    saveNewEntries('allergy', patKey, inputArray, sourceID, callback);
};

var updateEntryAndMerge = function(type, input_entry, mergeInfo, callback) {
    var tmpMergeEntry = {
        entry_type: type,
        entry_id: input_entry._id,
        record_id: mergeInfo.record_id,
        merged: new Date(),
        merge_reason: mergeInfo.merge_reason
    };

    saveMerge(tmpMergeEntry, function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            input_entry.metadata.attribution.push(saveResults._id);
            updateEntry(input_entry, function(err, saveObject) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

var addEntryMergeEntry = exports.addEntryMergeEntry = function(type, update_id, mergeInfo, callback) {
    getEntry(type, update_id, function(err, current) {
        //console.log(currentAllergy);
        //Needs to get added to, but held out of match for now.
        //currentAllergy.metadata.attribution.push({
        //  record_id: newSourceID,
        //  attributed: new Date(),
        //  attribution: 'duplicate'
        //});

        updateEntryAndMerge(type, current, mergeInfo, function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};

exports.addAllergyMergeEntry = function(update_id, mergeInfo, callback) {
    addEntryMergeEntry('allergy', update_id, mergeInfo, callback);
};

var sectionEntryCount = exports.sectionEntryCount = function(type, conditions, callback) {
    var model = sectionEntry.getModel(type);
    model.count(conditions, function(err, count) {
        callback(err, count);
    });
};

exports.allergyCount = function(conditions, callback) {
    sectionEntryCount('allergy', conditions, callback);
};

// Merges

var collectionNames = {
    allergy: 'Allergies'
};

var models = {};

exports.getMerges = function(type, typeFields, recordFields, callback) {
    var model = sectionEntry.getMergeModel(type);
    var allFields = typeFields + ' ' + recordFields;
    var query = model.find({entry_type: type}).populate('entry_id record_id', allFields);
    query.exec(function (err, mergeResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, mergeResults);
        }
    });
};

var saveMerge = function(mergeObject, callback) {
    var Model = sectionEntry.getMergeModel(mergeObject.entry_type);
    var saveMerge = new Model(mergeObject);

    saveMerge.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveResults);
        }
    });
};

exports.mergeCount = function(type, conditions, callback) {
    var model = sectionEntry.getMergeModel(type);
    model.count(conditions, function(err, count) {
        callback(err, count);
    });
};

// Utility

exports.cleanSectionEntries = function(input) {
    var result = [];
    var n = input.length;
    for (var i =0; i<n; ++i) {
        var cleanEntry = _.clone(input[i]);
        ['__v', '_id', 'patKey', 'metadata'].forEach(function(key) {
            delete cleanEntry[key];
        });
        result.push(cleanEntry);
    }
    return result;
};
