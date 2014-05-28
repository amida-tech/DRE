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


exports.removeEntry = function(dbinfo, type, patKey, recordId, callback) {
    
    function removeModel (callback) {
        var model = dbinfo.models[type];
        var query = model.update({
            patKey: patKey,
            _id: recordId
        }, {archived: true});

        query.exec(function(err, results) {
            if(err) {
                callback(err);
            } else {
                callback(null, results);    
            }
        });
    }

    function removeMerge (callback) {
        var model = dbinfo.mergeModels[type];
        var query = model.update({
            entry_id: recordId
        }, {archived: true});

        query.exec(function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    }

    removeMerge(function(err) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            removeModel(function(err) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
}

exports.getSection = function(dbinfo, type, patKey, callback) {
    var model = dbinfo.models[type];

    /*var query = model.find({
        patKey: patKey,
        reviewed: true,
        archived: false
    }).sort('__index').lean().populate('metadata.attribution', 'record_id merge_reason merged');*/

    var query = model.find({});
    query.where('archived').in([null, false]);
    query.where('reviewed', true);
    query.where('patKey', patKey);
    query.sort('__index');
    query.lean()
    query.populate('metadata.attribution', 'record_id merge_reason merged');

    query.exec(function(err, results) {
        if (err) {
            callback(err);
        } else {

            dbinfo.storageModel.populate(results, {
                path: 'metadata.attribution.record_id',
                select: 'filename'
            }, function(err, docs) {
                if (err) {
                    callback(err);
                } else {
                    modelutil.mongooseCleanSection(docs);
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

    var query = model.findOne({
        "_id": input_id
    }).populate('metadata.attribution');

    query.exec(function(err, entry) {
        if (err) {
            callback(err);
        } else {
            callback(null, entry);
        }
    });
};

exports.updateEntry = function(dbinfo, type, patKey, recordId, recordUpdate, callback) {

    var model = dbinfo.models[type];
    var query = model.findOne({
        "_id": recordId
    });

    query.exec(function(err, entry) {
        if (err) {
            callback(err);
        } else {
            for (var iLine in recordUpdate) {
                if (iLine === 'metadata') {
                    for (var iAttribution in recordUpdate[iLine].attribution) {
                        entry[iLine].attribution.push(recordUpdate[iLine].attribution[iAttribution]);
                    }
                } else {
                    entry[iLine] = recordUpdate[iLine];     
                }
            }

            entry.save(function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
        }
    });

}



exports.saveNewEntries = function(dbinfo, type, patKey, inputArray, sourceID, callback) {

    //This seems to be returning before all saves are complete.

    function saveEntry(entryObject, entryObjectNumber, inputSourceID, callback) {
        var tempEntry = new model(entryObject);

        tempEntry.save(function(err, saveResults) {
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
    var saveLoopLength = 0;
    var saveLoopIter = 0;

    if (_.isArray(inputArray)) {
        saveLoopLength = inputArray.length;
    }

    function checkLoopComplete() {
        saveLoopIter++;
        if (saveLoopIter === saveLoopLength) {
            callback(null);
        }

    }

    var count = 0;



    if (_.isArray(inputArray)) {

        if (inputArray.length === 0) {
            callback(new Error('no data'));
        } else {
            for (var i = 0; i < inputArray.length; i++) {
                var entryObject = _.clone(inputArray[i]);
                //I have no idea what this things point is.
                entryObject.__index = count + i;
                entryObject.reviewed = true;
                saveEntry(entryObject, i, sourceID, function(err, savedObjectNumber) {
                    checkLoopComplete();
                });
            }
        }
    } else {

        var entryObject = _.clone(inputArray);
        entryObject.__index = count;
        entryObject.reviewed = true;
        saveEntry(entryObject, 0, sourceID, function(err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    }
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

exports.savePartialEntries = function(dbinfo, type, patKey, inputArray, sourceID, callback) {

    function saveEntry(entryObject, entryMatch, entrySourceId, sourceRecId, callback) {

        function savePartialMerge (type, patKey, fileId, entryId, matchId, callback) {

             var tmpMergeEntry = {
                    entry_type: type,
                    patKey: patKey,
                    entry_id: entryId,
                    record_id: fileId,
                    merged: new Date(),
                    merge_reason: 'new'
                };

                //console.log(tmpMergeEntry);

                merge.saveMerge(dbinfo, tmpMergeEntry, function(err, mergeResults) {
                    if (err) {
                        callback(err);
                    } else {
                        //console.log(mergeResults);
                        tempEntry.metadata = {};
                        tempEntry.metadata.attribution = [mergeResults._id];
                        tempEntry.patKey = patKey;
                        tempEntry.save(function(err, saveResults) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, saveResults);
                            }
                        });
                    }
                });
        }

        function savePartialMatch (type, patKey, entryId, matchEntryId, matchObject, callback) {
             var tmpMatch = {
                    entry_type: type,
                    entry_id: entryId,
                    match_entry_id: matchEntryId
                }

                //HACK: extending saving of partial matches

                //Conditionally take diff/partial.
                if (matchObject.match === 'diff' ) {
                    tmpMatch.diff = matchObject.diff;
                } else if (matchObject.match === 'partial'){
                    tmpMatch.diff = matchObject.diff;
                    tmpMatch.percent = matchObject.percent;
                    tmpMatch.diff = matchObject.diff;
                }

                //Passing on sublements
                if (matchObject.subelements) {
                    tmpMatch.subelements=matchObject.subelements;
                }

                saveMatchEntries(dbinfo, type, patKey, tmpMatch, function(err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, results);
                    }

                });

        }

        //console.log(entryObject);
        var tempEntry = new model(entryObject);
        tempEntry.save(function(err, saveResults) {
            if (err) {
                callback(err);
            } else {

                savePartialMatch(type, patKey, entrySourceId, saveResults._id, entryMatch, function(err, partialMatchResults) {
                    if (err) {
                        callback(err);
                    } else {
                        //BAD:  entrySourceId wrong here.
                        savePartialMerge(type, patKey, sourceRecId, saveResults._id, partialMatchResults._id, function(err, partialMergeResults) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                })

            }
        });
    }


    var model = dbinfo.models[type];
    var saveLoopLength = 0;
    var saveLoopIter = 0;

    if (_.isArray(inputArray)) {
        saveLoopLength = inputArray.length;
    }

    function checkLoopComplete() {
        saveLoopIter++;
        if (saveLoopIter === saveLoopLength) {
            callback(null);
        }

    }

    var count = 0;

    if (_.isArray(inputArray)) {

        if (inputArray.length === 0) {
            callback(new Error('no data'));
        } else {
            for (var i = 0; i < inputArray.length; i++) {
                var entryObject = _.clone(inputArray[i].partial_array);
                //I have no idea what this things point is.
                entryObject.__index = count + i;
                entryObject.reviewed = false;
                entryObject.patKey = patKey;
                var entryPartialMatch = inputArray[i].partial_match;
                var entryPartialMatchRecordId = inputArray[i].match_record_id;
                saveEntry(entryObject, entryPartialMatch, entryPartialMatchRecordId, sourceID, function(err) {
                    checkLoopComplete();
                });
            }
        }
    } else {
        var entryObject = _.clone(inputArray);
        entryObject.__index = count;
        entryObject.reviewed = false;
        var entryPartialMatch = inputArray[i].partial_match;
        var entryPartialMatchRecordId = inputArray[i].match_record_id;
        saveEntry(entryObject, entryPartialMatch, entryPartialMatchRecordId, function(err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    }




    /*
    var model = dbinfo.models[type];
    model.count({
        patKey: patKey
    }, function(err, count) {
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
                    entryObject.reviewed = false;
                    entryObject.patKey = patKey;
                    saveEntry(entryObject, i, sourceID, function(err, savedObjectNumber, savedObjectId) {
                        if (savedObjectNumber === (inputArray.length - 1)) {
                            callback(null, savedObjectId);
                        }
                    });
                }
            } else {
                var entryObject = _.clone(inputArray);
                entryObject.__index = count;
                entryObject.reviewed = false;
                entryObject.patKey = patKey;
                saveEntry(entryObject, 0, sourceID, function(err, savedObjectNumber, savedObjectId) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, savedObjectId);
                    }

                });
            }
        }
    });*/
};

exports.getPartialSection = function(dbinfo, type, patKey, callback) {

    var model = dbinfo.models[type];
    //console.log(model);
    /*var query = model.find({
        patKey: patKey,
        reviewed: false,
        archived: false
    }).sort('__index').lean().populate('metadata.attribution', 'record_id merge_reason merged');*/

    var query = model.find({});
    query.where('archived').in([null, false]);
    query.where('reviewed', false);
    query.where('patKey', patKey);
    query.sort('__index');
    query.lean()
    query.populate('metadata.attribution', 'record_id merge_reason merged');



    query.exec(function(err, results) {
        if (err) {
            callback(err);
        } else {
            //console.log(results);
            dbinfo.storageModel.populate(results, {
                path: 'metadata.attribution.record_id',
                select: 'filename'
            }, function(err, docs) {
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

var saveMatchEntries = exports.saveMatchEntries = function(dbinfo, type, patKey, inputObject, callback) {

    var model = dbinfo.matchModels[type];

    var tempEntry = new model(inputObject);

    tempEntry.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveResults);

        }
    });

};