var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var login = require('../login');

var EventSchema = new Schema({
    event_type: {
        type: String,
        enum: ['initAccount', 'loggedIn', 'loggedOut','fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate'],
        required: true
    },
    userID: String,
    note: String, 
    time: {
        type: Date,
        default: Date.now
    }, 
    fileRef: {type:String}
});
var Event = mongoose.model('Event', EventSchema)

var fullEventNames = {
initAccount:'Account created', 
loggedIn:'Logged in',
loggedOut:'Logged out',
fileUploaded:'File uploaded',
fileDownloaded:'File downloaded',
labResults:'Lab results received', //same as fileUploaded in API
passwordChange:'Password changed', //not in API yet
infoUpdate:'Personal Information updated' //not in API yet
}

function getFullEventName(typestring){
	return fullEventNames[typestring];
}

//Used in login, storage, record
exports.saveEvent = function(eventType, username, note, file){
	var newEvent = new Event({
        userID: username, //not necessary w/authentication?
        event_type: eventType,
        note: note, //file descriptor, IP address
        fileRef: file //MongoDB _id
    });
    newEvent.save(function(err){
    	if (err){
    		return err
    	}
    });
};

//app.post('/account-history', login.checkAuth, function(req, res){
//exports.addEvent = function(req, res) {
function addEvent(req, res){
    //console.log("addEvent started");

    var newEvent = new Event({
        userID: req.user.username,
        event_type: req.body.event_type,
        note: req.body.note,
        fileRef: req.body.fileRef
    });
    //saveEvent(req.body.event_type, req.body.userID, req.body.note, req.body.fileRef)
    
    newEvent.save(function(err) {
        if (err) return console.log('Error:' + err);
    });
    res.set('Content-Type', 'application/json');
    res.status(201).send(newEvent);
};

//app.get('/account-history/all', login.checkAuth, function(req, res){
//exports.allEventsInOrder = function(req, res){
function allEventsInOrder(req, res){
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
exports.lastLogin = function(req, res){
	Event.find({event_type: 'loggedIn'}).sort({date: -1})
	.exec(function(err,logins){
		if(err){
			res.status(400).send(err);
		} else {
			lastLogin = logins[1];
			res.set('Content-Type', 'application/json');
			res.status(200).send(lastLogin);
		}
	});
};

exports.lastUpdate = function(req, res){
	//Don't need to find all?
	Event.find({event_type: 'fileUploaded'}).sort({date: -1})
	.exec(function(err,updates){
		if(err){
			res.status(400).send(err);
		} else {
			var lastUpdate;
			if(updates.length>=1){
				lastUpdate = updates[1];
			} else {
				lastUpdate = Event.findOne({event_type: 'initAccount'}, function(err, update){
					if (err) { return err;}
					else {return update;}
				});
			}
			res.set('Content-Type', 'application/json');
			res.status(200).send(lastUpdate);
		}
	});
};

function lastLogin2(){
	Event.find({event_type: 'loggedIn'}).sort({date: -1})
	.exec(function(err,logins){
		if(err){
			console.log(err);
			return
		} else {
			return logins[1]
		}
	});	
};

function lastUpdate2(){
	Event.find({event_type: 'fileUploaded'}).sort({date: -1})
	.exec(function(err,updates){
		if(err){
			console.log(err);
			return
		} else {
			if (updates){
				return updates[0];
			} else {
				//no files uploaded, so return account initialized
				lastUpdate = Event.findOne({event_type: 'initAccount'}, function(err, update){
					if (err) { 
						console.log(err);
						return
					}
					else {
						return update;
					}
				});
			}
		}
	});
};

//app.get('/account_history/mostRecent', login.checkAuth, function(req, res){
//exports.mostRecent = function(req, res){
function mostRecent(req, res){
	var recentLogin = lastLogin2();
	var recentUpdate = lastUpdate2();
	if (!recentLogin && !recentUpdate){
		res.send(400);
	} else {
		var recent = {
			login: recentLogin,
			update: recentUpdate
		};
		res.set('Content-Type', 'application/json');
		res.status(200).send(recent);
	}	
};

app.post('/account_history', login.checkAuth, addEvent(function(err){
	if(err){ 
		res.status(400).send(err);
	}
}));
app.get('/account_history/all', login.checkAuth, allEventsInOrder);
app.get('/account_history/mostRecent', login.checkAuth, mostRecent);

// app.get('/account_history/lastLogin', login.checkAuth, lastLogin);
// app.get('/account_history/lastUpdate', login.checkAuth, lastUpdate);
