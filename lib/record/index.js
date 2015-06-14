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
var moment2 = require('moment');

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
    var db_id = req.body._id;
    var info = req.body;
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

function formatDate(input_date) {
    var tmpDateArr;
    if (input_date.precision === "year") {
        tmpDateArr = moment2.utc(input_date.date).format('YYYY');
        input_date.displayDate = tmpDateArr;
    }
    if (input_date.precision === "month") {
        tmpDateArr = moment2.utc(input_date.date).format('MMM, YYYY');
        input_date.displayDate = tmpDateArr;
    }
    if (input_date.precision === "day") {
        tmpDateArr = moment2.utc(input_date.date).format('MMM D, YYYY');
        input_date.displayDate = tmpDateArr;
    }
    if (input_date.precision === "hour") {
        tmpDateArr = moment2.utc(input_date.date).format('MMM D, YYYY h:mm a');
        input_date.displayDate = tmpDateArr;
    }
    if (input_date.precision === "minute") {
        tmpDateArr = moment2.utc(input_date.date).format('MMM D, YYYY h:mm a');
        input_date.displayDate = tmpDateArr;
    }
    if (input_date.precision === "second") {
        tmpDateArr = moment2.utc(input_date.date).format('MMM D, YYYY h:mm a');
        input_date.displayDate = tmpDateArr;
    }
    if (input_date.precision === "subsecond") {
        tmpDateArr = moment2.utc(input_date.date).format('MMM D, YYYY h:mm a');
        input_date.displayDate = tmpDateArr;
    }
    return tmpDateArr;
}

function extractAndFormat(type, entry) {

    var tmpDates = '';
    var displayDates = '';

    //handling date_time location for lab results
    if (type === 'results' && !_.isUndefined(entry.results) && entry.results.length > 0) {
        if (!_.isUndefined(entry.results[0].date_time.point)) {
            tmpDates = [entry.results[0].date_time.point];
        } else if (!_.isUndefined(entry.results[0].date_time.low) && !_.isUndefined(entry.results[0].date_time.high)) {
            tmpDates = [entry.results[0].date_time.low, entry.results[0].date_time.high];
        } else if (!_.isUndefined(entry.results[0].date_time.low) && _.isUndefined(entry.results[0].date_time.high)) {
            tmpDates = [entry.results[0].date_time.low];
        } else if (_.isUndefined(entry.results[0].date_time.low) && !_.isUndefined(entry.results[0].date_time.high)) {
            tmpDates = [entry.results[0].date_time.high];
        }
    }

    //handling date_time location for payers(insurance)
    if ((type === 'payers' || type === 'insurance') && !_.isUndefined(entry.participant.date_time)) {
        if (!_.isUndefined(entry.participant.date_time.point)) {
            tmpDates = [entry.participant.date_time.point];
        } else if (!_.isUndefined(entry.participant.date_time.low) && !_.isUndefined(entry.participant.date_time.high)) {
            tmpDates = [entry.participant.date_time.low, entry.participant.date_time.high];
        } else if (!_.isUndefined(entry.participant.date_time.low) && _.isUndefined(entry.participant.date_time.high)) {
            tmpDates = [entry.participant.date_time.low];
        } else if (_.isUndefined(entry.participant.date_time.low) && !_.isUndefined(entry.participant.date_time.high)) {
            tmpDates = [entry.participant.date_time.high];
        }
    }

    //handling date_time for the rest of the sections
    if (!_.isUndefined(entry.date_time)) {
        if (!_.isUndefined(entry.date_time.point)) {
            tmpDates = [entry.date_time.point];
        } else if (!_.isUndefined(entry.date_time.low) && !_.isUndefined(entry.date_time.high)) {
            tmpDates = [entry.date_time.low, entry.date_time.high];
        } else if (!_.isUndefined(entry.date_time.low) && _.isUndefined(entry.date_time.high)) {
            tmpDates = [entry.date_time.low];
        } else if (_.isUndefined(entry.date_time.low) && !_.isUndefined(entry.date_time.high)) {
            tmpDates = [entry.date_time.high];
        }
    }

    if (tmpDates.length === 1) {
        displayDates = formatDate(tmpDates[0]);
    } else if (tmpDates.length === 2) {
        displayDates = formatDate(tmpDates[0]) + ' - ' + formatDate(tmpDates[1]);
    }

    return {
        "display": displayDates,
        "temp": tmpDates
    };
}

