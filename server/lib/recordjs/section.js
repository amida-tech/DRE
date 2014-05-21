/*=======================================================================
Copyright 2014 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var merge = require('./merge');
var _ = require('underscore');
var modelutil = require('./modelutil');

exports.getSection = function(dbinfo, type, patKey, callback) {
    var model = dbinfo.models[type];
    var query = model.find({patKey: patKey}).sort('__index').lean().populate('metadata.attribution', 'record_id merge_reason merged');
    query.exec(function(err, results) {
        if (err) {
            callback(err);
        } else {
            dbinfo.storageModel.populate(results, {path: 'metadata.attribution.record_id', select: 'filename'}, function(err, docs) {
                if (err) {
                    callback(err);
                } else {
                    modelutil.mongooseCleanSection(docs);
                    //if (type === 'demographics') {
                    //    //docs = docs[0];
                    //}
                    callback(null, docs);
                }
            });
        }
    });
};

exports.sectionEntryCount = exports.sectionEntryCount = function(dbinfo, type, conditions, callback) {
    var model = dbinfo.models[type];
    model.count(conditions, function(err, count) {
        callback(err, count);
    });
};

var getEntry = exports.getEntry = function(dbinfo, type, input_id, callback) {
    var model = dbinfo.models[type];
    model.findOne({"_id": input_id}, function(err, entry) {
        if (err) {
            callback(err);
        } else {
            callback(null, entry);
        }
    });    
};

exports.saveNewEntries = function(dbinfo, type, patKey, inputArray, sourceID, callback) {
    function saveEntry(entryObject, entryObjectNumber, inputSourceID, callback) {
        var tempEntry = new model(entryObject);

        tempEntry.save(function(err, saveResults) { // TODO: double save, logic needs to be updated
            if (err) {
                callback(err);
            } else {
                var tmpMergeEntry = {
                    entry_type: type,
                    patKey: patKey,
                    entry_id: saveResults._id,
                    record_id: inputSourceID,
                    merged: new Date(),
                    merge_reason: 'new'
                };

                merge.saveMerge(dbinfo, tmpMergeEntry, function(err, mergeResults) {
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

    var model = dbinfo.models[type];
    model.count({patKey: patKey}, function(err, count) {
        count = count + 1;
        if (err) {
            callback(err);
        } else {
            if (Array.isArray(inputArray)) {
                var n = inputArray.length;
                if (n === 0) {
                    callback(new Error('no data'));
                    return;
                }
                
                for (var i = 0; i < inputArray.length; i++) {
                    var entryObject = _.clone(inputArray[i]);
                    entryObject.__index = count + i;
                    saveEntry(entryObject, i, sourceID, function(err, savedObjectNumber) {
                        if (savedObjectNumber === (inputArray.length - 1)) {
                            callback(null);
                        }
                    });
                }
            } else {
                var entryObject = _.clone(inputArray);
                entryObject.__index = count;
                saveEntry(entryObject, 0, sourceID, function(err) {
                    callback(err);
                });
            }
        }
    });
};

var updateEntryAndMerge = function(dbinfo, type, input_entry, mergeInfo, callback) {
    var tmpMergeEntry = {
        entry_type: type,
        patKey: input_entry.patKey,
        entry_id: input_entry._id,
        record_id: mergeInfo.record_id,
        merged: new Date(),
        merge_reason: mergeInfo.merge_reason
    };

    merge.saveMerge(dbinfo, tmpMergeEntry, function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            input_entry.metadata.attribution.push(saveResults._id);
            input_entry.save(function(err, saveObject) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

exports.addEntryMergeEntry = function(dbinfo, type, update_id, mergeInfo, callback) {
    getEntry(dbinfo, type, update_id, function(err, current) {
        //console.log(currentAllergy);
        //Needs to get added to, but held out of match for now.
        //currentAllergy.metadata.attribution.push({
        //  record_id: newSourceID,
        //  attributed: new Date(),
        //  attribution: 'duplicate'
        //});

        updateEntryAndMerge(dbinfo, type, current, mergeInfo, function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};


