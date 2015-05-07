var chai = require('chai');
var expect = chai.expect;
chai.config.includeStack = true;

var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + process.env.DBname || 'tests';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;
var common = require(path.join(__dirname, '../common/common.js'));
var common2 = require('./common.js');

describe('Pre Test Cleanup', function () {

    it('Clean Database', function (done) {
        common.removeAll(function (err, results) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Login', function (done) {
        common2.register(api, 'test', 'test', function () {
            common2.login(api, 'test', 'test', function () {
                done();
            });
        });
    });
});

describe('Medications web services', function() {
	
	describe("RxNorm", function () {
		
		it("group, post", function(done) {
			api.post('/api/v1/rxnorm/group')
				.send({medname: 'Xanax'})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					} else {
						done();
					}
				});
		});
		
		it("name, post", function(done) {
			api.post('/api/v1/rxnorm/name')
				.send({medname: 'Xanax'})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					} else {
						done();
					}
				});
		});
	});
	
	describe("RxImage", function() {
		
		it("post", function(done) {
			api.post('/api/v1/rximage')
				.send({rxcui: 'C0699034'})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					} else {
						done();
					}
				});
		});
	});
	
	describe("Open FDA", function() {
		
		it("name, post", function(done) {
			api.post('/api/v1/openfda/name')
				.send({medname: 'Xanax'})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					} else {
						done();
					}
				});	
		});
		
		it("code, post", function(done) {
			api.post('/api/v1/openfda/code')
				.send({rxcui: 'C0699034'})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					} else {
						done();
					}
				});
		});
	});
	
	describe("Medline Plus", function() {
		
		it("post", function(done) {
			api.post('/api/v1/medlineplus')
				.send({rxcui: 'C0699034'})
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					} else {
						done();
					}
				});
		});
	});
});