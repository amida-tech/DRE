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

exports.saveMatch = function(dbinfo, matchObject, callback) {
    var Model = dbinfo.matchModels[matchObject.entry_type];
    var saveMatch = new Model(matchObject);

    //console.log(JSON.stringify(matchObject, null, 4));

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
}

exports.updateMatch = function(dbinfo, type, identifier, updateFields, callback) {
    var model = dbinfo.matchModels[type];
    var query = model.findOne({_id: identifier});
    query.exec(function (err, update_record) {
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
            callback(null, update_record);
        }
    });
}

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
    var query = model.count()
    query.where('determination').in([null, false]);
    //Ignoring Conditions
    //query.where(conditions);
    query.exec(conditions, function(err, count) {
        callback(err, count);
    });
};
