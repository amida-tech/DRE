"use strict";

var _ = require('underscore');
var async = require('async');

var merge = require('./merge');
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
};

exports.getSection = function(dbinfo, type, patKey, callback) {
    var model = dbinfo.models[type];

    var query = model.find({});
    query.where('archived').in([null, false]);
    query.where('reviewed', true);
    query.where('patKey', patKey);
    query.lean();
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

            //Perform Update.
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

};

exports.saveNewEntries = function(dbinfo, type, patKey, input, sourceID, callback) {
    var saveNewEntry = function(entryObject, cb) {
        var entryModel = new dbinfo.models[type](entryObject);

        var saveEntry = function(cb) {
            entryModel.save(function(err, saveResult) {
                cb(err, saveResult); // needed bacause model.save cb has 3 parameters
            });
        };

        var saveMerge = function(saveResult, cb) {
            var mergeEntry = {
                entry_type: type,
                patKey: patKey,
                entry_id: saveResult._id,
                record_id: sourceID,
                merged: new Date(),
                merge_reason: 'new'
            };

            merge.saveMerge(dbinfo, mergeEntry, cb);           
        };

        var updateEntry = function(saveMergeResult, cb) {
            entryModel.metadata = {attribution: [saveMergeResult._id]};
            entryModel.save(function(err, saveResult) {
                cb(err, saveResult && saveResult._id);
            });
        };

        async.waterfall([saveEntry, saveMerge, updateEntry], cb);
    };

    var prepForDb = function(entryObject) {
        var r = _.clone(entryObject);
        r.patKey = patKey;
        r.reviewed = true;
        return r;
    };

    if (_.isArray(input)) {
        if (input.length === 0) {
            callback(new Error('no data'));
        } else {
            var inputArrayForDb = input.map(prepForDb);
            async.map(inputArrayForDb, saveNewEntry, callback);
        }
    } else {
        var inputForDb = prepForDb(input);
        saveNewEntry(inputForDb, callback);
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

var saveMatchEntries = exports.saveMatchEntries = function(dbinfo, type, patKey, inputObject, callback) {

    var Model = dbinfo.matchModels[type];

    var tempEntry = new Model(inputObject);

    tempEntry.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveResults);

        }
    });

};

//Needs investigation as well as to premature return

exports.savePartialEntries = function(dbinfo, type, patKey, inputArray, sourceID, callback) {
    var Model = dbinfo.models[type];

    var saveEntry = function(saveInput, callback) {
        var entryObject = saveInput.object;
        var entryMatch = saveInput.match;
        var entrySourceId = saveInput.matchRecordId;

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
                };

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
        var tempEntry = new Model(entryObject);
        tempEntry.save(function(err, saveResults) {
            if (err) {
                callback(err);
            } else {

                savePartialMatch(type, patKey, entrySourceId, saveResults._id, entryMatch, function(err, partialMatchResults) {
                    if (err) {
                        callback(err);
                    } else {
                        savePartialMerge(type, patKey, sourceID, saveResults._id, partialMatchResults._id, function(err, partialMergeResults) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                });

            }
        });
    };

    var prepForDb = function(entry) {
        var r = {};        
        var entryForDb = _.clone(entry.partial_array);
        entryForDb.reviewed = false;
        entryForDb.patKey = patKey;
        r.object = entryForDb;
        r.match = entry.partial_match;
        r.matchRecordId = entry.match_record_id;
        return r;
    };

    if (_.isArray(inputArray)) {
        if (inputArray.length === 0) {
            callback(new Error('no data'));
        } else {
            var inputArrayForDb = inputArray.map(prepForDb);
            async.map(inputArrayForDb, saveEntry, callback);
        }
    } else {
        var inputForDb = prepForDb(inputArray);
        saveEntry(inputForDb, callback);
    }

};

exports.getPartialSection = function(dbinfo, type, patKey, callback) {

    var model = dbinfo.models[type];

    var query = model.find({});
    query.where('archived').in([null, false]);
    query.where('reviewed', false);
    query.where('patKey', patKey);
    query.lean();
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
                    callback(null, docs);
                }
            });
        }
    });
};

