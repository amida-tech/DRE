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

        function sendResponse(componentName) {
            record.getSection(componentName, req.user.username, function (err, componentList) {
                if (err) {
                    res.status(500).end();
                } else {
                    var apiResponse = formatResponse(componentName, componentList);
                    res.send(apiResponse);
                }
            });
        }

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
            throw err;
            res.status(400).send(err);
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
    return secName == "demographics" ? sec[0] : sec;
}

function getMHR(username, callback) {

    supported_sections = _.difference(bbm.supported_sections, ["plan_of_care", "providers", "organizations"]); //, "payers", "claims", "insurance"

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

app.get('/api/v1/master_health_record/:format?', login.checkAuth, function (req, res) {
    var format = "xml";
    if (req.params.format && req.params.format === "json") {
        format = "json";
    }

    var ptKey = req.user.username;

    var notes;

    record.getAllNotes(ptKey, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {

            notes = result;

            getMHR(req.user.username, function (err, result) {
                console.log(result);

                //result.notes=notes;

                if (err) {
                    res.status(500).end();
                } else {
                    var timestamp = new Date().toISOString();
                    timestamp = timestamp.replace(/-/g, '').substring(0, 8);
                    userLastName = result.demographics.name.last.toLowerCase();
                    res.setHeader('Content-disposition', 'attachment; filename=' + 'ccda_record-' + userLastName + '-' + timestamp + '.' + format);

                    if (format === "json") {
                        //return BB JSON
                        record.saveEvent('fileDownloaded', req.user.username, "User downloaded Master Health Record in JSON format (Blue Button) 'ccda_record-" + userLastName + '-' + timestamp + '.' + format + "'", null, function (err) {
                            if (err) {
                                res.status(400).send('Event error ' + err);
                            }
                        });
                        res.send(JSON.stringify(result, null, 4));
                    } else {
                        //return CCDA

                        // console.log(JSON.stringify(result.demographics, null, 10));
                        var response_ccda = generate.generateCCD(result);

                        console.log("response ccda is generated");

                        //console.log(response_ccda);
                        record.saveEvent('fileDownloaded', req.user.username, "User downloaded Master Health Record in CCDA format (Blue Button) 'ccda_record-" + userLastName + '-' + timestamp + '.' + format + "'", null, function (err) {
                            if (err) {
                                res.status(400).send('Event error ' + err);
                            }
                        });
                        res.send(response_ccda);
                    }
                }
            });

        }
    });
});

app.get('/api/v1/get_record/', login.checkAuth, function (req, res) {

    getMHR(req.user.username, function (err, result) {
        //console.log(result);

        if (err) {
            res.status(500).end();
        } else {
            res.send(JSON.stringify(result, null, 4));
        }
    });
});
