
var supertest = require('supertest');
//var api = supertest.agent('http://localhost:3000');
//Local db used for testing
var api = supertest.agent('http://localhost:3000');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));
var database = require('mongodb').Db;

var path = require('path');
var common2 = require('./common.js');
var common = require(path.join(__dirname, '../common/common.js'));

describe('Pre Test Cleanup', function() {

    it('Clean Database', function(done) {
        common.removeAll(function(err, results) {
            if (err) {
            	console.log('Error in remove all');
                done(err);
            } else {
                done();
            }
        });
    });

    it('Login', function(done) {
        common2.register(api, 'test', 'test', function() {
            common2.login(api, 'test', 'test', function() {
                done();
            });
        });
    });
});

describe('Account History - basic', function(){

	it('Adds event to empty database', function(done){
		var eventType = 'initAccount';
		api.post('/account_history')
		.send({'event_type': 'initAccount', 'note':'no-note-here', 'fileRef':'AAA'})
		.end(function(err, res){
			if(err){
				done(err);
			}else{
				expect(res.body).to.have.deep.property('userID','test');
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
		api.post('/account_history')
		.send({'event_type': 'fileUploaded', 'note':'doctor', 'fileRef':'BBB'})
		.end(function(err, res){
			if(err){
				done(err);
			} else{
				done();
			}
		});
	});

	it('Shows Full Event History', function(done){
		var ans1 = {userID: 'test', event_type: 'initAccount', note: 'no-note-here', fileRef: 'AAA'},
			ans2 = {userID: 'test', event_type: 'fileUploaded', note: 'doctor', fileRef: 'BBB'};
			//ans3 = {userID: 3, event_type: 'passwordChange', note: 'hint', fileRef: 'CCC'};

		var records = [ans1, ans2];
		api.get('/account_history/all')
		.end(function(err, res){
			if(err){
				console.log(err);
				done();
			}else{
				expect(res.body).to.have.length(4);
				// for(var i=0; i<res.body.length; i++){
				// 	elt = res.body[i];
				// 	expect(elt).to.have.property('_id');
				// 	delete elt._id;
				// 	delete elt.__v;
				// 	delete elt.time;
				// 	expect(records).to.include.something.that.deep.equals(elt);
				// }
				(res.body).should.all.have.property('userID','test');
				(res.body).should.include.something.with.property('event_type', 'initAccount');
				(res.body).should.include.something.with.property('event_type', 'loggedIn');
				(res.body).should.include.something.with.property('event_type', 'fileUploaded');
				done();
			}
		});
	});
});

describe('Account History - recent for UI', function(){

	it('Returns last login', function(done){
		api.get('/account_history/mostRecent')
		.end(function(err, res){
			if(err){
				console.log(err);
				done();
			} else {
				console.log(res.body);
				expect(res.body).to.have.property('login');
				expect(res.body.update).to.have.deep.property('userID','test');
				expect(res.body.login).to.have.deep.property('event_type', 'loggedIn');
			}
		});
	});

	it('Returns last MHR update via file upload', function(done){
		api.get('/account_history/mostRecent')
		.end(function(err, res){
			if(err){
				console.log(err);
				done();
			} else {
				console.log(res.body);
				expect(res.body).to.have.property('update');
				expect(res.body.update).to.have.deep.property('userID','test');
				expect(res.body.update).to.have.deep.property('event_type','fileUploaded');
				expect(res.body.update).to.have.deep.property('note','doctor');
				expect(res.body.update).to.have.deep.property('fileRef','BBB');
				expect(res.body.update).to.have.property('time');
				done();
			}
		});
	});
});


