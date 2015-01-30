var express = require('express');
var fs = require('fs');
var app = module.exports = express();
var parser = require('../parser/index.js');
var dre = require('../dre/index.js');
var login = require('../login');


var extractRecord = parser.extractRecord;
var record = require('blue-button-record');

//Wrapper function to save all components of an incoming object.
function saveComponents(username, masterObject, masterPartialObject, sourceID, callback) {

    var masterComplete = false;
    var masterPartialComplete = false;

    function checkComponentsComplete() {
        if (masterComplete && masterPartialComplete) {
            callback(null);
        }
    }

    function saveMasterComponents(username) {

        //Set initial counter values.
        var totalSections = 0;
        var savedSections = 0;
        for (var secNum in masterObject) {
            totalSections++;
        }

        function checkSaveMasterComponentsComplete() {
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
                record.saveSection(secName, username, saveArray, sourceID, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        checkSaveMasterComponentsComplete();
                    }
                });
            }
        }
    }

    function savePartialComponents(username) {

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

        function checkSavePartialComponentsComplete() {
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
                record.saveMatches(secName, username, saveArray, sourceID, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        checkSavePartialComponentsComplete();
                    }
                });

            }
        }
    }

    saveMasterComponents(username);
    savePartialComponents(username);

}

module.exports.saveComponents = saveComponents;

//Pull saved records from db for reconciliation.
function getSavedRecords(username, saved_sections, callback) {

    var responseObject = {};
    var responseIter = 0;
    var responseLength = saved_sections.length;

    //TODO:  Factor patient ID further up stack.
    var patient_id = username;

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
    var supported_formats = ["ccda", "c32", "cda", "cms", "blue-button.js"];
    if (record_type === 'application/xml' || record_type === 'text/xml' || record_type == 'text/plain' || record_type == 'application/json') {
        extractRecord(record_data, function(err, format_type, parsed_record) {
            if (err) {
                callback(err);
            } else {
                if (supported_formats.indexOf(format_type) >= 0) {
                    callback(null, format_type, parsed_record);
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
function reconcileRecord(username, parsed_record, parsed_record_identifier, callback) {

    var sectionArray = [];

    for (var parsed_section in parsed_record) {
        sectionArray.push(parsed_section);
    }
    //console.log('section array');
    //console.log(sectionArray);

    //Get Saved Records.
    getSavedRecords(username, sectionArray, function(err, saved_record) {
        if (err) {
            callback(err);
        } else {
            //console.log('parsed records');
            //console.log(JSON.stringify(parsed_record, null, 4));
            //console.log('------------------------');
            //console.log(JSON.stringify(parsed_record, null, 4));
            //console.log(parsed_record);


            dre.reconcile(username, parsed_record, saved_record, parsed_record_identifier, function(err, reconciliation_results, partial_reconciliation_results) {
                //console.log(JSON.stringify(partial_reconciliation_results, null, 10));
                saveComponents(username, reconciliation_results, partial_reconciliation_results, parsed_record_identifier, function(err) {
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
function importRecord(username, record_metadata, record_data, callback) {

    console.log('username', username);
    console.log('meta', record_metadata);
    //console.log('data', record_data);

    parseRecord(record_metadata.type, record_data, function(err, parsed_record_type, parsed_record) {
        if (err) {
            callback(err);
        } else if (!parsed_record_type) {
            console.log("parsed_record", parsed_record);
            record.saveSource(username, record_data, record_metadata, null, function(err, fileInfo) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, fileInfo);
                }
            });
        } else {

            //May need to wrap you.
            record.saveSource(username, record_data, record_metadata, parsed_record_type, function(err, id) {
                if (err) {
                    callback(err);
                } else {
                    //SHIM.
                    if (parsed_record.demographics) {
                        var tmpDemographicsArray = new Array(parsed_record.demographics);
                        //console.log(tmpDemographicsArray);
                        parsed_record.demographics = tmpDemographicsArray;
                    }

                    reconcileRecord(username, parsed_record, id, function(err) {
                        if (err) {
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

module.exports.importRecord = importRecord;

//Wrapper function for all match/merge operations for HL7 data.
function importHL7Record(username, record_metadata, record_data, parsed_record, callback) {

    console.log('username', username);
    console.log('meta', record_metadata);
    console.log('data', record_data);



    //May need to wrap you.
    record.saveSource(username, record_data, record_metadata, "hl7", function(err, id) {
        if (err) {
            callback(err);
        } else {
            //SHIM.
            if (parsed_record.demographics) {
                var tmpDemographicsArray = new Array(parsed_record.demographics);
                //console.log(tmpDemographicsArray);
                parsed_record.demographics = tmpDemographicsArray;
            }

            //TODO: add parsing of HL7 here

            reconcileRecord(username, parsed_record, id, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, id);
                }
            });
        }
    });
}

module.exports.importHL7Record = importHL7Record;


//Placeholder validation function.
function validateFileMessage(requestObject, callback) {
    callback(null);
}

//Master wrapper function.
function processUpload(username, recordUpload, callback) {
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
                        importRecord(username, recordUpload, fileData, function(err, import_results) {
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
app.get('/api/v1/storage/record/:identifier', login.checkAuth, function(req, res) {
    record.getSource(req.user.username, req.params.identifier, function(err, filename, returnFile) {
        if (err) {
            throw err;
        }
        record.saveEvent('fileDownloaded', req.user.username, 'no notes', req.params.identifier, function(err) {
            if (err) {
                res.status(400).send('Event error ' + err);
            } else {
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.status(200).send(returnFile);

            }
        });
    });
});

//Returns list of records in storage.
app.get('/api/v1/storage', login.checkAuth, function(req, res) {
    // console.log(login.checkAuth);
    record.getSourceList(req.user.username, function(err, recordList) {
        var recordResponse = {};
        recordResponse.storage = recordList;
        res.send(recordResponse);
    });
});

//Uploads a file into storage.
app.put('/api/v1/storage', login.checkAuth, function(req, res) {
    // console.log(req);
    // console.log(login.checkAuth);
    processUpload(req.user.username, req.files.file, function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            record.saveEvent('fileUploaded', req.user.username, 'no notes (filename should go here, in future)', req.files.file.name, function(err) {
                if (err) {
                    res.status(400).send('Event error ' + err);
                } else {
                    res.status(200).end();

                }
            });
        }
    });
});
