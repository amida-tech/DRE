var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
    userID: String,
    event_type: {
        type: String,
        enum: ['initAccount', 'fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate'],
        required: true
    },
    note: String, 
    time: {
        type: Date,
        default: Date.now
    }, 
    fileRef: {
        //type: ObjectID (of file)
        ref: {
            type: String
        }
    }
});

var Event = mongoose.model('Event', EventSchema)

exports.addEvent = function(req, res) {
    //console.log("addEvent started");

    var newEvent = new Event({
        userID: req.query.userID,
        event_type: req.query.event_type,
        note: req.query.note,
        fileRef: req.query.fileRef
    });

    //console.log("newEvent obj created", newEvent);
    newEvent.save(function(err) {
        if (err) return console.log('Error:' + err);
    });
    //res.send(200)
    res.send("event " + newEvent.event_type + " added\n");
};

exports.allInOrder = function(req, res) {
    //sort collection and respond with sorted list of Events
    ///ask about caching previous account history and just pushing new event (performance?)
    
    Event.find({}).sort({
            date: -1
        }).exec(function(err, docs) {
            if (err) {
                console.log('Error' + err);
            } else {
                //res.send(200)
                console.log(docs);
                res.send(docs);
            }
        })
};