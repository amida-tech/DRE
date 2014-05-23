/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;

function removeCollection(inputCollection, callback) {
	var db;
	database.connect(databaseLocation, function(err, dbase) {
		if (err) {
			throw err;
		}
		db = dbase;
		db.collection(inputCollection, function(err, coll) {
			if (err) {
				throw err;
			}
			coll.remove({}, function(err, results) {
				if (err) {
					throw err;
				}
				db.close();
				callback();
			});
		});
	});
}

function loadTestRecord(fileName, callback) {
	var filepath = path.join(__dirname, '../../../artifacts/test-r1.0/' + fileName);
	api.put('/api/v1/storage')
		.attach('file', filepath)
		.expect(200)
		.end(function(err, res) {
			if (err) {
				callback(err);
			}
			callback(null);
		});
}


describe('Pre Test Cleanup', function() {

	it('Remove Immunization Collections', function(done) {
		removeCollection('immunizations', function(err) {
			if (err) {
				done(err);
			}
			removeCollection('immunizationmerges', function(err) {
				if (err) {
					done(err);
				}
				done();
			});
		});
	});

});


describe('Immunizations API - Test New:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-01-original.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Immunization Records', function(done) {
		api.get('/api/v1/record/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.immunizations.length).to.equal(4);
				//console.log(res.body.immunizations);
				done();
			});
	});

	it('Get Immunization Merge Records', function(done) {
		api.get('/api/v1/merges/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(4);
				for (var i in res.body.merges) {
					expect(res.body.merges[i].merge_reason).to.equal('new');
				}
				//console.log(res.body);
				done();
			});
	});

});

describe('Immunizations API - Test Duplicate:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Immunization Records', function(done) {
		api.get('/api/v1/record/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.immunizations.length).to.equal(4);
				done();
			});
	});

	it('Get Immunization Merge Records', function(done) {
		api.get('/api/v1/merges/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(8);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
				}
				expect(newCnt).to.equal(4);
				expect(dupCnt).to.equal(4);
				done();
			});
	});


});

describe('Immunizations API - Test New/Dupe Mix:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-03-updated.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Immunization Records', function(done) {
		api.get('/api/v1/record/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.immunizations.length).to.equal(5);
				done();
			});
	});

	it('Get Immunization Merge Records', function(done) {
		api.get('/api/v1/merges/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(13);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(8);
				done();
			});
	});
});



//This is a known issue, can uncomment/test once immunizations match functional.
xdescribe('Immunizations API - Test Partial Matches:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Immunization Records', function(done) {
		api.get('/api/v1/record/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.immunizations.length).to.equal(5);
				done();
			});
	});

	it('Get Immunization Merge Records', function(done) {
		api.get('/api/v1/merges/immunizations')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(13);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(8);
				done();
			});
	});


});