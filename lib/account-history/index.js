var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var login = require('../login');
var utils = require('./utils.js');
var record = require('../../../blue-button-record/index.js');

var Event = utils.Event;

function addEvent(req, res) {
    record.saveEvent(req.body.event_type, req.user.username, req.body.note, req.body.fileRef, function(err, newEvent){
        console.log('got into callback 1');
        if(err){
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(201).send(newEvent);
        }
    });
};

function allEventsInOrder(req, res) {
    record.getAllEvents(function(err, eventsList){
        console.log('got into callback 2');
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(docs); //Talk to Jamie, see what's needed
        }
    });
};


function mostRecent(req, res) {
    record.getRecentLogin(function(err, recentLogin) {
        console.log('got into callback 3');
        record.getRecentUpdate(function(err, recentUpdate) {
            console.log('got into callback 4');
            if (!recentLogin && !recentUpdate) {
                res.status(400).end();
            } else {
                var recent = {
                    login: recentLogin,
                    update: recentUpdate
                };
                res.set('Content-Type', 'application/json');
                res.status(200).send(recent);
            }

        });
    });

};

app.post('/account_history', addEvent);
app.get('/account_history/all', allEventsInOrder);
app.get('/account_history/mostRecent', mostRecent);

//callback error w/login.checkAuth
// app.post('/account_history', login.checkAuth, addEvent);
// app.get('/account_history/all', login.checkAuth, allEventsInOrder);
// app.get('/account_history/mostRecent', login.checkAuth, mostRecent);

// app.get('/account_history/lastLogin', login.checkAuth, lastLogin);
// app.get('/account_history/lastUpdate', login.checkAuth, lastUpdate);
