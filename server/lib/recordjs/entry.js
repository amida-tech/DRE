"use strict";

var async = require('async');

var merge = require('./merge');

exports.remove = function(dbinfo, secName, id, callback) {
    
    var removeModel = function(callback) {
        var model = dbinfo.models[secName];
        var query = model.update({_id: id}, {archived: true});
        query.exec(callback);
    };

    var removeMerge = function(callback) {
        var model = dbinfo.mergeModels[secName];
        var query = model.update({entry_id: id}, {archived: true});
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

exports.update = function(dbinfo, secName, id, sourceId, updateObject, callback) {
    var model = dbinfo.models[secName];
    var query = model.findOne({"_id": id});

    query.exec(function(err, entry) {
        if (err) {
            callback(err);
        } else {
            entry.reviewed = true;
            for (var iLine in updateObject) {
                if (iLine.substring(0, 1) !== "_") {
                    if(iLine !== 'metadata' && iLine !== 'reviewed' && iLine !== 'archived' && iLine !== 'patKey') {
                        entry[iLine] = updateObject[iLine];     
                    }
                }
            }
            var mergeInfo = {record_id: sourceId, merge_reason: 'update'};
            merge.save(dbinfo, secName, entry, mergeInfo, callback);
        }
    });
};

exports.save = function(dbinfo, secName, input, sourceId, callback) {
    var entryModel = new dbinfo.models[secName](input);

    var saveEntry = function(callback) {
        entryModel.save(function(err, saveResult) {
            callback(err, saveResult); // needed bacause model.save callback has 3 parameters
        });
    };

    var saveMerge = function(saveResult, callback) {
        var mergeInfo = {record_id: sourceId, merge_reason: 'new'};
        merge.save(dbinfo, secName, saveResult, mergeInfo, callback);
    };

    async.waterfall([saveEntry, saveMerge], callback);
};

exports.duplicate = function(dbinfo, secName, id, sourceId, callback) {
    var model = dbinfo.models[secName];

    var query = model.findOne({"_id": id});
    query.exec(function(err, current) {
        var mergeInfo = {
            record_id: sourceId,
            merge_reason: 'duplicate'
        };
        merge.save(dbinfo, secName, current, mergeInfo, callback);
    });
};
