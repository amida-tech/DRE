var express = require('express');
var app = module.exports = express();
var record = require('../recordjs');
var _ = require('underscore');

var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'socialHistory', 'demographics', 'problems'];

function updateAdded(updateId, updateComponent, callback) {

    function getPartialMatch(matchEntryId, callback) {

        record["getPartial" + record.capitalize(updateComponent)]('test', function(err, results) {
            for (var iRecord in results) {
                if (results[iRecord]._id.toString() === matchEntryId.toString()) {
                    callback(null, results[iRecord]);
                }
            }
        });
    }

    function updatePartialMatch(partialMatch, callback) {

        record["update" + record.capitalize(record.sectionToType[updateComponent])]('test', partialMatch._id, {
            reviewed: true
        }, function(err, updateResults) {
            if (err) {
                callback(err);
            } else {
                callback(null, err);
            }
        });

    }

    record.getMatch(updateComponent, updateId, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            getPartialMatch(resultComponent.match_entry_id._id, function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    updatePartialMatch(results, function(err, updateResults) {
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

}


function updateIgnored(updateId, updateComponent, callback) {

    record.getMatch(updateComponent, updateId, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            record["removePartial" + record.capitalize(record.sectionToType[updateComponent])]('test', resultComponent.match_entry_id._id, function(err, removalResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
}


function updateMerged(updateId, updateComponent, updateParameters, callback) {

    function updateMainObject(updateComponent, entry_id, updateJSON, recordId, callback) {

        //First create merge entry.
        var mergeObject = {
            entry_type: record.sectionToType[updateComponent],
            patKey: 'test',
            entry_id: entry_id._id,
            record_id: recordId,
            merged: new Date(),
            merge_reason: 'update'
        };

        record.setMerge(mergeObject, function(err, mergeResult) {
            if (err) {
                callback(err);
            } else {
                updateJSON.metadata.attribution = [mergeResult._id];
                record["update" + record.capitalize(record.sectionToType[updateComponent])]('test', entry_id, updateJSON, function(err, updateResults) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, err);
                    }
                });
            }
        });

    }

    function removeMergedObject(updateId, updateComponent, callback) {

        record["removePartial" + record.capitalize(record.sectionToType[updateComponent])]('test', updateId, function(err, removalResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });

    }

    //Gather full match object by ID.
    record.getMatch(updateComponent, updateId, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            //Gather partial record from db.
            record["get" + record.capitalize(record.sectionToType[updateComponent])](resultComponent.match_entry_id._id, function(err, recordResults) {
                if (err) {
                    callback(err);
                } else {

                    var updateJSON = {};

                    //NOTE:  Only one attribution merge since a partial.
                    var recordId = recordResults.metadata.attribution[0].record_id;

                    //Pull update data.
                    for (var iUpdate in updateParameters) {
                        //Filter inbound metadata and attribution.
                        if (iUpdate.substring(0, 1) !== "_") {
                            if(iUpdate !== 'metadata' && iUpdate !== 'reviewed' && iUpdate !== 'archived' && iUpdate !== 'patKey') {
                                updateJSON[iUpdate] = updateParameters[iUpdate];
                            }   
                        }
                    }

                    updateJSON.reviewed = true;
                    updateJSON.metadata = {};

                    updateMainObject(updateComponent, resultComponent.entry_id, updateJSON, recordId, function(err, results) {
                        if (err) {
                            callback(err);
                        } else {
                            removeMergedObject(resultComponent.match_entry_id._id, updateComponent, function(err, results) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null);
                                }
                            });
                            
                        }
                    });
                }
            });



        }

    });
}

function processUpdate(updateId, updateComponent, updateParameters, callback) {


    //Clean parameters.
    var cleanParameters = {};
    cleanParameters.determination = updateParameters.determination;
    cleanParameters.updated_entry = updateParameters.updated_entry;

    //Can be 1) Merged, 2) Added, 3) Ignored.

    if (cleanParameters.determination === 'added') {
        if (updateComponent === 'demographics') {
            callback('Only one demographic accepted');
        }
        updateAdded(updateId, updateComponent, function(err, results) {
            saveMatchRecord(updateId, updateComponent, cleanParameters, function(err, saveResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }

    if (cleanParameters.determination === 'merged') {
        //If determination is merged, overwrite original record, drop source object, and update merge history of object.
        updateMerged(updateId, updateComponent, cleanParameters.updated_entry, function(err, results) {
            saveMatchRecord(updateId, updateComponent, cleanParameters, function(err, saveResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }

    if (cleanParameters.determination === 'ignored') {
        //If determination is ignored, dump the object from the database.
        updateIgnored(updateId, updateComponent, function(err, results) {
            saveMatchRecord(updateId, updateComponent, cleanParameters, function(err, saveResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }

}


function saveMatchRecord(updateId, updateComponent, updateParameters, callback) {
    record.updateMatch(updateComponent, updateId, updateParameters, function(err, updateResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, updateResults);
        }
    });
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
        record.getMatches(req.params.component, 'name severity product.name value', 'filename uploadDate', function(err, matchList) {
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