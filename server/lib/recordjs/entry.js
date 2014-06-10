"use strict";

var async = require('async');

var merge = require('./merge');
var match = require('./match');

exports.remove = function(dbinfo, secName, recordId, callback) {
    
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

exports.get = function(dbinfo, secName, id, callback) {
    var model = dbinfo.models[secName];
    var query = model.findOne({"_id": id});
    query.populate('metadata.attribution').lean();
    query.exec(function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};

exports.update = function(dbinfo, secName, recordId, fileId, recordUpdate, callback) {
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

exports.save = function(dbinfo, secName, patKey, entryObject, sourceID, callback) {
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

exports.duplicate = function(dbinfo, secName, update_id, sourceID, callback) {
    var model = dbinfo.models[secName];

    var query = model.findOne({"_id": update_id});
    query.exec(function(err, current) {
        var mergeInfo = {
            record_id: sourceID,
            merge_reason: 'duplicate'
        };
        merge.save(dbinfo, secName, current, mergeInfo, callback);
    });
};
