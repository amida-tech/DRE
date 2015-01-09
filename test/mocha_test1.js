//Reference: https://github.com/amida-tech/hub-integration/blob/master/test/test-ingest.js
//http://strongloop.com/strongblog/how-to-test-an-api-with-node-js/

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/27017');

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should();

//var bbr = require('../../blue-button-record')

var supertest = require('supertest');
var api = supertest.agent('http://localhost:3005');
//var fs = require('fs');
//var path = require('path');

///=======Drop collection manually in Robomongo before running tests===========///
describe('Init', function(){
	//Clear the existing history
	// before(function(done){
	// 	mongoose.connect('mongodb://localhost/27017', function(){
	// 		mongoose.connection.db.dropCollection('events', function(err){
	// 			if(err){
	// 				console.log(err);
	// 				done();
	// 			}else{
	// 				done();
	// 			}
	// 		});
	// 	});
	// });


	var sampleURL1 = '/accountEvent?userID=1&event_type=initAccount&note=no-note-here&fileRef=AAA',
		sampleURL2 = '/accountEvent?userID=1&event_type=fileUploaded&note=doctor&fileRef=BBB',
		sampleURL3 = '/accountEvent?userID=1&event_type=passwordChange&note=hint&fileRef=CCC';
	
	//TODO: add coverage 
	describe('Account History', function(){
		it('adds event to empty database', function(done){
			var eventType = 'initAccount'
			api.get(sampleURL1)
			.expect('event initAccount added\n')
			.end(function(err, res){
				if(err){
					return done(err);
				}else{
					done();
				}
			});
		});
		//Prepopulate db for full history
		before(function(){
			api.get(sampleURL2, function(callback){
				api.get(sampleURL3, function(callback){
					done();
				});
			});
		});

		it('Shows Full Event History - desc', function(done){
			var fullEventURL = '/accountEvents';
			var ans1 = {userID: 1, event_type: 'initAccount', note: 'no-note-here', fileRef: 'AAA'},
				ans2 = {userID: 2, event_type: 'fileUploaded', note: 'doctor', fileRef: 'BBB'},
				ans3 = {userID: 3, event_type: 'passwordChange', note: 'hint', fileRef: 'CCC'};
				
			console.log('printing expected' + JSON.stringify(ans1));

			var records=[JSON.stringify(ans1), JSON.stringify(ans2), JSON.stringify(ans3)];

			console.log('expected:\n'+records);
			//TODO: prepopulate in before
			api.get(fullEventURL)
			//.expect('Content-Type', Array)
			.end(function(err, res){
				console.log(JSON.stringify(res, null, 4));
				if(err){
					console.log(err);
					done();
				}else{
					console.log('>>>>', res.body);
					expect(res.body).to.have.length(3);
					res.body.map(function(elt){
						expect(elt).to.have.property(_id)
						.and.to.have.property(__v);
						expect(elt).to.deep.include.members(fullAns[indexOf(elt)]);
					});
				done();
				}
			});
		});
	});
});

