var mongo = require('mongodb');
var mongoose = require('mongoose');
//var login = require('./login');
//var storage = require('./storage');

mongoose.connect('mongodb://localhost:27017');

db = mongoose.connection;

var conn = mongoose.connection;

var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
    id: {
        type: String,
        required: true
    }, //ObjectId? TODO - Ask Dmitry
    event_type: {
        type: String,
        enum: ['initAccount', 'fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate'],
        required: true
    },
    note: String, //include?
    time: {
        type: Date,
        default: Date.now
    }, //always Date.now?
    record: {
        //type: ObjectID,
        ref: {
            type: String
        }
    }

});

var Event = mongoose.model('Event', EventSchema)

exports.addEvent = function(req, res) {
	console.log("addEvent started");

    var newEvent = new Event({
        //TODO: figure out where to pull all of these from >> pass in as arguments?
        id: req.query.id,
        event_type: req.query.event_type,
        note: req.query.note,
        record: req.query.fileRef //TODO: how to represent this? access pt_key somehow?
    });

    console.log("newEvent obj created", newEvent);

    //Do we need both save and insert? save vs create?
    newEvent.save(function(err) {
        if (err) return console.log('Error:' + err);
    });

    res.send("event added");

    /*
    //Event.create({... req.params ...}), function(err, newEvent){if(err) return handleError(err)}
    conn.collection("accountHistory").insert(newEvent, {
        safe: true
    }, function(err, result) {
        if (err) {
            console.log('Error:' + err)
        } else {
            res.send(result[0]);
        }
    });
*/
};

exports.allInOrder = function(req, res) {
    //sort collection and respond with sorted list of Events
    ///ask about caching previous account history and just pushing new event (performance?)
    
    Event.find({}).sort({
            date: -1
        }).exec(function(err, docs) {
            if (err) {
                console.log('Error' + err)
            } else {
                //TODO: format docs then send?
                res.send(docs)
            }
        })
    /*    
    if (db.Events) {
        db.Events.find({}).sort({
            date: -1
        }).exec(function(err, docs) {
            if (err) {
                console.log('Error' + err)
            } else {
                //TODO: format docs then send?
                res.send(docs)
            }
        })
    }
    else {
    	res.send("no history available");
    }
    */
};