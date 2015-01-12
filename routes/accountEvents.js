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
    fileRef: {type:String}
});

//TODO: define objects/full titles for each event, figure out best display
var fullEventNames = {}
fullEventNames['initAccount']='Account created on ' + Date; //Don't need dates bc its timeline?
fullEventNames['fileUploaded']='File ' + fileName + ' uploaded on ' + Date;
fullEventNames['fileDownloaded'] = 'File ' + fileName + ' downloaded on ' + Date;
fullEventNames['labResults'] = 'Lab results received from ' + source +' on '+ Date;
fullEventNames['passwordChange'] =  'Password changed on '+ Date;
fullEventNames['infoUpdate'] = 'Personal Information ' + type + ' updated on '+Date;
/*figure out how exactly these will be used in UI for where to get object info -- 
maybe make toString() method for Mongoose schema?
*/

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
    ///Same with or without Swagger
    Event.find({}).sort({
            date: -1
        }).exec(function(err, docs) {
            if (err) {
                console.log('Error' + err);
            } else {
                //res.send(200)
                res.send(docs);
            }
        })
};

//For use with swaggerResources.js
exports.addEvent2 = function(user, type, note, file){
    var newEvent = new Event({
        userID: user,
        event_type: type,
        note: note,
        fileRef: file
    });

    newEvent.save(function(err) {
        if (err) return console.log('Error:' + err);
    });
    //res.send(200)
    res.send("event " + newEvent.event_type + " added\n");
}

