var express = require('express');
var app = module.exports = express();
var Promise = require("bluebird");
var record = require('blue-button-record');
var bb = require('blue-button');
var _ = require('lodash');
var bbm = require('blue-button-meta');
var fs = require('fs');
var path = require('path');
var login = require('../login');
var generate = require('blue-button-generate');

// blue bird to promisify record API
Promise.promisifyAll(require("blue-button-record"));

// var historyRecord = require('blue-button-record');

var supportedComponents = bbm.supported_sections.reduce(function (r, c) {
    r[c] = true;
    return r;
}, {});

function formatResponse(srcComponent, srcResponse) {

    //console.log(srcResponse);

    var srcReturn = {};
    //Clean __v tag.
    for (var ir in srcResponse) {
        if (srcResponse[ir].__v >= 0) {
            delete srcResponse[ir].__v;
        }
    }
    srcReturn[srcComponent] = srcResponse;
    return srcReturn;
}

app.get('/api/v1/record/:component', login.checkAuth, function (req, res) {
    if (!supportedComponents[req.params.component]) {
        res.status(404).end();
    } else {

        var sendResponse = function (componentName) {
            record.getSection(componentName, req.user.username, function (err, componentList) {
                if (err) {
                    res.status(500).end();
                } else {
                    var apiResponse = formatResponse(componentName, componentList);
                    res.status(200).send(apiResponse);
                }
            });
        };

        sendResponse(req.params.component);
    }
});

// Update demographic information from profile page
app.post('/api/v1/record/demographics', login.checkAuth, function (req, res) {
    console.log("posting", req.user.username, req.body);
    var db_id = req.body._id;
    var info = req.body;

    console.log(info, req.user.username, req.body._id, db_id);
    record.updateEntry('demographics', req.user.username, req.body._id, null, info, function (err) {
        if (err) {
            res.status(400).send(err);
            throw err;
        } else {

            record.saveEvent('infoUpdate', req.user.username, "User updated profile details", null, function (err) {
                if (err) {
                    res.status(400).send('Event error ' + err);
                } else {
                    console.log('profile info updated');
                    res.status(200).send("OK");
                }
            });

        }
    });
});

// CCDA generation. uses promise-based blue-button-record API
// (via bluebird module) to combine returned sections, propagating
// back to caller when done or on error via @callback

function prep(sec, secName) {
    return secName === "demographics" ? sec[0] : sec;
}

function getMHR(username, callback) {

    var supported_sections = _.difference(bbm.supported_sections, ["plan_of_care", "providers", "organizations"]); //, "payers", "claims", "insurance"

    var aggregatedResponse = {},
        count = 0,
        components = supported_sections;

    supported_sections.forEach(function (secName) {
        record.getSectionAsync(secName, username).then(function (sec) {

            if (sec.length !== 0) {
                _.extend(aggregatedResponse, formatResponse(secName, prep(sec, secName)));
            }
            if (++count === components.length) {
                callback(null, aggregatedResponse);
            }
        }).catch(function (e) {
            console.log(e);
            //temporary error shim, need to investigate.
            //callback("Error");
        });
    });
}

function getMHRFormat(ptKey, format, patientEntered, callback) {
    getMHR(ptKey, function (err2, result) {
        if (err2) {
            callback(err2);
        } else {
            var timestamp = new Date().toISOString();
            timestamp = timestamp.replace(/-/g, '').substring(0, 8);
            var userLastName = result.demographics.name.last.toLowerCase();
            var fileName = 'ccda_record-' + userLastName + '-' + timestamp + '.' + format;
            if (patientEntered) {
                record.getAllNotes(ptKey, function (err, notes) {
                    if (err) {
                        callback(err);
                    } else {
                        //go through and add in notes
                        if (format === "json") {
                            callback(null, fileName, result);
                        } else {
                            var response_ccda = generate.generateCCD(result);
                            console.log("response ccda is generated");
                            callback(null, fileName, response_ccda);
                        }
                    }
                });
            } else {
                //go through and remove patient entered medications
                var new_result = result;
                if (result.medications !== undefined) {
                    for (var i = result.medications.length - 1; i >= -1; i--) {
                        if (i === -1) {
                            if (format === "json") {
                                callback(null, fileName, result);
                            } else {
                                var response_ccda = generate.generateCCD(result);
                                console.log("response ccda is generated");
                                callback(null, fileName, response_ccda);
                            }
                        } else {
                            if (new_result.medications[i].med_metadata !== undefined) {
                                if (new_result.medications[i].med_metadata.patient_entered) {
                                    new_result.medications.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

app.get('/api/v1/master_health_record/:format?', login.checkAuth, function (req, res) {
    var format = "xml";
    if (req.params.format && req.params.format === "json") {
        format = "json";
    }

    getMHRFormat(req.user.username, format, false, function (err, fileName, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            record.saveEvent('fileDownloaded', req.user.username, "User downloaded Master Health Record in " + format.toUpperCase() + " format (Blue Button) '" + fileName + "'", null, function (err3) {
                if (err3) {
                    console.log('Event error ' + err3);
                }
            });
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            if (format === "json") {
                res.status(200).send(JSON.stringify(result, null, 4));
            } else {
                res.status(200).send(result);
            }
        }
    });
});

app.get('/api/v1/master_health_record/:format/:patient?', login.checkAuth, function (req, res) {
    var format = "xml";
    if (req.params.format && req.params.format === "json") {
        format = "json";
    }
    var patient = false;
    if (req.params.patient && req.params.patient === "patient") {
        patient = true;
    }

    getMHRFormat(req.user.username, format, patient, function (err, fileName, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            record.saveEvent('fileDownloaded', req.user.username, "User downloaded Master Health Record in " + format.toUpperCase() + " format (Blue Button) '" + fileName + "'", null, function (err3) {
                if (err3) {
                    console.log('Event error ' + err3);
                }
            });
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            if (format === "json") {
                res.status(200).send(JSON.stringify(result, null, 4));
            } else {
                res.status(200).send(result);
            }
        }
    });
});

app.get('/api/v1/get_record/', login.checkAuth, function (req, res) {
    getMHR(req.user.username, function (err, result) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).send(JSON.stringify(result, null, 4));
        }
    });
});
