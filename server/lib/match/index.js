var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var _ = require('underscore');
var bbm = require('blue-button-meta');
var dre = require('../dre/index.js');
var async = require('async');


function reRunMatches (matchComponent, matchUser, callback) {

    //Select all matches for the patient.
    //Get MHR.
    //feed them into DRE.
    //need to re-attribute new/dupe/partial.

    function rebuildSourceEntries(sourceRecordArray, sourceRecordUser, sourceRecordSections, callback) {
        var newOutputArray = [];
        async.map(sourceRecordSections, function(matchSection, callback) {
            async.map(sourceRecordArray[matchSection], function (entryIdentifier, callback) {
                record.getEntry(matchSection, sourceRecordUser, entryIdentifier, function (err, results) {
                    if (err) {
                        callback(err);
                    } else {

                        var newResult = _.omit(results, ['_id', 'metadata']);
                        var returnResult = {
                            entry: newResult,
                            record_id: results.metadata.attribution[0].record._id
                        }

                        callback(null, returnResult);
                    }
                });
            }, function (err, newRecord) {
                if (err) {
                    callback(err);
                } else {

                    _.each(newRecord, function(newRec) {
                        newRec.section = matchSection
                        newOutputArray.push(newRec);

                    });
                   
                   callback(null);          
                }
            });
        }, function(err, updatedSection) {
            if (err) {
                callback(err);
            } else {
                callback(null, newOutputArray);
            }      
        });         
    }

    function rebuildMHRRecord(mhrSections, mhrRecordUser, callback) {
        var masterHealthRecord = {};
        //Get elements from MHR.
        async.each(mhrSections, function (section, callback) {
            record.getSection(section, mhrRecordUser, function (err, mhrEntries) {
                if (err) {
                    callback(err);
                } else {
                    //console.log(mhrEntries);
                    masterHealthRecord[section] = mhrEntries;
                    callback(null);
                }
            });
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null, masterHealthRecord);
            }
        });
    }

    record.getMatches(matchComponent, matchUser, "", function(err, matchList) {
            if (err) {
                callback(err);
            } else {

                var srcHealthRecord = {};

                //For each section get list of IDs for query.
                for (var matchEntry in matchList) {
                    if(_.isUndefined(srcHealthRecord[matchList[matchEntry].entry_type])) {
                        srcHealthRecord[matchList[matchEntry].entry_type] = [];
                    }
                    srcHealthRecord[matchList[matchEntry].entry_type].push(matchList[matchEntry].entry._id);
                }

                //Select elements from partial match for rerun.
                var reRunSections = _.uniq(_.pluck(matchList, 'entry_type'));

                rebuildSourceEntries(srcHealthRecord, matchUser, reRunSections, function(err, sourceMatchRecords) {
                    rebuildMHRRecord(reRunSections, matchUser, function(err, mhrMatchRecords) {

                        //Sequentially load each record, so record_id is accurate for src entries.
                        //MHR can all go in.

                        //console.log(sourceMatchRecords);
                        //Will need to apply hygiene to sources as it is on mhr.
                        //async.each(sourceMatchRecords, function(matchSection, callback) {

                        //    console.log(matchSection);


                        //});



                        //console.log(mhrMatchRecords);

                    });

                });            
                
            }
        });


callback();

}



function updateMerged(updateId, updateComponent, updateIndex, updateParameters, callback) {
    //Gather full match object by ID.
    record.getMatch(updateComponent, 'test', updateId, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {

            //resultComponent:   Original Match Object.
            //updateParameters:  Object to Overwrite Original with.
            // updateComponent:  The section (allergies, etc.)
            // updateIndex:  index of valid match from array.

            //Gather partial record from db.
            record.getEntry(updateComponent, 'test', resultComponent.entry._id, function(err, recordResults) {
                if (err) {
                    callback(err);
                } else {

                    //console.log(recordResults);


                    //NOTE:  Only one attribution merge since a partial.
                    var recordId = recordResults.metadata.attribution[0].record._id;
                    record.updateEntry(updateComponent, 'test', resultComponent.matches[updateIndex].match_entry._id, recordId, updateParameters, function(err, updateResults) {
                        if (err) {
                            callback(err);
                        } else {

                            //Need to shim in re-running matches here.
                            record.cancelMatch(updateComponent, 'test', updateId, 'merged', function(err, results) {
                                if (err) {
                                    callback(err);
                                } else {
                                    reRunMatches(updateComponent, 'test', function(err, results) {
                                        callback();
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function processUpdate(updateId, updateIndex, updateComponent, updateParameters, callback) {
    //Can be 1) Merged, 2) Added, 3) Ignored.

    if (updateParameters.determination === 'added') {
        if (updateComponent === 'demographics') {
            callback('Only one demographic accepted');
        }
        record.acceptMatch(updateComponent, 'test', updateId, 'added', callback);
    }

    if (updateParameters.determination === 'merged') {
        //If determination is merged, overwrite original record, drop source object, and update merge history of object.
        updateMerged(updateId, updateComponent, updateIndex, updateParameters.updated_entry, function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    if (updateParameters.determination === 'ignored') {
        record.cancelMatch(updateComponent, 'test', updateId, 'ignored', callback)
    }
}

// Get all matches API.
app.get('/api/v1/matches/:component', function(req, res) {

    if (_.contains(bbm.supported_sections, req.params.component) === false) {
        res.send(404);
    } else {
        record.getMatches(req.params.component, 'test', 'procedure problem product allergen vital name smoking_statuses encounter result_set results plan_id payer_name payer number plan_name"', function(err, matchList) {
            if (err) {
                console.error(err);
                res.send(400, err);
            } else {
                var matchJSON = {};
                matchJSON.matches = matchList;
                res.send(matchJSON);
            }
        });
    }
});

// Get single match API.
app.get('/api/v1/match/:component/:record_id', function(req, res) {
    if (_.contains(bbm.supported_sections, req.params.component) === false) {
        res.send(404);
    } else {
        record.getMatch(req.params.component, 'test', req.params.record_id, function(err, match) {
            if (err) {
                res.send(400, err);
            } else {
                res.send(match);
            }
        });
    }
});

//Post partial record updates.
app.post('/api/v1/matches/:component/:record_id', function(req, res) {

    if (_.contains(bbm.supported_sections, req.params.component) === false) {
        res.send(404);
    } else {
        if (_.contains(['added', 'ignored'], req.body.determination)) {
            processUpdate(req.params.record_id, null, req.params.component, req.body, function(err) {
                if (err) {
                    console.error(err);
                    res.send(400, err);
                } else {
                    res.send(200);
                }
            });
        } else {
            res.send(404);
        }
    }
});

//Post partial record updates.
app.post('/api/v1/matches/:component/:record_id/:record_index', function(req, res) {

    if (_.contains(bbm.supported_sections, req.params.component) === false) {
        res.send(404);
    } else {
        if (_.contains(['merged'], req.body.determination)) {
            processUpdate(req.params.record_id, req.params.record_index, req.params.component, req.body, function(err) {
                if (err) {
                    console.error(err);
                    res.send(400, err);
                } else {
                    res.send(200);
                }
            });
        } else {
            res.send(404);
        }
    }
});
