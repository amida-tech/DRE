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
	var filepath = path.join(__dirname, '../../artifacts/test-r1.0/' + fileName);
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

describe('Pre Test Cleanup 1', function() {

	it('Remove File Collections', function(done) {
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

describe('Pre Test Cleanup 2', function() {

	var supportedComponents = {
		allergies: 'allergy',
		procedures: 'procedure',
		medications: 'medication',
		encounters: 'encounter',
		vitals: 'vital',
		results: 'result',
		socialhistories: 'social',
		immunizations: 'immunization',
		demographics: 'demographics',
		problems: 'problem'
	};

	it('Remove All Collections', function(done) {

		var secIteration = 0
		var secTotal = 0

		for (iComponent in supportedComponents) {
			secTotal++;
		}

		function checkLoopComplete () {
			secIteration++;
			if (secIteration === secTotal) {
				done();
			}
		}

		function removeSections (componentSingular, componentPlural, callback) {
			removeCollection(componentPlural, function(err) {
				if (err) {
					done(err);
				}
				removeCollection(componentSingular + 'merges', function(err) {
					if (err) {
						console.log(err);
						done(err);
					}
					removeCollection(componentSingular + 'matches', function(err) {
						if (err) {
							done(err);
						}
						callback();
					});
				});
			});
		}

		for (var iComponent in supportedComponents) {
			removeSections(supportedComponents[iComponent], iComponent, function(err) {
				checkLoopComplete();
			});
		}

	});

});



describe('Count API - Test New:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-01-original.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Count Records', function(done) {
		api.get('/api/v1/notification')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.notifications.unreviewed_merges).to.equal(0);
				expect(res.body.notifications.new_merges).to.equal(23);
				expect(res.body.notifications.duplicate_merges).to.equal(0);
				expect(res.body.notifications.file_count).to.equal(1);
				//console.log(JSON.stringify(res.body, null, 10));
				done();
			});
	});


});

describe('Count API - Test Duplicate:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Count Records', function(done) {
		api.get('/api/v1/notification')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.notifications.unreviewed_merges).to.equal(0);
				expect(res.body.notifications.new_merges).to.equal(23);
				expect(res.body.notifications.duplicate_merges).to.equal(23);
				expect(res.body.notifications.file_count).to.equal(2);
				//console.log(JSON.stringify(res.body, null, 10));
				done();
			});
	});


});

describe('Count API - Test New/Dupe Mix:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-03-updated.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Count Records', function(done) {
		api.get('/api/v1/notification')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.notifications.unreviewed_merges).to.equal(0);
				expect(res.body.notifications.new_merges).to.equal(44);
				expect(res.body.notifications.duplicate_merges).to.equal(41);
				expect(res.body.notifications.file_count).to.equal(3);
				done();
			});
	});

});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Count API - Test Partial Matches:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

		it('Get Count Records', function(done) {
		api.get('/api/v1/notification')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.notifications.unreviewed_merges).to.equal(22);
				expect(res.body.notifications.new_merges).to.equal(66);
				expect(res.body.notifications.duplicate_merges).to.equal(64);
				expect(res.body.notifications.file_count).to.equal(4);
				done();
			});
	});

});

describe('Count API - Test Added Matches via Allergies', function() {

	var update_id = '';
	var match_id = '';

	it('Update Allergy Match Records', function(done) {

		api.get('/api/v1/matches/allergies')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/allergies/' + update_id)
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

	it('Get Count Records', function(done) {
		api.get('/api/v1/notification')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.notifications.unreviewed_merges).to.equal(22);
				expect(res.body.notifications.new_merges).to.equal(66);
				expect(res.body.notifications.duplicate_merges).to.equal(64);
				expect(res.body.notifications.file_count).to.equal(4);
				done();
			});
	});

});




xdescribe('Allergies API - Test Ignored Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Allergy Match Records Ignored', function(done) {
		api.get('/api/v1/matches/allergies')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/allergies/' + update_id)
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

	it('Get Allergy Records', function(done) {
		api.get('/api/v1/record/allergies')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.allergies.length).to.equal(6);
				var total_allergies = 0;
				for (var iEntry in res.body.allergies) {
					if (res.body.allergies[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_allergies++;
					}
				}
				expect(total_allergies).to.equal(0);
				done();
			});
	});

	it('Get Partial Allergy Records', function(done) {
		api.get('/api/v1/record/partial/allergies')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.allergies.length).to.equal(1);
				done();
			});
	});

	it('Get Allergy Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/allergies')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
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
					expect(res.body.merges[i].entry_type).to.equal('allergy');
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

	it('Get Allergy Match Records Post Added', function(done) {
		api.get('/api/v1/matches/allergies')
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


xdescribe('Allergies API - Test Merged Matches', function() {

	var update_id = '';
	var base_id = '';
	var match_id = '';

	it('Update Allergy Match Records Merged', function(done) {

		api.get('/api/v1/matches/allergies')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					base_id = res.body.matches[0].entry_id._id;
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/allergies/' + update_id)
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

	it('Get Allergy Records', function(done) {
		api.get('/api/v1/record/allergies')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.allergies.length).to.equal(6);
				var total_allergies = 0;
				for (var iEntry in res.body.allergies) {
					if (res.body.allergies[iEntry]._id === match_id) {
						total_allergies++;
					}
					if (res.body.allergies[iEntry]._id === base_id) {
						expect(res.body.allergies[iEntry].metadata.attribution.length).to.equal(4);
					}
				}
				expect(total_allergies).to.equal(0);
				//console.log(base_id);

				done();
			});
	});

	it('Get Partial Allergy Records', function(done) {
		api.get('/api/v1/record/partial/allergies')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.allergies.length).to.equal(0);
				done();
			});
	});

	it('Get Allergy Merge Records Post Merged', function(done) {
		api.get('/api/v1/merges/allergies')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.merges,null, 10));
				expect(res.body.merges.length).to.equal(13);
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
				expect(newCnt).to.equal(6);
				expect(dupCnt).to.equal(6);
				expect(mrgCnt).to.equal(1);
				done();
			});
	});

	it('Get Allergy Match Records Post Added', function(done) {
		api.get('/api/v1/matches/allergies')
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
