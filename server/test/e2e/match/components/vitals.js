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

var record_id = '';

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

	it('Remove Vital Collections', function(done) {
		removeCollection('vitals', function(err) {
			if (err) {
				done(err);
			}
			removeCollection('vitalmerges', function(err) {
				if (err) {
					done(err);
				}
				removeCollection('vitalmatches', function(err) {
					if (err) {
						done(err);
					}
					removeCollection('storage.files', function(err) {
						if (err) {
							done(err);
						}
						removeCollection('storage.chunks', function(err) {
							if (err) {
								done(err);
							}
							done();
						});
					});
				});
			});
		});
	});

});

describe('Vitals API - Test New:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-01-original.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Vital Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.vitals.length).to.equal(6);
				//console.log(JSON.stringify(res.body.vitals, null, 10));
				done();
			});
	});

	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.vitals.length).to.equal(0);
				done();
			});
	});

	it('Get Vital Merge Records', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(6);
				for (var i in res.body.merges) {
					expect(res.body.merges[i].merge_reason).to.equal('new');
					expect(res.body.merges[i].entry_type).to.equal('vital');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});

});

describe('Vitals API - Test Duplicate:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Vital Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.vitals, null, 10));
				expect(res.body.vitals.length).to.equal(6);
				done();
			});
	});


	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.vitals.length).to.equal(0);
				done();
			});
	});

	it('Get Vital Merge Records', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(12);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('vital');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(6);
				expect(dupCnt).to.equal(6);
				done();
			});
	});


});

describe('Vitals API - Test New/Dupe Mix:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-03-updated.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Vitals Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.vitals.length).to.equal(11);
				done();
			});
	});


	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.vitals.length).to.equal(0);
				done();
			});
	});

	it('Get Vital Merge Records', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(23);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('vital');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(11);
				expect(dupCnt).to.equal(12);
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Vitals API - Test Partial Matches:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Vital Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.vitals.length).to.equal(11);
				done();
			});
	});


	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.vitals.length).to.equal(3);
				done();
			});
	});

	it('Get Vital Merge Records', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(31);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('vital');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(11);
				expect(dupCnt).to.equal(20);
				done();
			});
	});

	it('Get Vital Match Records', function(done) {
		api.get('/api/v1/matches/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.matches, null, 10));
				expect(res.body.matches.length).to.equal(3);
				for (var i in res.body.matches) {
					expect(res.body.matches[i].entry_id.name).to.equal(res.body.matches[i].match_entry_id.name);
					expect(res.body.matches[i].entry_type).to.equal('vital');
				}
				done();
			});
	});

});

describe('Vitals API - Test Added Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Vital Match Records', function(done) {

		api.get('/api/v1/matches/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/vitals/' + update_id)
						.send({
							determination: "added"
						})
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							} else {
								expect(res.body).to.be.empty;
								done();
							}
						});
				}
			});
	});

	it('Get Vital Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.vitals.length).to.equal(12);
				var total_vitals = 0;
				for (var iEntry in res.body.vitals) {
					if (res.body.vitals[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_vitals++;
					}
				}
				expect(total_vitals).to.equal(1);
				done();
			});
	});

	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.vitals.length).to.equal(2);
				done();
			});
	});

	it('Get Vital Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(32);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('vital');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(12);
				expect(dupCnt).to.equal(20);
				done();
			});
	});

	it('Get Vital Match Records Post Added', function(done) {
		api.get('/api/v1/matches/vitals')
		.expect(200)
		.end(function(err, res) {
			if (err)  {
				done(err);
			}
			//console.log(JSON.stringify(res.body, null, 10));
			expect(res.body.matches.length).to.equal(2);
			done();
		});
	});

});




describe('Vitals API - Test Ignored Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Vital Match Records Ignored', function(done) {
		api.get('/api/v1/matches/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/vitals/' + update_id)
						.send({
							determination: "ignored"
						})
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							} else {
								done();
							}
						});
				}
			});
	});

	it('Get Vital Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.vitals.length).to.equal(12);
				var total_vitals = 0;
				for (var iEntry in res.body.vitals) {
					if (res.body.vitals[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_vitals++;
					}
				}
				expect(total_vitals).to.equal(0);
				done();
			});
	});

	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.vitals.length).to.equal(1);
				done();
			});
	});

	it('Get Vital Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(32);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('vital');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(12);
				expect(dupCnt).to.equal(20);
				done();
			});
	});

	it('Get Vital Match Records Post Added', function(done) {
		api.get('/api/v1/matches/vitals')
		.expect(200)
		.end(function(err, res) {
			if (err)  {
				done(err);
			}
			//console.log(JSON.stringify(res.body, null, 10));
			expect(res.body.matches.length).to.equal(1);
			done();
		});
	});

});


describe('Vitals API - Test Merged Matches', function() {

	var update_id = '';
	var base_id = '';
	var match_id = '';

	it('Update Vital Match Records Merged', function(done) {

		api.get('/api/v1/matches/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					base_id = res.body.matches[0].entry_id._id;
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/vitals/' + update_id)
						.send({
							determination: "merged"
						})
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							} else {
								done();
							}
						});
				}
			});
	});

	it('Get Vital Records', function(done) {
		api.get('/api/v1/record/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.vitals.length).to.equal(12);
				var total_vitals = 0;
				for (var iEntry in res.body.vitals) {
					if (res.body.vitals[iEntry]._id === match_id) {
						total_vitals++;
					}
					if (res.body.vitals[iEntry]._id === base_id) {
						//console.log(res.body.vitals[iEntry]);
						expect(res.body.vitals[iEntry].date[0].precision).to.equal('month');
						expect(res.body.vitals[iEntry].metadata.attribution.length).to.equal(2);
					}
				}
				expect(total_vitals).to.equal(0);
				//console.log(base_id);

				done();
			});
	});

	it('Get Partial Vital Records', function(done) {
		api.get('/api/v1/record/partial/vitals')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.vitals.length).to.equal(0);
				done();
			});
	});

	it('Get Vital Merge Records Post Merged', function(done) {
		api.get('/api/v1/merges/vitals')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.merges,null, 10));
				expect(res.body.merges.length).to.equal(33);
				var newCnt = 0;
				var dupCnt = 0;
				var mrgCnt = 0
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					if (res.body.merges[i].merge_reason === 'update') {
						//Get record id off loaded rec, 
						expect(res.body.merges[i].entry_id._id).to.equal(base_id);
						expect(res.body.merges[i].record_id.filename).to.equal('bluebutton-04-diff-source-partial-matches.xml');
						mrgCnt++;
					}
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(12);
				expect(dupCnt).to.equal(20);
				expect(mrgCnt).to.equal(1);
				done();
			});
	});

	it('Get Vital Match Records Post Added', function(done) {
		api.get('/api/v1/matches/vitals')
		.expect(200)
		.end(function(err, res) {
			if (err)  {
				done(err);
			}
			//console.log(JSON.stringify(res.body, null, 10));
			expect(res.body.matches.length).to.equal(0);
			done();
		});
	});


});
