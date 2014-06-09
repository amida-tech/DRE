var _ = require('underscore');

var section = require('./section');
var entry = require('./entry');

exports.save = function(dbinfo, secName, matchObject, callback) {
    var Model = dbinfo.matchModels[secName];
    var matchDb = new Model(matchObject);
    matchDb.save(callback);
};

var get = exports.get = function(dbinfo, secName, matchId, callback) {
    var model = dbinfo.matchModels[secName];
    var query = model.findOne({_id: matchId}).populate('entry_id match_entry_id').lean();
    query.exec(function (err, matchResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, matchResults);
        }
    });
};

var updateMatch = function(dbinfo, secName, identifier, updateFields, callback) {
    var model = dbinfo.matchModels[secName];
    var query = model.findOne({
        _id: identifier
    });
    query.exec(function(err, update_record) {
        if (err) {
            callback(err);
        } else {
            if (updateFields.determination) {
                update_record.determination = updateFields.determination;
                update_record.save(function(err, save_results) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, save_results);
                    }
                });
            } else {
                callback('No update determination found.');
            }
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

var updateIgnored = function(dbinfo, secName, id, callback) {
    get(dbinfo, secName, id, function(err, result) {
        if (err) {
            callback(err);
        } else {
            entry.remove(dbinfo, secName, result.match_entry_id._id, function(err, removalResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

exports.cancel = function(dbinfo, secName, id, reason, callback) {
    //If determination is ignored, dump the object from the database.
    updateIgnored(dbinfo, secName, id, function(err, results) {
        updateMatch(dbinfo, secName, id, {determination: reason}, function(err, updateResults) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};

var updateAdded = function(dbinfo, secName, id, callback) {
    get(dbinfo, secName, id, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            var recordId = resultComponent.match_entry_id._id;
            var model = dbinfo.models[secName];
            var query = model.findOne({"_id": recordId});
            query.exec(function(err, entry) {
                if (err) {
                    callback(err);
                } else {
                    entry.reviewed = true;
                    entry.save(function(err, updateResults) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, updateResults);
                        }
                    });
                }

            });
        }
    });
};

exports.accept = function(dbinfo, secName, id, reason, callback) {
    updateAdded(dbinfo, secName, id, function(err, results) {
        updateMatch(dbinfo, secName, id, {determination: reason}, function(err, updateResults) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};
