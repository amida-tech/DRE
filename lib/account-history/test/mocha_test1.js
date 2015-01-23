//Reference: https://github.com/amida-tech/hub-integration/blob/master/test/test-ingest.js
//http://strongloop.com/strongblog/how-to-test-an-api-with-node-js/

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/27017');

var accountEvents = require('../routes/accountEvents');

var assert = require('chai').assert;
var expect = require('chai').expect;
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));

var supertest = require('supertest');
var api = supertest.agent('http://localhost:3005');

var historyModel = accountEvents.EventModel;

describe('Account History', function(){
	before(function(done){
		historyModel.remove({}, function(){
			done();
		});
	});

	var sampleURL1 = '/account_history';

	it('Adds event to empty database', function(done){
		var eventType = 'initAccount'
		api.post(sampleURL1)
		.send({'userID':'1', 'event_type': 'initAccount', 'note':'no-note-here', 'fileRef':'AAA'})
		.end(function(err, res){
			if(err){
				done(err);
			}else{
				expect(res.body).to.have.deep.property('userID','1');
				expect(res.body).to.have.deep.property('event_type','initAccount');
				expect(res.body).to.have.deep.property('note','no-note-here');
				expect(res.body).to.have.deep.property('fileRef','AAA');
				expect(res.body).to.have.property('time');
				done();
			}
		});
	});

	//Prepopulate db for full history
	before(function(done){
		//api.get(sampleURL2, function(done{ ...sampleURL3.})
		api.post(sampleURL1)
		.send({'userID':'2', 'event_type': 'fileUploaded', 'note':'doctor', 'fileRef':'BBB'})
		.end(function(err, res){
			if(err){
				done(err);
			} else{
				done();
			}
		});
	});

	it('Shows Full Event History', function(done){
		var fullEventURL = '/account_history/all';
		var ans1 = {userID: '1', event_type: 'initAccount', note: 'no-note-here', fileRef: 'AAA'},
			ans2 = {userID: '2', event_type: 'fileUploaded', note: 'doctor', fileRef: 'BBB'};
			//ans3 = {userID: 3, event_type: 'passwordChange', note: 'hint', fileRef: 'CCC'};

		var records = [ans1, ans2];
		api.get(fullEventURL)
		.end(function(err, res){
			if(err){
				console.log(err);
				done();
			}else{
				expect(res.body).to.have.length(2);
				for(var i=0; i<res.body.length; i++){
					elt = res.body[i];
					expect(elt).to.have.property('_id');
					delete elt._id;
					delete elt.__v;
					delete elt.time;
					expect(records).to.include.something.that.deep.equals(elt);
				}
				done();
			}
		});
	});
});


