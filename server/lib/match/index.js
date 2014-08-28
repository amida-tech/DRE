var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var _ = require('underscore');
var bbm = require('blue-button-meta');

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

                            record.cancelMatch(updateComponent, 'test', updateId, 'merged', callback);
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
