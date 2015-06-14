var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var login = require('../login');
var _ = require('lodash');

var record = require('blue-button-record');

var fullEventNames = {
    initAccount: 'Account created',
    loggedIn: 'Logged in',
    loggedOut: 'Logged out',
    fileUploaded: 'File uploaded',
    fileDownloaded: 'File downloaded', //could add filename or MHR
    labResults: 'Lab results received', //same as fileUploaded in API
    passwordChange: 'Password changed', //not in API yet
    infoUpdate: 'Profile updated', //not in API yet
    medUpdate: 'Patient-entered medications changed'
};

exports.getFullEventName = function (typestring) {
    return fullEventNames[typestring];
};

function allEventsInOrder(ptKey, callback) {
    record.getAllEvents(ptKey, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function getLastLogin(ptKey, callback) {
    record.getRecentLogin(ptKey, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function getLastUpdate(ptKey, callback) {
    record.getRecentUpdate(ptKey, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function mostRecent(ptKey, callback) {
    var responseObj = {};

    getLastLogin(ptKey, function (err, result) {
        if (err) {
            callback('no login found');
        } else {
            responseObj.login = result;
            console.log("last login ", result);
            getLastUpdate(ptKey, function (err, result) {
                if (err) {
                    callback('no update found');
                } else {
                    console.log("last update ", result);
                    responseObj.update = result;
                    callback(null, responseObj);
                }
            });
        }
    });
}

function getMasterHistory(ptKey, callback) {
    var master_history = {};

    function getFullEventName(typestring) {
        var fullEventNames = {
            initAccount: 'Account created',
            loggedIn: 'Logged in',
            loggedOut: 'Logged out',
            fileUploaded: 'File uploaded',
            fileDownloaded: 'File downloaded', //could add filename or MHR
            labResults: 'Lab results received', //same as fileUploaded in API
            passwordChange: 'Password changed', //not in API yet
            infoUpdate: 'Profile updated', //not in API yet
            medUpdate: 'Patient-entered medications changed'
        };
        return fullEventNames[typestring];
    }

    mostRecent(ptKey, function (err, recent) {
        if (err) {
            console.log("err: ", err);
            callback(err);
        } else {
            allEventsInOrder(ptKey, function (err2, full) {
                if (err) {
                    console.log("err2: ", err2);
                    callback(err2);
                } else {
                    var fullHistoryProcessed = [];

                    _.each(full, function (historyEvent) {
                        var newHistEvent = {
                            type: getFullEventName(historyEvent.event_type),
                            date: historyEvent.time,
                            event_type: historyEvent.event_type,
                            note: historyEvent.note
                        };
                        fullHistoryProcessed.push(newHistEvent);
                    });

                    master_history = {
                        recordHistory: fullHistoryProcessed.reverse()
                    };

                    if (recent.login) {
                        master_history.lastLogin = recent.login.time;
                    }

                    if (recent.update) {
                        master_history.lastUpdate = recent.update.time;
                    }

                    callback(null, master_history);
                }
            });
        }
    });
}

app.get('/api/v1/account_history/all', login.checkAuth, function (req, res) {
    allEventsInOrder(req.user.username, function (err, result) {
        if (err) {
            res.status(400).send('no update found');
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});
app.get('/api/v1/account_history/mostRecent', login.checkAuth, function (req, res) {
    mostRecent(req.user.username, function (err, responseObj) {
        if (err) {
            res.status(400).send('no update found');
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(responseObj);
        }
    });
});

app.get('/api/v1/account_history/master', login.checkAuth, function (req, res) {
    getMasterHistory(req.user.username, function (err, master_history) {
        if (err) {
            res.status(400).send('no update found');
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(master_history);
        }
    });
});
