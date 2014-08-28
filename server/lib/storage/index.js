var express = require('express');
var fs = require('fs');
var app = module.exports = express();
var parser = require('../parser/index.js');
var dre = require('../dre/index.js');

var extractRecord = parser.extractRecord;
var record = require('blue-button-record');

//Wrapper function to save all components of an incoming object.
function saveComponents(masterObject, masterPartialObject, sourceID, callback) {

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
                record.saveSection(secName, 'test', saveArray, sourceID, function(err) {
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

        //Set initial counter values.
        var totalSections = 0;
        var savedSections = 0;
        for (var secNum in masterPartialObject) {
            totalSections++;
        }

        if (totalSections === savedSections) {
            masterPartialComplete = true;
            checkComponentsComplete();
        }

        function checkSavePartialComponentsComplete () {
            savedSections++;
            if (savedSections === totalSections) {
                masterPartialComplete = true;
                checkComponentsComplete();
            }
        }

        for (var secName in masterPartialObject) {
            var saveArray = masterPartialObject[secName];

            if (saveArray.length === 0) {
                checkSavePartialComponentsComplete();
            } else {
                record.saveMatches(secName, 'test', saveArray, sourceID, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        checkSavePartialComponentsComplete();
                    }
                });

        }
    }
}

saveMasterComponents();
savePartialComponents();

}

//Pull saved records from db for reconciliation.
function getSavedRecords(saved_sections, callback) {

    var responseObject = {};
    var responseIter = 0;
    var responseLength = saved_sections.length;

    //TODO:  Factor patient ID further up stack.
    var patient_id = 'test';

    function checkComplete(current_iteration) {
        responseIter++;
        if (responseIter === responseLength) {
            callback(null, responseObject);
        }
    }

    function getSavedSection(section, callback) {
        record.getSection(section, patient_id, function(err, savedObj) {
            if (err) {
                callback(err);
            } else {
                responseObject[section] = savedObj;
                callback(null);
            }
        });
    }

    for (var iSection in saved_sections) {
        getSavedSection(saved_sections[iSection], function(err) {
            if (err) {
                callback(err);
            } else {
                checkComplete();
            }
        });
    }
}

//Parses raw inbound records into components.
function parseRecord(record_type, record_data, callback) {
    if (record_type === 'application/xml' || record_type === 'text/xml' || record_type == 'text/plain') {
        extractRecord(record_data, function(err, xml_type, parsed_record) {
            if (err) {
                callback(err);
            } else {
                if (xml_type === 'ccda' || xml_type === 'cms') {
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
    //console.log('section array');
    //console.log(sectionArray);

    //Get Saved Records.
    getSavedRecords(sectionArray, function(err, saved_record) {
        if (err) {
            callback(err);
        } else {
            //console.log('parsed records');
            //console.log(JSON.stringify(parsed_record, null, 4));
            //console.log('------------------------');
            //console.log(JSON.stringify(parsed_record, null, 4));
            console.log(parsed_record);


            dre.reconcile(parsed_record, saved_record, parsed_record_identifier, function(err, reconciliation_results, partial_reconciliation_results) {
                //console.log(JSON.stringify(partial_reconciliation_results, null, 10));
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
            record.saveSource('test', record_data, record_metadata, null, function(err, fileInfo) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, fileInfo);
                }
            });
        } else {

            //May need to wrap you.

            record.saveSource('test', record_data, record_metadata, parsed_record_type, function(err, id) {
                if (err) {
                    callback(err);
                } else {
                    //SHIM.
                    if (parsed_record.demographics) {
                        var tmpDemographicsArray = new Array(parsed_record.demographics);
                        //console.log(tmpDemographicsArray);
                        parsed_record.demographics = tmpDemographicsArray;
                    }

                    reconcileRecord(parsed_record, id, function(err) {
                        if (err) {
                            console.error(err);
                            callback(err);
                        } else {                            
                            callback(null, id);
                        }
                    });
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

//Retrieves a specific file for download.
app.get('/api/v1/storage/record/:identifier', function(req, res) {
    record.getSource('test', req.params.identifier, function(err, filename, returnFile) {
        if (err) {
            throw err;
        }
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.send(returnFile);
    });
});

//Returns list of records in storage.
app.get('/api/v1/storage', function(req, res) {
    record.getSourceList('test', function(err, recordList) {
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
