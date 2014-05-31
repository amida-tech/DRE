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

	it('Remove Encounter Collections', function(done) {
		removeCollection('encounters', function(err) {
			if (err) {
				done(err);
			}
			removeCollection('encountermerges', function(err) {
				if (err) {
					done(err);
				}
				removeCollection('encountermatches', function(err) {
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

describe('Encounters API - Test New:', function() {

	it('load sample', function(done) {
		loadTestRecord('bluebutton-01-original.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Encounter Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.encounters, null, 10));
				expect(res.body.encounters.length).to.equal(1);

				done();
			});
	});

	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.encounters.length).to.equal(0);
				done();
			});
	});

	it('Get Encounter Merge Records', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(1);
				for (var i in res.body.merges) {
					expect(res.body.merges[i].merge_reason).to.equal('new');
					expect(res.body.merges[i].entry_type).to.equal('encounter');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
				}
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});

});

describe('Encounters API - Test Duplicate:', function() {

	it('load sample', function(done) {
		loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Encounter Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.encounters.length).to.equal(1);
				done();
			});
	});


	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.encounters.length).to.equal(0);
				done();
			});
	});

	it('Get Encounter Merge Records', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(2);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('encounter');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
				}
				expect(newCnt).to.equal(1);
				expect(dupCnt).to.equal(1);
				done();
			});
	});


});

describe('Encounters API - Test New/Dupe Mix:', function() {

	it('load sample', function(done) {
		loadTestRecord('bluebutton-03-updated.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Encounters Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.encounters, null, 10));
				expect(res.body.encounters.length).to.equal(4);
				done();
			});
	});


	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.encounters.length).to.equal(0);
				done();
			});
	});

	it('Get Encounter Merge Records', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(5);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('encounter');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
				}
				expect(newCnt).to.equal(4);
				expect(dupCnt).to.equal(1);
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});
});


describe('Encounters API - Test Partial Matches:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Encounter Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.encounters.length).to.equal(4);
				done();
			});
	});


	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.encounters.length).to.equal(3);
				done();
			});
	});

	it('Get Encounter Merge Records', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(5);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('encounter');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
				}
				expect(newCnt).to.equal(4);
				expect(dupCnt).to.equal(1);
				done();
			});
	});

	it('Get Encounter Match Records', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.matches, null, 10));
				expect(res.body.matches.length).to.equal(3);
				for (var i in res.body.matches) {
					expect(res.body.matches[i].entry_id.name).to.equal(res.body.matches[i].match_entry_id.name);
					expect(res.body.matches[i].entry_type).to.equal('encounter');
				}
				done();
			});
	});

});

describe('Encounters API - Test Added Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Encounter Match Records', function(done) {

		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/encounters/' + update_id)
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

	it('Get Encounter Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.encounters.length).to.equal(5);
				var total_encounters = 0;
				for (var iEntry in res.body.encounters) {
					if (res.body.encounters[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_encounters++;
					}
				}
				expect(total_encounters).to.equal(1);
				done();
			});
	});

	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.encounters.length).to.equal(2);
				done();
			});
	});

	it('Get Encounter Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(6);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('encounter');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(1);
				done();
			});
	});

	it('Get Encounter Match Records Post Added', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				}
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.matches.length).to.equal(2);
				done();
			});
	});

});



describe('Encounters API - Test Ignored Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Encounter Match Records Ignored', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/encounters/' + update_id)
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

	it('Get Encounter Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.encounters.length).to.equal(5);
				var total_encounters = 0;
				for (var iEntry in res.body.encounters) {
					if (res.body.encounters[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_encounters++;
					}
				}
				expect(total_encounters).to.equal(0);
				done();
			});
	});

	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.encounters.length).to.equal(1);
				done();
			});
	});

	it('Get Encounter Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(6);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('encounter');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(1);
				done();
			});
	});

	it('Get Encounter Match Records Post Added', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				}
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.matches.length).to.equal(1);
				done();
			});
	});

});