function displayType(type) {
    var display_type = type;
    if (type === 'social_history') {
        display_type = 'social';
    }
    if (type === 'payers') {
        display_type = 'insurance';
    }
    if (type === 'problems') {
        display_type = 'conditions';
    }

    return display_type;
}

function collateComments(entry, all_notes, callback) {
    var comments = [];

    //find all notes for current entry
    for (var i = 0; i <= all_notes.length; i++) {
        if (i === all_notes.length) {
            callback(null, comments);
        } else {
            if (all_notes[i].entry.toString() === entry._id.toString()) {
                var comment = {
                    date: all_notes[i].datetime,
                    starred: all_notes[i].star,
                    comment: all_notes[i].note,
                    entry_id: all_notes[i].entry,
                    note_id: all_notes[i]._id
                };
                comments.push(comment);
            }
        }
    }
}

function parseEntries(master_record, notes, callback) {
    //attaches all the notes into meta.notes to entries in master health records (for each section/entry mentioned in notes)

    if (callback === undefined) {
        callback = notes;
        notes = [];
    }

    _.each(notes, function(note){
        var entry=_.find(master_record[note.section], function(entry){
            return entry._id.toString()===note.entry.toString();
        });

        if (!entry.meta) {
            entry.meta={};
        }
        if(!entry.meta.notes){
            entry.meta.notes=[];
        }
        
        entry.meta.notes.push(note);
    });

    callback(null, master_record);


    /*
    var master_entries = [];
    _.each(master_record, function (entries, type) {
        _.each(entries, function (entry) {
            //gate (ignore) possible sections that are not applicable here
            if (_.contains(['demographics', 'plan_of_care'], type)) {
                //skip to next entry (next iteration)
                return;
            }

            //calculate displayDates for entry based on type
            var dates = extractAndFormat(type, entry);
            if (dates.temp === "") {
                dates.temp = [{
                    "date": "2015-02-11T00:00:00.000Z",
                    "precision": "day",
                    "displayDate": "Feb 12, 2015"
                }];
            }

            //collate all notes into array (with formatting) for current entry
            collateComments(entry, notes, function (err, comments) {
                if (err) {
                    console.log("err: ", err);
                } else {
                    var display_type = displayType(type);

                    var tmpEntry = {
                        'data': entry,
                        'category': display_type,
                        'metadata': {
                            'comments': comments,
                            'displayDate': dates.display,
                            'datetime': dates.temp
                        }
                    };
                    master_entries.push(tmpEntry);
                }
            });
        });
    });
    callback(null, master_entries);
    */
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
            var fileName = "";
            if (patientEntered) {
                fileName = 'ccda_record-with_patient-' + userLastName + '-' + timestamp + '.' + format;
                record.getAllNotes(ptKey, function (err, notes) {
                    if (err) {
                        callback(err);
                    } else {
                        //go through and add in notes
                        parseEntries(result, notes, function (err3, processed_result) {
                            if (err3) {
                                console.log("Err3: ", err3);
                                callback(err3);
                            } else {
                                if (format === "json") {
                                    callback(null, fileName, processed_result);
                                } else {
                                    var response_ccda = generate.generateCCD({data:processed_result}); //note: generate needs to use processed_result
                                    console.log("response ccda is generated");
                                    callback(null, fileName, response_ccda);
                                }
                            }
                        });
                    }
                });
            } else {
                fileName = 'ccda_record-' + userLastName + '-' + timestamp + '.' + format;
                //go through and remove patient entered medications
                var new_result = result;
                if (result.medications !== undefined) {
                    for (var i = result.medications.length - 1; i >= -1; i--) {
                        if (i === -1) {
                            if (format === "json") {
                                callback(null, fileName, result);
                            } else {
                                var response_ccda = generate.generateCCD({data:result});
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
