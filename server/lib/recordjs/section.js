"use strict";

var _ = require('underscore');
var async = require('async');

var merge = require('./merge');
var modelutil = require('./modelutil');
var match = require('./match');

exports.removeEntry = function(dbinfo, secName, recordId, callback) {
    
    var removeModel = function(callback) {
        var model = dbinfo.models[secName];
        var query = model.update({_id: recordId}, {archived: true});
        query.exec(callback);
    };

    var removeMerge = function(callback) {
        var model = dbinfo.mergeModels[secName];
        var query = model.update({entry_id: recordId}, {archived: true});
        query.exec(callback);
    };

    async.series([removeMerge, removeModel], callback);
};

var auxGetSection = function(dbinfo, secName, patKey, reviewed, callback) {
    var model = dbinfo.models[secName];

    var query = model.find({});
    query.where('archived').in([null, false]);
    query.where('reviewed', reviewed);
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

exports.getSection = function(dbinfo, secName, patKey, callback) {
    auxGetSection(dbinfo, secName, patKey, true, callback);
};

exports.getPartialSection = function(dbinfo, secName, patKey, callback) {
    auxGetSection(dbinfo, secName, patKey, false, callback);
};

exports.sectionEntryCount = exports.sectionEntryCount = function(dbinfo, secName, conditions, callback) {
    var model = dbinfo.models[secName];
    model.count(conditions, callback);
};

var getEntry = exports.getEntry = function(dbinfo, secName, input_id, callback) {
    var model = dbinfo.models[secName];

    var query = model.findOne({
        "_id": input_id
    }).populate('metadata.attribution');

    query.exec(callback);
};

exports.updateEntry = function(dbinfo, secName, recordId, fileId, recordUpdate, callback) {
    var model = dbinfo.models[secName];
    var query = model.findOne({"_id": recordId});

    query.exec(function(err, entry) {
        if (err) {
            callback(err);
        } else {
            entry.reviewed = true;
            for (var iLine in recordUpdate) {
                if (iLine.substring(0, 1) !== "_") {
                    if(iLine !== 'metadata' && iLine !== 'reviewed' && iLine !== 'archived' && iLine !== 'patKey') {
                        entry[iLine] = recordUpdate[iLine];     
                    }
                }
            }
            var mergeInfo = {record_id: fileId, merge_reason: 'update'};
            merge.save(dbinfo, secName, entry, mergeInfo, callback);
        }
    });
};

var saveNewEntry = function(dbinfo, secName, patKey, entryObject, sourceID, callback) {
    var entryModel = new dbinfo.models[secName](entryObject);

    var saveEntry = function(callback) {
        entryModel.save(function(err, saveResult) {
            callback(err, saveResult); // needed bacause model.save callback has 3 parameters
        });
    };

    var saveMerge = function(saveResult, callback) {
        var mergeInfo = {record_id: sourceID, merge_reason: 'new'};
        merge.save(dbinfo, secName, saveResult, mergeInfo, callback);
    };

    async.waterfall([saveEntry, saveMerge], callback);
};

exports.saveNewEntries = function(dbinfo, secName, patKey, input, sourceID, callback) {
    var localSaveNewEntry = function(entryObject, cb) {
        saveNewEntry(dbinfo, secName, patKey, entryObject, sourceID, cb);    
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
            async.map(inputArrayForDb, localSaveNewEntry, callback);
        }
    } else {
        var inputForDb = prepForDb(input);
        localSaveNewEntry(inputForDb, callback);
    }
};

exports.duplicateEntry = function(dbinfo, secName, update_id, sourceID, callback) {
    getEntry(dbinfo, secName, update_id, function(err, current) {
        var mergeInfo = {
            record_id: sourceID,
            merge_reason: 'duplicate'
        };
        merge.save(dbinfo, secName, current, mergeInfo, callback);
    });
};

exports.savePartialEntries = function(dbinfo, secName, patKey, input, sourceID, callback) {
    var savePartialEntry = function(entryObject, cb) {
        var localSaveNewEntry = function(cb2) {
            saveNewEntry(dbinfo, secName, patKey, entryObject.entry, sourceID, cb2);    
        };

        function savePartialMatch (matchEntryId, cb2) {
            var tmpMatch = {
                patKey: patKey,
                entry_type: dbinfo.sectionToType[secName],
                entry_id: entryObject.matchRecordId,
                match_entry_id: matchEntryId
            };

            var matchObject = entryObject.match;
                
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
                tmpMatch.subelements = matchObject.subelements;
            }

            match.saveMatch(dbinfo, tmpMatch, cb2);
        }

        async.waterfall([localSaveNewEntry, savePartialMatch], cb);
    };

    var prepForDb = function(entry) {
        var r = {};        
        var entryForDb = _.clone(entry.partial_array);
        entryForDb.reviewed = false;
        entryForDb.patKey = patKey;
        r.entry = entryForDb;
        r.match = entry.partial_match;
        r.matchRecordId = entry.match_record_id;
        return r;
    };

    if (_.isArray(input)) {
        if (input.length === 0) {
            callback(new Error('no data'));
        } else {
            var inputArrayForDb = input.map(prepForDb);
            async.map(inputArrayForDb, savePartialEntry, callback);
        }
    } else {
        var inputForDb = prepForDb(input);
        savePartialEntry(inputForDb, callback);
    }
};