describe('Encounters API - Test Merged Matches', function() {

	var match_id = '';

	var base_id = '';
	var base_object = {};

	var update_id = '';
	var tmp_updated_entry = {
		"code": "99213",
		"code_system_name": "ICD",
		"date": [{
			"date": "2009-02-24T00:00:00.000Z",
			"precision": "month",
		}],
		"findings": [{
			"name": "Hepatitis",
			"code": "233604007",
			"code_system_name": "SNOMED CT",
			"translations": []
		}],
		"identifiers": [{
			"identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
		}],
		"locations": [{
			"name": "Community Urgent Care Zone",
			"phones": [],
			"addresses": [{
				"city": "Blue Bell",
				"state": "MA",
				"zip": "02368",
				"country": "US",
				"streetLines": [
					"17 Daws Rd."
				]
			}],
			"loc_type": {
				"name": "Urgent Care Center",
				"code": "1160-1",
				"code_system_name": "HealthcareServiceLocation",
				"translations": []
			}
		}],
		"name": "Office outpatient visit 30 minutes",
		"performers": [],
		"translations": [{
			"name": "Ambulatory",
			"code": "AMB",
			"code_system_name": "HL7ActCode",
		}]
	}

	it('Update Encounter Match Records Merged', function(done) {

		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					//console.log(JSON.stringify(res.body.matches, null, 10));
					base_id = res.body.matches[0].entry_id._id;
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					//Still need this object to check metadata.
					api.get('/api/v1/record/encounters')
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							} else {
								for (var i = 0; i < res.body.encounters.length; i++) {
									if (res.body.encounters[i]._id === base_id) {
										base_object = res.body.encounters[i];
									}
								}
								api.post('/api/v1/matches/encounters/' + update_id)
									.send({
										determination: "merged",
										updated_entry: tmp_updated_entry
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
				}
			});
	});

	it('Get Encounter Records', function(done) {
		api.get('/api/v1/record/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.encounters.length).to.equal(5);
				var total_encounters = 0;
				for (var iEntry in res.body.encounters) {
					if (res.body.encounters[iEntry]._id === match_id) {
						total_encounters++;
					}
					if (res.body.encounters[iEntry]._id === base_id) {

						//console.log(res.body.encounters[iEntry]);
						//console.log(tmp_updated_entry);

						//SHIM in empty arrays.
						for (var iFind in res.body.encounters[iEntry].findings) {
							if (res.body.encounters[iEntry].findings[iFind].translations === undefined) {
								res.body.encounters[iEntry].findings[iFind].translations = [];
							}
						}

						for (var iLoc in res.body.encounters[iEntry].locations) {
							if (res.body.encounters[iEntry].locations[iLoc].phones === undefined) {
								res.body.encounters[iEntry].locations[iLoc].phones = [];
							}
							if (res.body.encounters[iEntry].locations[iLoc].loc_type.translations === undefined) {
								res.body.encounters[iEntry].locations[iLoc].loc_type.translations = [];
							}
						}

						if (res.body.encounters[iEntry].performers === undefined) {
							res.body.encounters[iEntry].performers = [];
						}

						if (res.body.encounters[iEntry].translations === undefined) {
							res.body.encounters[iEntry].translations = [];
						}

						//Test each component.
						expect(res.body.encounters[iEntry].code).to.deep.equal(tmp_updated_entry.code);
						expect(res.body.encounters[iEntry].code_system).to.deep.equal(tmp_updated_entry.code_system);
						expect(res.body.encounters[iEntry].date).to.deep.equal(tmp_updated_entry.date);
						expect(res.body.encounters[iEntry].findings).to.deep.equal(tmp_updated_entry.findings);
						expect(res.body.encounters[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
						expect(res.body.encounters[iEntry].locations).to.deep.equal(tmp_updated_entry.locations);
						expect(res.body.encounters[iEntry].name).to.deep.equal(tmp_updated_entry.name);
						expect(res.body.encounters[iEntry].performers).to.deep.equal(tmp_updated_entry.performers);
						expect(res.body.encounters[iEntry].translations).to.deep.equal(tmp_updated_entry.translations);
						//Metadata slightly different test.
						expect(res.body.encounters[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

					}
				}
				expect(total_encounters).to.equal(0);
				done();
			});
	});

	it('Get Partial Encounter Records', function(done) {
		api.get('/api/v1/record/partial/encounters')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.encounters.length).to.equal(0);
				done();
			});
	});

	it('Get Encounter Merge Records Post Merged', function(done) {
		api.get('/api/v1/merges/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.merges,null, 10));
				expect(res.body.merges.length).to.equal(7);
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
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(1);
				expect(mrgCnt).to.equal(1);
				done();
			});
	});

	it('Get Encounter Match Records Post Added', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				}
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.matches.length).to.equal(0);
				done();
			});
	});


});