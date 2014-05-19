var mongo = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var models = require('./models');
var storage = require('./storage');
var merge = require('./merge');
// Connection

var databaseName = 'dre';

var db = null;
var grid = null;
var storageModel = models.storageModel();

var dbinfo = null;

exports.connectDatabase = function connectDatabase(server, callback) {
    if (dbinfo != null) {
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
            storageModel = models.storageModel();
            dbinfo = {};
            dbinfo.db = db;
            dbinfo.grid = grid;
            dbinfo.storageModel = storageModel;
            var r = models.models(c);
            dbinfo.models = r.clinical;
            dbinfo.mergeModels = r.merge;
            callback();
        }
    });
};

// Records

exports.saveRecord = function(patKey, inboundFile, inboundFileInfo, inboundXMLType, callback) {
    storage.saveRecord(dbinfo, patKey, inboundFile, inboundFileInfo, inboundXMLType, callback);
};

exports.getRecordList = function(patKey, callback) {
    storage.getRecordList(dbinfo, patKey, callback);
};

exports.getRecord = function(fileId, callback) {
    storage.getRecord(dbinfo, fileId, callback);
};

exports.recordCount = function(patKey, callback) {
    storage.recordCount(dbinfo, patKey, callback);
};


// Merges

exports.getMerges = function(type, typeFields, recordFields, callback) {
    merge.getMerges(type, typeFields, recordFields, callback);
};

var saveMerge = function(mergeObject, callback) {
    merge.saveMerge(dbinfo, mergeObject, callback);
};

exports.mergeCount = function(type, conditions, callback) {
    merge.count(dbinfo, type, conditions, callback);
};




// Allergies

//Get all allergies.

var getSection = exports.getSection = function(type, patKey, callback) {
    var sectionModel = models.getModel(type);
    var query = sectionModel.find({patKey: patKey}).lean().populate('metadata.attribution', 'record_id merge_reason merged');
    query.exec(function(err, results) {
        if (err) {
            callback(err);
        } else {
            storageModel.populate(results, {path: 'metadata.attribution.record_id', select: 'filename'}, function(err, docs) {
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
    var model = models.getModel(type);
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
        var model = models.getModel(type);
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
                        tempEntry.metadata = {};
                        tempEntry.metadata.attribution = [mergeResults._id];
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
    var model = models.getModel(type);
    model.count(conditions, function(err, count) {
        callback(err, count);
    });
};

exports.allergyCount = function(conditions, callback) {
    sectionEntryCount('allergy', conditions, callback);
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
