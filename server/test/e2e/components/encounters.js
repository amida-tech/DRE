var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;

var common = require(path.join(__dirname, '../../common/common.js'));


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
});

describe('Encounters API - Test New:', function() {

	it('load sample', function(done) {
		common.loadTestRecord(api, 'bluebutton-01-original.xml', function(err) {
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

	it('Get Encounter Match Records', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.matches.length).to.equal(0);
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
					expect(res.body.merges[i].entry_type).to.equal('encounters');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});

});

describe('Encounters API - Test Duplicate:', function() {

	it('load sample', function(done) {
		common.loadTestRecord(api, 'bluebutton-02-duplicate.xml', function(err) {
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


	it('Get Encounter Match Records', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.matches.length).to.equal(0);
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
					expect(res.body.merges[i].entry_type).to.equal('encounters');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				expect(newCnt).to.equal(1);
				expect(dupCnt).to.equal(1);
				done();
			});
	});


});

describe('Encounters API - Test New/Dupe Mix:', function() {

	it('load sample', function(done) {
		common.loadTestRecord(api, 'bluebutton-03-updated.xml', function(err) {
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


	it('Get Encounter Match Records', function(done) {
		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.matches.length).to.equal(0);
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
					expect(res.body.merges[i].entry_type).to.equal('encounters');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
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
		common.loadTestRecord(api, 'bluebutton-04-diff-source-partial-matches.xml', function(err) {
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
					expect(res.body.merges[i].entry_type).to.equal('encounters');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
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
					expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
					expect(res.body.matches[i].entry_type).to.equal('encounters');
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
					match_id = res.body.matches[0].entry._id;
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
					expect(res.body.merges[i].entry_type).to.equal('encounters');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
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
					match_id = res.body.matches[0].entry._id;
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
					expect(res.body.merges[i].entry_type).to.equal('encounters');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
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
		"encounter": {
			"code": "99213",
			"code_system_name": "ICD",
			"name": "Office outpatient visit 30 minutes",
			"translations": [{
				"name": "Ambulatory",
				"code": "AMB",
				"code_system_name": "HL7ActCode"
			}]
		},
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
		"performers": []
	};

	it('Update Encounter Match Records Merged', function(done) {

		api.get('/api/v1/matches/encounters')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					//console.log(JSON.stringify(res.body.matches, null, 10));
					base_id = res.body.matches[0].matches[0].match_entry._id;
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].entry._id;
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
								api.post('/api/v1/matches/encounters/' + update_id + '/0')
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
						expect(res.body.encounters[iEntry].encounter.code).to.deep.equal(tmp_updated_entry.encounter.code);
						expect(res.body.encounters[iEntry].encounter.code_system).to.deep.equal(tmp_updated_entry.encounter.code_system);
						expect(res.body.encounters[iEntry].date).to.deep.equal(tmp_updated_entry.date);
						expect(res.body.encounters[iEntry].findings).to.deep.equal(tmp_updated_entry.findings);
						expect(res.body.encounters[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
						expect(res.body.encounters[iEntry].locations).to.deep.equal(tmp_updated_entry.locations);
						expect(res.body.encounters[iEntry].encounter.name).to.deep.equal(tmp_updated_entry.encounter.name);
						expect(res.body.encounters[iEntry].performers).to.deep.equal(tmp_updated_entry.performers);
						expect(res.body.encounters[iEntry].encounter.translations).to.deep.equal(tmp_updated_entry.encounter.translations);
						//Metadata slightly different test.
						expect(res.body.encounters[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

					}
				}
				expect(total_encounters).to.equal(0);
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
				var mrgCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					if (res.body.merges[i].merge_reason === 'update') {
						//Get record id off loaded rec, 
						expect(res.body.merges[i].entry._id).to.equal(base_id);
						expect(res.body.merges[i].record.filename).to.equal('bluebutton-04-diff-source-partial-matches.xml');
						mrgCnt++;
					}
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
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