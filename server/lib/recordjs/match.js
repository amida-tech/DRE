var _ = require('underscore');

var section = require('./section');

exports.saveMatch = function(dbinfo, matchObject, callback) {
    var Model = dbinfo.matchModels[matchObject.entry_type];
    var matchDb = new Model(matchObject);
    matchDb.save(callback);
};

var getMatch = exports.getMatch = function(dbinfo, type, matchId, callback) {
    var model = dbinfo.matchModels[type];
    var query = model.findOne({_id: matchId}).populate('entry_id match_entry_id').lean();
    query.exec(function (err, matchResults) {
        if (err) {
            callback(err);
        } else {
            //console.log(matchResults);
            callback(null, matchResults);
        }
    });
};

var updateMatch = exports.updateMatch = function(dbinfo, type, identifier, updateFields, callback) {
    var model = dbinfo.matchModels[type];
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

exports.getMatches = function(dbinfo, type, patKey, typeFields, recordFields, callback) {

    var model = dbinfo.matchModels[type];
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

exports.count = function(dbinfo, type, patKey, conditions, callback) {
    var model = dbinfo.matchModels[type];
    var query = model.count();
    query.where('determination').in([null, false]);
    var condWPat = _.clone(conditions);
    condWPat.patKey = patKey;
    query.where(condWPat);
    query.exec(function(err, count) {
        callback(err, count);
    });
};

var updateIgnored = function(dbinfo, type, id, callback) {
    getMatch(dbinfo, type, id, function(err, result) {
        if (err) {
            callback(err);
        } else {
            section.removeEntry(dbinfo, type, result.match_entry_id._id, function(err, removalResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
};

exports.cancel = function(dbinfo, type, id, reason, callback) {
    //If determination is ignored, dump the object from the database.
    updateIgnored(dbinfo, type, id, function(err, results) {
        updateMatch(dbinfo, type, id, {determination: reason}, function(err, updateResults) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};






var updateAdded = function(dbinfo, type, id, callback) {
    getMatch(dbinfo, type, id, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            var recordId = resultComponent.match_entry_id._id;
            var model = dbinfo.models[type];
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

exports.accept = function(dbinfo, type, id, reason, callback) {
    updateAdded(dbinfo, type, id, function(err, results) {
        updateMatch(dbinfo, type, id, {determination: reason}, function(err, updateResults) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};
