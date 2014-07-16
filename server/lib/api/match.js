module.exports = function (app) {
    var record = require('blue-button-record');
    var _ = require('underscore');
    var config = require('config');
    var supportedComponents = config.supportedComponents;

    function updateMerged(updateId, updateComponent, updateParameters, callback) {
        //Gather full match object by ID.
        record.getMatch(updateComponent, 'test', updateId, function(err, resultComponent) {
            if (err) {
                callback(err);
            } else {
                //Gather partial record from db.
                record.getEntry(updateComponent, 'test', resultComponent.match_entry._id, function(err, recordResults) {
                    if (err) {
                        callback(err);
                    } else {
                        //NOTE:  Only one attribution merge since a partial.
                        var recordId = recordResults.metadata.attribution[0].record._id;
                        record.updateEntry(updateComponent, 'test', resultComponent.entry._id, recordId, updateParameters, function(err, updateResults) {
                            if (err) {
                                callback(err);
                            } else {
                                record.cancelMatch(updateComponent, 'test', updateId, 'merged', callback);
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
            record.acceptMatch(updateComponent, 'test', updateId, 'added', callback);
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
            record.cancelMatch(updateComponent, 'test', updateId, 'ignored', callback)
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

    var formatSectionEntry = {
        immunizations: function(entry) {
            if (entry.product.name) {
                entry.name = entry.product.name;
            }
        },
        medications: function(entry) {
            if (entry.product.name) {
                entry.name = entry.product.name;
            }
        },
        social_history: function(entry) {
            if (entry.value) {
                entry.name = entry.value;
            }
        },
        demographics: function(entry) {
            if (entry.name) {
                var tmpName = formatName(entry.name).displayName;
                entry.name = tmpName;
            }
        }
    }

    function formatSectionEntries(secName, inputMerge) {
        var formatEntry = formatSectionEntry[secName];
        if (formatEntry) {
            for (var iMerge in inputMerge) {
                formatEntry(inputMerge[iMerge].entry);
                formatEntry(inputMerge[iMerge].match_entry);
            }
        }
    }

    // Get all matches API.
    app.get('/api/v1/matches/:component', function(req, res) {

        if (!supportedComponents[req.params.component]) {
            res.send(404);
        } else {
            record.getMatches(req.params.component, 'test', 'procedure problem product allergen vital name smoking_statuses encounter result_set results', function(err, matchList) {
                if (err) {
                    console.error(err);
                    res.send(400, err);
                } else {
                    var matchJSON = {};
                    matchJSON.matches = matchList;
                    formatSectionEntries(req.params.component, matchJSON.matches);
                    res.send(matchJSON);
                }
            });
        }
    });

    // Get single match API.
    app.get('/api/v1/match/:component/:record_id', function(req, res) {
        if (!supportedComponents[req.params.component]) {
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

        if (!supportedComponents[req.params.component]) {
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
}