//Reference: https://github.com/amida-tech/hub-integration/blob/master/test/test-ingest.js
//http://strongloop.com/strongblog/how-to-test-an-api-with-node-js/

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = chai.should();

var supertest = require('supertest');
var api = supertest.agent('http://localhost:3005');
//var fs = require('fs');
//var path = require('path');

describe('Account History', function(){
	var sampleURL1 = 'accountEvent?userID=1&event_type=initAccount&note=no-note-here&fileRef=AAA';
	var sampleURL2 = 'accountEvent?userID=1&event_type=fileUploaded&note=doctor&fileRef=BBB';
	var sampleURL3 = 'accountEvent?userID=1&event_type=passwordChange&note=hint&fileRef=CCC';
	
	//TODO: add coverage for each function: describe('Add event', function(){ it(...); it(...);});
	it('Adds Event', function(done){
		var eventType = 'initAccount'
		api.get(sampleURL1)
		.expect('eventType initAccount added\n')
		.end(function(err, res){
			if(err){
				return done(err);
			}else{
				done();
			}
		});
	});

	it('Shows Full Event History - desc', function(done){
		var fullEventURL = '/accountEvents';
		var ans1 = {userID: 1, event_type: 'initAccount', note: 'no-note-here', fileRef: 'AAA'},
			ans2 = {userID: 2, event_type: 'fileUploaded', note: 'doctor', fileRef: 'BBB'},
			ans3 = {userID: 3, event_type: 'passwordChange', note: 'hint', fileRef: 'CCC'};
		var fullAns = [ans1, ans2, ans3].map(function(elt){return JSON.stringify(elt)});
		api.get(sampleURL2).get(sampleURL3)
		.get(fulleventURL)
		.expect('Content-Type', Array)
		//.expect(JSON.stringify({
			//TODO: figure out how to test date --> show that time _id, field exists
		//	{_id: '[\W]+', userID:1, event_type:'initAccount', time:'[\W\w]+', }
		//}))
		.end(function(err, result){
			if(err){
				return done(err);
			}else{
				expect(res).to.have.length(3);
				res.map(function(elt){
					expect(elt).to.have.property(_id)
					.and.to.have.property(__v);
					expect(elt).to.deep.include.members(fullAns[indexOf(elt)]);
				});

			}
		});
	});
});

