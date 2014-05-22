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
var fs = require('fs');
var app = module.exports = express();
var parser = require('../parser/index.js');
var dre = require('../dre/index.js');

var extractRecord = parser.extractRecord;
var record = require('../recordjs');

//Wrapper function to save all components of an incoming object.
function saveComponents(masterObject, masterPartialObject, sourceID, callback) {

        //console.log(masterObject);

    //console.log(masterPartialObject);
    var masterComplete = false;
    var masterPartialComplete = false;

    function checkComponentsComplete() {
        if (masterComplete && masterPartialComplete) {
            callback(null);
        }
    }

    function saveMasterComponents() {

        //Set initial counter values.
        var totalSections = 0;
        var savedSections = 0;
        for (var secNum in masterObject) {
            totalSections++;
        }

        function checkSaveMasterComponentsComplete () {
            savedSections++;
            //console.log(savedSections);
            if (savedSections === totalSections) {
                masterComplete = true;
                checkComponentsComplete();
            }
        }

        for (var secName in masterObject) {
            var saveArray = masterObject[secName];
            if (saveArray.length === 0) {
                checkSaveMasterComponentsComplete();
            } else {
                record["saveNew" + record.capitalize(secName)]('test', saveArray, sourceID, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        checkSaveMasterComponentsComplete();
                    }
                });
            }
        }
    }

    function savePartialComponents() {
        //console.log(JSON.stringify(masterPartialObject, null, 10));
        //Get Section Object length.
        var totalSections = 0;
        var savedSections = 0;
        for (var secNum in masterPartialObject) {
            totalSections++;
        }

        if (totalSections === savedSections) {
            callback(null);
        }

        for (var secName in masterPartialObject) {

            //console.log(masterPartialObject[secName]);
            var saveArray = masterPartialObject[secName][0].partial_array;

            /*if (secName === 'demographics') {
                var tmpArray = [];
                tmpArray.push(masterPartialObject[secName][0].partial_array);
                saveArray = tmpArray;
            }*/

            //console.log(JSON.stringify(saveArray, null, 10));

            if (saveArray.length === 0) {
                savedSections++;
                if (totalSections === savedSections) {
                    callback(null);
                }
            } else {

                //console.log(JSON.stringify(masterPartialObject, null, 10));
                //WRAP IN FUNCTION TO MAINTAIN MATCH VALUES.

                function savePartialComponent(thisPartialObject, section_name) {
                    record["savePartial" + record.capitalize(section_name)]('test', saveArray, sourceID, function(err, save_partial_id) {
                            if (err) {
                                callback(err);
                            } else {

                                //console.log(thisPartialObject[0]);

                                var tmpMatch = {
                                    entry_type: section_name,
                                    entry_id: thisPartialObject[0].match_entry_id,
                                    match_entry_id: save_partial_id
                                }

                                //Conditionally take diff/partial.
                                if (thisPartialObject[0].partial_match.match === 'diff') {
                                    tmpMatch.diff = thisPartialObject[0].partial_match.diff;
                                } else {
                                    tmpMatch.percent = thisPartialObject[0].partial_match.percent;
                                }

                                record["add" + record.capitalize(section_name) + "MatchEntry"]('test', tmpMatch, function(err, save_match_response) {
                                if (err) {
                                    callback(err);
                                } else {
                                    savedSections++;
                                    if (totalSections === savedSections) {
                                        masterPartialComplete = true;
                                        checkComponentsComplete();
                                    }
                                }
                            });
                        }
                    });
            }
            savePartialComponent(masterPartialObject[secName], secName);
        }
    }
}

saveMasterComponents();
savePartialComponents();

}

