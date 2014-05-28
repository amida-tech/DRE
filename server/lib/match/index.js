/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

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
        //Flag record as reviewed so it is visible.
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
function updateMerged(updateId, updateComponent, callback) {


    function updateMainObject(updateComponent, entry_id, updateJSON, recordId, callback) {

        record["update" + record.capitalize(record.sectionToType[updateComponent])]('test', entry_id, updateJSON, function(err, updateResults) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                //Add attribution to rec.

                //console.log(entry_id);

                var mergeObject = {
                    entry_type: record.sectionToType[updateComponent],
                    patKey: 'test',
                    entry_id: entry_id._id,
                    record_id: recordId,
                    merged: new Date(),
                    merge_reason: 'update'
                };

                //console.log(mergeObject);

                record.setMerge(mergeObject, function(err, mergeResult) {
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


    console.log(updateComponent);
    console.log(updateId);
    record.getMatch(updateComponent, updateId, function(err, resultComponent) {
        if (err) {
            callback(err);
        } else {
            console.log(resultComponent);
            record["get" + record.capitalize(record.sectionToType[updateComponent])](resultComponent.match_entry_id._id, function(err, recordResults) {
                if (err) {
                    callback(err);
                } else {

                    //console.log(recordResults.metadata.attribution[0]);
                    var recordId = recordResults.metadata.attribution[0].record_id;

                    var updateJSON = {};
                    for (var iUpdate in resultComponent.match_entry_id) {
                        //Filter metadata.
                        if (iUpdate.substring(0, 1) !== "_") {
                            updateJSON[iUpdate] = resultComponent.match_entry_id[iUpdate];
                        }
                    }
                    updateJSON.reviewed = true;

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

    console.log(updateComponent);

    //Clean parameters.
    var cleanParameters = {};
    cleanParameters.determination = updateParameters.determination;

    //Can be 1) Merged, 2) Added, 3) Ignored.
    if (cleanParameters.determination === 'added') {
        updateAdded(updateId, updateComponent, function(err, results) {
            saveRecord(updateId, updateComponent, cleanParameters, function(err, saveResults) {
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
        updateMerged(updateId, updateComponent, function(err, results) {
            saveRecord(updateId, updateComponent, cleanParameters, function(err, saveResults) {
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
            saveRecord(updateId, updateComponent, cleanParameters, function(err, saveResults) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }

}


function saveRecord(updateId, updateComponent, updateParameters, callback) {
    record.updateMatch(updateComponent, updateId, updateParameters, function(err, updateResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, updateResults);
        }
    });
}

//Get all merges API.
app.get('/api/v1/matches/:component', function(req, res) {

    if (_.contains(supportedComponents, req.params.component) === false) {
        res.send(404);
    } else {
        record.getMatches(req.params.component, 'name severity', 'filename uploadDate', function(err, matchList) {
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


//Get all merges API.
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