var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var login = require('../login');
var utils = require('./utils.js');

var record = require('blue-button-record');

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
    infoUpdate: 'Profile updated' //not in API yet
};

exports.getFullEventName = function(typestring) {
        return fullEventNames[typestring];
    }
    /*
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

    */

//app.get('/account-history/all', login.checkAuth, function(req, res){
//exports.allEventsInOrder = function(req, res){


function allEventsInOrder(req, res) {
    var ptKey=req.user.username;

    record.getAllEvents(ptKey, function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result); //Talk to Jamie, see what's needed
        }
    });
};

function getLastLogin(ptKey, callback) {
    record.getRecentLogin(ptKey, function(err, result) {
        if (err) {
            callback(err)
        } else {
            callback(null, result);
        }
    })


};

function getLastUpdate(ptKey, callback) {
    record.getRecentUpdate(ptKey, function(err, result) {
        if (err) {
            callback(err)
        } else {
            callback(null, result);
        }
    })

};

//app.get('/account_history/mostRecent', login.checkAuth, function(req, res){
//exports.mostRecent = function(req, res){
function mostRecent(req, res) {
    var ptKey=req.user.username;

    responseObj = {};

    getLastLogin(ptKey, function(err, result) {
        if (err) {
            res.status(400).send('no login found');
        } else {
            responseObj.login = result
            console.log("last login ", result);
            getLastUpdate(ptKey, function(err, result) {
                if (err) {
                    res.status(400).send('no update found');
                } else {
                    console.log("last update ",result);
                    responseObj.update = result;
                    res.status(200).send(responseObj);
                }
            });

        };

    });

};


//callback error w/login.checkAuth
//app.post('/api/v1/account_history', addEvent);
app.get('/api/v1/account_history/all', login.checkAuth, function(req, res) {
    allEventsInOrder(req, res);
});
app.get('/api/v1/account_history/mostRecent', login.checkAuth, function(req, res) {
    mostRecent(req, res);
});
