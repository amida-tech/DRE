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

var get = exports.get = function(dbinfo, secName, input_id, callback) {
    var model = dbinfo.models[secName];

    var query = model.findOne({
        "_id": input_id
    }).populate('metadata.attribution');

    query.exec(callback);
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
    get(dbinfo, secName, update_id, function(err, current) {
        var mergeInfo = {
            record_id: sourceID,
            merge_reason: 'duplicate'
        };
        merge.save(dbinfo, secName, current, mergeInfo, callback);
    });
};
