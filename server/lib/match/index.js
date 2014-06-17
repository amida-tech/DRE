var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var _ = require('underscore');

var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems'];

function updateMerged(updateId, updateComponent, updateParameters, callback) {
    //Gather full match object by ID.
    record.getMatch(updateComponent, updateId, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            //Gather partial record from db.
            record.getEntry(updateComponent, resultComponent.match_entry_id._id, function(err, recordResults) {
                if (err) {
                    callback(err);
                } else {
                    //NOTE:  Only one attribution merge since a partial.
                    var recordId = recordResults.metadata.attribution[0].record_id;
                    record.updateEntry(updateComponent, resultComponent.entry_id, recordId, updateParameters, function(err, updateResults) {
                        if (err) {
                            callback(err);
                        } else {
                            record.cancelMatch(updateComponent, updateId, 'merged', callback);
                        }
                    });
                }
            });
        }
    });
}

function processUpdate(updateId, updateComponent, updateParameters, callback) {
    //Can be 1) Merged, 2) Added, 3) Ignored.

    if (updateParameters.determination === 'added') {
        if (updateComponent === 'demographics') {
            callback('Only one demographic accepted');
        }
        record.acceptMatch(updateComponent, updateId, 'added', callback);
    }

    if (updateParameters.determination === 'merged') {
        //If determination is merged, overwrite original record, drop source object, and update merge history of object.
        updateMerged(updateId, updateComponent, updateParameters.updated_entry, function(err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    if (updateParameters.determination === 'ignored') {
        record.cancelMatch(updateComponent, updateId, 'ignored', callback)
    }
}

function formatName(inputName) {
    var outputName = "";

    if (inputName.last && inputName.first) {
        outputName = inputName.first + " " + inputName.last;
    } else if (inputName.first) {
        outputName = inputName.first;
    } else if (inputName.last) {
        outputName = inputName.last;
    }
    //TODO:  Add middle name handler, prefix, and suffix.
    inputName.displayName = outputName;

    return inputName;
}


function formatMerges(inputMerge) {
    for (var iMerge in inputMerge) {
        //Give Immunizations a name
        if (inputMerge[iMerge].entry_type === 'immunization') {
            if (inputMerge[iMerge].entry_id.product.name) {
                inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.product.name;
            }
            if (inputMerge[iMerge].match_entry_id.product.name) {
                inputMerge[iMerge].match_entry_id.name = inputMerge[iMerge].match_entry_id.product.name;
            }

        }
        //Give Medications a name
        if (inputMerge[iMerge].entry_type === 'medication') {
            if (inputMerge[iMerge].entry_id.product.name) {
                inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.product.name;
            }
            if (inputMerge[iMerge].match_entry_id.product.name) {
                inputMerge[iMerge].match_entry_id.name = inputMerge[iMerge].match_entry_id.product.name;
            }
        }
        //Give Socials a name
        if (inputMerge[iMerge].entry_type === 'social') {
            if (inputMerge[iMerge].entry_id.value) {
                inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.value;
            }
            if (inputMerge[iMerge].match_entry_id.value) {
                inputMerge[iMerge].match_entry_id.name = inputMerge[iMerge].match_entry_id.value;
            }
        }
        //Give Demographics a name
        if (inputMerge[iMerge].entry_type === 'demographic') {
            var tmpName;
            if (inputMerge[iMerge].entry_id.name) {
                tmpName = formatName(inputMerge[iMerge].entry_id.name).displayName;
                inputMerge[iMerge].entry_id.name = tmpName;
            }
            if (inputMerge[iMerge].match_entry_id.name) {
                tmpName = formatName(inputMerge[iMerge].match_entry_id.name).displayName;
                inputMerge[iMerge].match_entry_id.name = tmpName;
            }
        }
    }
}

//Get all merges API.
app.get('/api/v1/matches/:component', function(req, res) {

    if (_.contains(supportedComponents, req.params.component) === false) {
        res.send(404);
    } else {
        record.getMatches(req.params.component, 'test', 'name severity product.name value', function(err, matchList) {
            if (err) {
                console.error(err);
                res.send(400, err);
            } else {
                var matchJSON = {};
                matchJSON.matches = matchList;
                formatMerges(matchJSON.matches);
                res.send(matchJSON);
            }
        });
    }
});


//Post partial record updates.
app.post('/api/v1/matches/:component/:record_id', function(req, res) {

    if (_.contains(supportedComponents, req.params.component) === false) {
        res.send(404);
    } else {
        if (_.contains(['added', 'ignored', 'merged'], req.body.determination)) {
            processUpdate(req.params.record_id, req.params.component, req.body, function(err) {
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