var mongo = require('mongodb');
var mongoose = require('mongoose');
var login = require('./login');
var storage = require('./storage');

mongoose.connect('mongodb://localhost:27017');

db = mongoose.connection;

// var Server = mongo.Server,
// 	db = mongo -------------------------FROM blue-button-record

db.open(function(error, db) {
	if(!err){
		//connected to database
		//TODO: make MongoDB collection -- ask if this is correct
		db.createCollection('accountHistory')
		//db.collection('')
	}
})

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
	id: {type: String, required: true},	//ObjectId? TODO - Ask Dmitry
	event_type:{
		type: String, 
		enum: ['initAccount', 'fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate'],
		required: true
	},
	note: String, //include?
	time: {type: Date, default: Date.now}, //always Date.now?
	record: {
		type: ObjectID,
		ref: 'storage.files'
	} 

});

var Event = mongoose.model('Event', EventSchema)

exports.addEvent = function(req, res) {
	var newEvent = new Event({
		//TODO: figure out where to pull all of these from
 		id: req.params.id, 
 		event_type: req.params.event_type,
 		note: req.params.note,
 		record: req.params.fileRef //TODO: how to represent this? access pt_key somehow?
 	});
 	//Do we need both save and insert? save vs create?
	newEvent.save(function (err){
		if(err) return handleError(err);
	});
	//Event.create({... req.params ...}), function(err, newEvent){if(err) return handleError(err)}
 	db.accountHistory.insert(newEvent, {safe:true}, function(err, result){
 		if (err) {
 			console.log('Error:'+ err)
 		} else {
 			res.send(result[0]);
 		}
 	}); 
};

exports.allInOrder = function(req, res){
	//sort collection and respond with sorted list of Events
	///ask about caching previous account history and just pushing new event (performance?)
	db.accountHistory.find({}).sort({date: -1}).exec(function(err, docs){
		if(err){
			console.log('Error'+err)
		} else {
			//TODO: format docs then send?
			res.send(docs)
		}
	})
};