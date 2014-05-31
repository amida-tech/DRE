exports.saveMatch = function(dbinfo, matchObject, callback) {
    var Model = dbinfo.matchModels[matchObject.entry_type];
    var saveMatch = new Model(matchObject);
    saveMatch.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveResults);
        }
    });
};

exports.getMatch = function(dbinfo, type, matchId, callback) {
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

exports.updateMatch = function(dbinfo, type, identifier, updateFields, callback) {
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

exports.getMatches = function(dbinfo, type, typeFields, recordFields, callback) {

    var model = dbinfo.matchModels[type];
    var allFields = typeFields + ' ' + recordFields;

    var query = model.find().populate('entry_id match_entry_id', allFields).lean();
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

exports.count = function(dbinfo, type, conditions, callback) {
    var model = dbinfo.matchModels[type];
    var query = model.count();
    query.where('determination').in([null, false]);
    //Ignoring Conditions
    //query.where(conditions);
    query.exec(conditions, function(err, count) {
        callback(err, count);
    });
};
