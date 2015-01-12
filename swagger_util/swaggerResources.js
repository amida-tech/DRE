//https://github.com/swagger-api/swagger-node-express/blob/master/sample-application/resources.js

/*
*	Each resource contains a swagger spec as well as the action to execute when called
*/

var swnx = require('swagger-node-express'); //require swagger?
var paramTypes = swnx.paramTypes;
var swe = swnx.errors;
var history = require('./routes/accountEvents');

exports.addEvent = {
	'spec': {
		description: 'Add an event to user history',
		path: '/accountEvent?userID={:id}&event_type={enum}&note={note}&fileRef={fileRef}', //without query syntax?
		method: 'GET',
		summary: '',
		notes: ,
		type: , //from models.js
		nickname: , //other equiv calls
		produces: String, //['application/json']
		parameters: [paramTypes.path( , , )],
		responseMessages: [ errors ]
	},
	'action': function(req, res){
		if(/*invalid query*/){
			throw swe.invalid('event');
		}
		//response = history.addEvent(req, res); //need to modularize?
		//use require('url') parsing?
		var userID =req.query.userID,
        	type = req.query.event_type,
       		note = req.query.note,
        	file= req.query.fileRef;

		if (!userID||!type){
			throw swe.invalid('event');
		} else{
			ans = history.addEvent2(userID, type, note, file);
			res.send(ans);
		}
	}
}

exports.fullHistory = {
	'spec':{
		description: 'Return all events in descending order',
		path: '/accountEvents', 
		method: 'GET',
		summary: '',
		notes: ,
		type: , //from models.js
		nickname: , //other equiv calls
		produces: String, //['application/json']
		parameters: [paramTypes.path( , , )],
		responseMessages: [ errors ]
	}
	'action': function(req, res){
		if(/*invalid query*/){
			throw swe.invalid(param);
		}
		response = history.allInOrder(req, res); //need to modularize?
		if (response){
			res.send(response);
		} else {
			throw swe.invalid('event'); 
		}
	}
}