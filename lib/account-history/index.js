var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var login = require('../login');
var utils = require('./utils.js');

var Event = utils.Event;

// var Event = mongoose.model('Event', EventSchema);

var fullEventNames = {
    initAccount: 'Account created',
    loggedIn: 'Logged in',
    loggedOut: 'Logged out',
    fileUploaded: 'File uploaded',
    fileDownloaded: 'File downloaded', //could add filename or MHR
    labResults: 'Lab results received', //same as fileUploaded in API
    passwordChange: 'Password changed', //not in API yet
    infoUpdate: 'Personal Information updated' //not in API yet
};

exports.getFullEventName = function(typestring) {
    return fullEventNames[typestring];
}

//Used in login, storage, record
exports.saveEvent = function(eventType, username, note, file) {
    var newEvent = new Event({
        userID: username, //not necessary w/authentication?
        event_type: eventType,
        note: note, //file descriptor, IP address
        fileRef: file //MongoDB _id
    });
    newEvent.save(function(err) {
        if (err) {
            return err
        }
    });
};

//app.post('/account-history', login.checkAuth, function(req, res){
//exports.addEvent = function(req, res) {
function addEvent(req, res) {
    //console.log("addEvent started");

    var newEvent = new Event({
        userID: req.user.username,
        //userID: req.body.userID,
        event_type: req.body.event_type,
        note: req.body.note,
        fileRef: req.body.fileRef
    });
    console.log('new Event made: \n', newEvent);
    //saveEvent(req.body.event_type, req.body.userID, req.body.note, req.body.fileRef)

    newEvent.save(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(201).send(newEvent);
        }
    });
};

//app.get('/account-history/all', login.checkAuth, function(req, res){
//exports.allEventsInOrder = function(req, res){
function allEventsInOrder(req, res) {
    Event.find({}).sort({
        date: -1
    }).exec(function(err, docs) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(docs); //Talk to Jamie, see what's needed
        }
    });
};

//Last login before this one (2nd to last)
exports.lastLogin = function(req, res) {
    Event.find({
            event_type: 'loggedIn'
        }).sort({
            date: -1
        })
        .exec(function(err, logins) {
            if (err) {
                res.status(400).send(err);
            } else {
                lastLogin = logins[1];
                res.set('Content-Type', 'application/json');
                res.status(200).send(lastLogin);
            }
        });
};

exports.lastUpdate = function(req, res) {
    //Don't need to find all?
    Event.find({
            event_type: 'fileUploaded'
        }).sort({
            date: -1
        })
        .exec(function(err, updates) {
            if (err) {
                res.status(400).send(err);
            } else {
                var lastUpdate;
                if (updates.length >= 1) {
                    lastUpdate = updates[1];
                } else {
                    lastUpdate = Event.findOne({
                        event_type: 'initAccount'
                    }, function(err, update) {
                        if (err) {
                            return err;
                        } else {
                            return update;
                        }
                    });
                }
                res.set('Content-Type', 'application/json');
                res.status(200).send(lastUpdate);
            }
        });
};

function lastLogin2(callback) {
    var loginQuery = Event.find({
        'event_type': 'loggedIn'
    }).sort({
        date: -1
    });
    loginQuery.exec(function(err, logins) {
        if (err) {
            console.log(err);
            console.log('failing here');
            callback(err);
        } else {
            if (logins.length === 1) {
                console.log('there is a login');
                console.log(typeof(logins));
                console.log('LOGINS\n', logins);
                console.log(logins[0]);
                callback(null, logins[0]);
            } else if (logins.length === 0) {
                console.log('no logins');
                callback(null, null);
            } else {
                console.log('more than one login');
                callback(null, logins[1]);
            }
        }
    });
};

function lastUpdate2(callback) {
    var updateQuery = Event.find({
        'event_type': 'fileUploaded'
    }).sort({
        date: -1
    });
    updateQuery.exec(function(err, updates) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            if (updates) {
                console.log('UPDATES\n', updates);
                callback(null, updates[0]);
            } else {
                //no files uploaded, so return account initialized
                var lastUpdate = Event.findOne({
                    event_type: 'initAccount'
                }, function(err, update) {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else {
                        callback(null, update);
                    }
                });
            }
        }
    });
};

//app.get('/account_history/mostRecent', login.checkAuth, function(req, res){
//exports.mostRecent = function(req, res){
function mostRecent(req, res) {
    console.log("mostRecent>>>");
    lastLogin2(function(err, recentLogin) {

        console.log('recent login ', recentLogin);
        lastUpdate2(function(err, recentUpdate) {

            console.log('recentUpdate ', recentUpdate);


            if (!recentLogin && !recentUpdate) {
                res.status(400).end();
            } else {
                var recent = {
                    login: recentLogin,
                    update: recentUpdate
                };
                res.set('Content-Type', 'application/json');
                console.log("recent>>>",recent);
                res.status(200).send(recent);
            }

        });
    });



};


//callback error w/login.checkAuth
app.post('/account_history', addEvent);
app.get('/account_history/all', allEventsInOrder);
app.get('/account_history/mostRecent', mostRecent);

//Async split call
// app.get('/account_history/mostRecent', function(req, res){
// 	responseObj = {};
// 	lastLogin2(function(err, logins){
// 		if(err){
// 			res.status(400).send('no login found');
// 		}
// 		responseObj.login = logins[0]
// 		lastUpdate2(function(err, updates){
// 			if(err){
// 				res.status(400).send('no update found');
// 			} else {
// 				responseObj.update = updatess[0];
// 				res.status(200).send(responseObj);
// 			}
// 		})
// 	})
// });

// app.get('/account_history/lastLogin', login.checkAuth, lastLogin);
// app.get('/account_history/lastUpdate', login.checkAuth, lastUpdate);
