//Reference: https://github.com/amida-tech/hub-integration/blob/master/test/test-ingest.js
//http://strongloop.com/strongblog/how-to-test-an-api-with-node-js/

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/27017');

var assert = require('chai').assert;
var expect = require('chai').expect;
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));


var supertest = require('supertest');
var api = supertest.agent('http://localhost:3005');

///=======Drop collection manually in Robomongo before running tests===========///
describe('Init', function(){
	//TODO: Clear the existing history automatically
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
		sampleURL2 = '/accountEvent?userID=2&event_type=fileUploaded&note=doctor&fileRef=BBB',
		sampleURL3 = '/accountEvent?userID=3&event_type=passwordChange&note=hint&fileRef=CCC';
	
	//TODO: add coverage for other cases?
	describe('Account History', function(){
		it('adds event to empty database', function(done){
			var eventType = 'initAccount'
			api.get(sampleURL1)
			.expect('event initAccount added\n')
			.end(function(err, res){
				if(err){
					done(err);
				}else{
					done();
				}
			});
		});

		//Prepopulate db for full history
		before(function(done){
			//api.get(sampleURL2, function(done{ ...sampleURL3.})
			api.get(sampleURL2)
			.end(function(err, res){
				if(err){
					done(err);
				} else{
					done();
				}
			});
		});

		it('Shows Full Event History - desc', function(done){
			var fullEventURL = '/accountEvents';
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
});