//Pull saved records from db for reconciliation.
function getSavedRecord(saved_sections, callback) {
    var responseObject = {};
    var responseIter = 0;
    var patient_id = 'test';

    function checkComplete(current_iteration) {
        if (current_iteration == (saved_sections.length - 1)) {
            callback(null, responseObject);
        }
    }

    function getSavedSection(iteration, section) {
        try {
            record["get" + record.capitalize(section)](patient_id, function(err, savedObj) {
                //console.log('hit');
                responseObject[section] = savedObj;
                checkComplete(iteration);
            });
        } catch (section_err) {
            console.log(section_err);
        }
    }

    for (var iSection in saved_sections) {
        getSavedSection(iSection, saved_sections[iSection]);
    }
}

//Parses raw inbound records into components.
function parseRecord(record_type, record_data, callback) {
    if (record_type === 'application/xml' || record_type === 'text/xml') {
        extractRecord(record_data, function(err, xml_type, parsed_record) {

            if (err) {
                callback(err);
            } else {
                if (xml_type === 'ccda') {

                    callback(null, xml_type, parsed_record);

                } else {
                    callback(null, null);
                }
            }
        });
    } else {
        callback(null, null);
    }
}

//Pulls saved components from DB, reconciles with incoming.
function reconcileRecord(parsed_record, parsed_record_identifier, callback) {


    var sectionArray = [];

    for (var parsed_section in parsed_record) {
        sectionArray.push(parsed_section);
    }

    //console.log(sectionArray);


    getSavedRecord(sectionArray, function(err, saved_record) {
        if (err) {
            callback(err);
        } else {
            dre.reconcile(parsed_record, saved_record, parsed_record_identifier, function(err, reconciliation_results, partial_reconciliation_results) {
                
                saveComponents(reconciliation_results, partial_reconciliation_results, parsed_record_identifier, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            });
        }
    });
}

//Wrapper function for all match/merge operations.
function importRecord(record_metadata, record_data, callback) {
    parseRecord(record_metadata.type, record_data, function(err, parsed_record_type, parsed_record) {
        if (err) {
            callback(err);
        } else if (!parsed_record_type) {
            record.saveRecord('test', record_data, record_metadata, null, function(err, fileInfo) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, fileInfo);
                }
            });
        } else {

            //May need to wrap you.

            record.saveRecord('test', record_data, record_metadata, parsed_record_type, function(err, fileInfo) {
                if (err) {
                    callback(err);
                } else {
                    //SHIM.

                    if (parsed_record.demographics) {
                        var tmpDemographicsArray = new Array(parsed_record.demographics);
                        //console.log(tmpDemographicsArray);
                        parsed_record.demographics = tmpDemographicsArray;
                    }

                    reconcileRecord(parsed_record, fileInfo._id, function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, fileInfo);
                        }
                    })
                }
            });
        }
    });
}

//Placeholder validation function.
function validateFileMessage(requestObject, callback) {
    callback(null);
}

//Master wrapper function.
function processUpload(recordUpload, callback) {
    if (!recordUpload) {
        callback('Wrong object name');
    } else {
        validateFileMessage(recordUpload, function(err) {
            if (err) {
                callback(err);
            } else {
                fs.readFile(recordUpload.path, 'utf8', function(err, fileData) {
                    if (err) {
                        callback(err);
                    } else {
                        importRecord(recordUpload, fileData, function(err, import_results) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, import_results);
                            }
                        });
                    }
                });
            }
        });
    }
}

//Routes.

app.get('/api/v1/storage/record/:identifier', function(req, res) {
    record.getRecord(req.params.identifier, function(err, filename, returnFile) {
        if (err) {
            throw err;
        }
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.send(returnFile);
    });
});

//Returns list of records in storage.
app.get('/api/v1/storage', function(req, res) {
    record.getRecordList('test', function(err, recordList) {
        var recordResponse = {};
        recordResponse.storage = recordList;
        res.send(recordResponse);
    });
});

//Uploads a file into storage.
app.put('/api/v1/storage', function(req, res) {
    //console.log(req.files.file);
    processUpload(req.files.file, function(err) {
        if (err) {
            console.error(err);
            res.send(400, err);
        } else {
            res.send(200);
        }
    });
});