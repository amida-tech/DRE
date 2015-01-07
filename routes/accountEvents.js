var mongo = require('mongodb');
var mongoose = require('mongoose');
var login = require('./login'),

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
	id: {type: String, required: true},	//ObjectId?
	event_type:{
		type: String, 
		enum: {initAccount, fileUploaded, fileDownloaded, labResults, passwordChange, infoUpdate},
		required: true
	},
	note: String,
	updated_at: {type: Date, default: Date.now}, //always Date.now?
	record: {
		type: ObjectID,
		ref: 'storage.files'
	} 

});

EventSchema.methods.addEvent(callback){
	return this.model()
};

var EventModel = mongoose.model('Event', EventSchema);



//================================================
 var saveEvent = function(req, res) {
 	var newEvent = new EventSchema({
 		req.params.id, 
 		req.params.event_type,
 		req.params.
 	});
 	db.accountHistory.insert(newEvent)
 	res.
};

exports.addEvent = function(req, res) {
	db.accountHistory.insert()
	})
};




var getMostRecent = function(req, res){

};

exports.allInOrder = function(req, res){

};