var _ = require('underscore');
var async = require('async');

var section = require('./section');
var entry = require('./entry');

exports.save = function(dbinfo, secName, input, callback) {
    var Model = dbinfo.matchModels[secName];
    var m = new Model(input);
    m.save(callback);
};

exports.get = function(dbinfo, secName, id, callback) {
    var model = dbinfo.matchModels[secName];
    var query = model.findOne({_id: id}).populate('entry_id match_entry_id').lean();
    query.exec(function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
};

exports.getAll = function(dbinfo, secName, patKey, typeFields, recordFields, callback) {

    var model = dbinfo.matchModels[secName];
    var allFields = typeFields + ' ' + recordFields;

    var query = model.find({patKey: patKey}).populate('entry_id match_entry_id', allFields).lean();
    query.exec(function (err, matchResults) {
        if (err) {
            callback(err);
        } else {
            var returnMatches = [];
            for (var iMatch in matchResults) {
                //Filter to undetermined records.
                if (matchResults[iMatch].determination === undefined) {
                    returnMatches.push(matchResults[iMatch]);
                }
            }
            callback(null, returnMatches);
        }
    });
};

exports.count = function(dbinfo, secName, patKey, conditions, callback) {
    var model = dbinfo.matchModels[secName];
    var query = model.count();
    query.where('determination').in([null, false]);
    var condWPat = _.clone(conditions);
    condWPat.patKey = patKey;
    query.where(condWPat);
    query.exec(function(err, count) {
        callback(err, count);
    });
};

exports.cancel = function(dbinfo, secName, id, reason, callback) {
    var queryMatch = function(cb) {
        var model = dbinfo.matchModels[secName];
        var query = model.findOne({_id: id});
        query.exec(function(err, result) {
            cb(err, result);
        });
    };

    var removeEntry = function(result, cb) {
        entry.remove(dbinfo, secName, result.match_entry_id, function(err) {
            cb(err, result);
        });
    };

    var updateMatch = function(result, cb) {
        result.determination = reason;
        result.save(function(err) {
            cb(err);
        });
    };

    async.waterfall([queryMatch, removeEntry, updateMatch], callback);
};

exports.accept = function(dbinfo, secName, id, reason, callback) {
    var queryMatch = function(cb) {
        var model = dbinfo.matchModels[secName];
        var query = model.findOne({_id: id});
        query.exec(function(err, result) {
            queryResult = {match: result};
            cb(err, queryResult);
        });
    };

    var queryEntry = function(queryResult, cb) {
        var entryId = queryResult.match.match_entry_id;
        var model = dbinfo.models[secName];
        var query = model.findOne({"_id": entryId});
        query.exec(function(err, entry) {
            queryResult.entry = entry;
            cb(err, queryResult);
        });
    };

    var reviewEntry = function(queryResult, cb) {
        var e = queryResult.entry;
        e.reviewed = true;
        e.save(function(err) {
            cb(err, queryResult);
        });
    };

    var updateMatch = function(queryResult, cb) {
        var m = queryResult.match;
        m.determination = reason;
        m.save(function(err) {
            cb(err);
        });
    };

    async.waterfall([queryMatch, queryEntry, reviewEntry, updateMatch], callback);
};
