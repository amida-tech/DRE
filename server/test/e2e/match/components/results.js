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

	it('Remove Result Collections', function(done) {
		removeCollection('results', function(err) {
			if (err) {
				done(err);
			}
			removeCollection('resultmerges', function(err) {
				if (err) {
					done(err);
				}
				removeCollection('resultmatches', function(err) {
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

describe('Results API - Test New:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-01-original.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Result Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.results.length).to.equal(1);
				//console.log(JSON.stringify(res.body.results, null, 10));
				done();
			});
	});

	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.results.length).to.equal(0);
				done();
			});
	});

	it('Get Result Merge Records', function(done) {
		api.get('/api/v1/merges/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(1);
				for (var i in res.body.merges) {
					expect(res.body.merges[i].merge_reason).to.equal('new');
					expect(res.body.merges[i].entry_type).to.equal('result');
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

describe('Results API - Test Duplicate:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Result Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.results, null, 10));
				expect(res.body.results.length).to.equal(1);
				done();
			});
	});


	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.results.length).to.equal(0);
				done();
			});
	});

	it('Get Result Merge Records', function(done) {
		api.get('/api/v1/merges/results')
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
					expect(res.body.merges[i].entry_type).to.equal('result');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(1);
				expect(dupCnt).to.equal(1);
				done();
			});
	});


});

describe('Results API - Test New/Dupe Mix:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-03-updated.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Results Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.results.length).to.equal(7);
				done();
			});
	});


	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.results.length).to.equal(0);
				done();
			});
	});

	it('Get Result Merge Records', function(done) {
		api.get('/api/v1/merges/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(9);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('result');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(7);
				expect(dupCnt).to.equal(2);
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Results API - Test Partial Matches:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Result Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.results.length).to.equal(7);
				done();
			});
	});


	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.results.length).to.equal(3);
				done();
			});
	});

	it('Get Result Merge Records', function(done) {
		api.get('/api/v1/merges/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
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
					expect(res.body.merges[i].entry_type).to.equal('result');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(7);
				expect(dupCnt).to.equal(6);
				done();
			});
	});

	it('Get Result Match Records', function(done) {
		api.get('/api/v1/matches/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.matches, null, 10));
				expect(res.body.matches.length).to.equal(3);
				for (var i in res.body.matches) {
					expect(res.body.matches[i].entry_id.name).to.equal(res.body.matches[i].match_entry_id.name);
					expect(res.body.matches[i].entry_type).to.equal('result');
				}
				done();
			});
	});

});

describe('Results API - Test Added Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Result Match Records', function(done) {

		api.get('/api/v1/matches/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/results/' + update_id)
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

	it('Get Result Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.results.length).to.equal(8);
				var total_results = 0;
				for (var iEntry in res.body.results) {
					if (res.body.results[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_results++;
					}
				}
				expect(total_results).to.equal(1);
				done();
			});
	});

	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.results.length).to.equal(2);
				done();
			});
	});

	it('Get Result Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(14);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('result');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(8);
				expect(dupCnt).to.equal(6);
				done();
			});
	});

	it('Get Result Match Records Post Added', function(done) {
		api.get('/api/v1/matches/results')
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




describe('Results API - Test Ignored Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Result Match Records Ignored', function(done) {
		api.get('/api/v1/matches/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].match_entry_id._id;
					api.post('/api/v1/matches/results/' + update_id)
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

	it('Get Result Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.results.length).to.equal(8);
				var total_results = 0;
				for (var iEntry in res.body.results) {
					if (res.body.results[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_results++;
					}
				}
				expect(total_results).to.equal(0);
				done();
			});
	});

	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.results.length).to.equal(1);
				done();
			});
	});

	it('Get Result Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.merges);
				expect(res.body.merges.length).to.equal(14);
				var newCnt = 0;
				var dupCnt = 0;
				for (var i in res.body.merges) {
					if (res.body.merges[i].merge_reason === 'new') {
						newCnt++;
					}
					if (res.body.merges[i].merge_reason === 'duplicate') {
						dupCnt++;
					}
					expect(res.body.merges[i].entry_type).to.equal('result');
					expect(res.body.merges[i].record_id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
					expect(res.body.merges[i].entry_id._id).to.exist;
					expect(res.body.merges[i].record_id._id).to.exist;
				}
				expect(newCnt).to.equal(8);
				expect(dupCnt).to.equal(6);
				done();
			});
	});

	it('Get Result Match Records Post Added', function(done) {
		api.get('/api/v1/matches/results')
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


describe('Results API - Test Merged Matches', function() {

	var update_id = '';
	var base_id = '';
	var match_id = '';

	var match_id = '';

	var base_id = '';
	var base_object = {};

	var update_id = '';
	var tmp_updated_entry = {
    "code" : "2160-1",
    "code_system_name" : "LOINC",
    "identifiers" : [ 
        {
            "identifier" : "ce19d2be-3d3b-44ea-95f1-5a0a04586377",
        }
    ],
    "name" : "Creatinine [Mass/volume] in Serum or Plasma STuff",
    "results" : [ 
        {
            "freeTextValue" : "PLT (135-145 meq/l)",
            "name" : "Creatinine [Mass/volume] in Serum or Plasma",
            "code" : "2160-0",
            "code_system_name" : "LOINC",
            "value" : 12.0,
            "unit" : "mg/dL",
            "translations" : [],
            "interpretations" : [ 
                "abnormal"
            ],
            "date" : [ 
                {
                    "date" : "2012-11-16T00:00:00.000Z",
                    "precision" : "year"
                }
            ],
            "identifiers" : [ 
                {
                    "identifier" : "9cd43fa7-db31-4c29-ab30-83f92fdcaa20",
                }
            ]
        }
    ],
    "translations" : []
}

	it('Update Result Match Records Merged', function(done) {

		api.get('/api/v1/matches/results')
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
					api.get('/api/v1/record/results')
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							} else {
								for (var i = 0; i < res.body.results.length; i++) {
									if (res.body.results[i]._id === base_id) {
										base_object = res.body.results[i];
									}
								}
								api.post('/api/v1/matches/results/' + update_id)
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

	it('Get Result Records', function(done) {
		api.get('/api/v1/record/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.results.length).to.equal(8);
				var total_results = 0;
				for (var iEntry in res.body.results) {
					if (res.body.results[iEntry]._id === match_id) {
						total_results++;
					}
					if (res.body.results[iEntry]._id === base_id) {

						//console.log(res.body.results[iEntry]);
						//console.log(tmp_updated_entry);

						//SHIM in empty arrays.

						for (var iFind in res.body.results[iEntry].results) {
							if (res.body.results[iEntry].results[iFind].translations === undefined) {
								res.body.results[iEntry].results[iFind].translations = [];
							}
						}


						if (res.body.results[iEntry].translations === undefined) {
							res.body.results[iEntry].translations = [];
						}

						//Test each component.
						expect(res.body.results[iEntry].code).to.deep.equal(tmp_updated_entry.code);
						expect(res.body.results[iEntry].code_system_name).to.deep.equal(tmp_updated_entry.code_system_name);
						expect(res.body.results[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
						expect(res.body.results[iEntry].name).to.deep.equal(tmp_updated_entry.name);
						expect(res.body.results[iEntry].results).to.deep.equal(tmp_updated_entry.results);
						expect(res.body.results[iEntry].translations).to.deep.equal(tmp_updated_entry.translations);
						//Metadata slightly different test.
						expect(res.body.results[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

					}
				}
				expect(total_results).to.equal(0);
				done();
			});
	});

	it('Get Partial Result Records', function(done) {
		api.get('/api/v1/record/partial/results')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.results.length).to.equal(0);
				done();
			});
	});

	it('Get Result Merge Records Post Merged', function(done) {
		api.get('/api/v1/merges/results')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.merges,null, 10));
				expect(res.body.merges.length).to.equal(15);
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
				expect(newCnt).to.equal(8);
				expect(dupCnt).to.equal(6);
				expect(mrgCnt).to.equal(1);
				done();
			});
	});

	it('Get Result Match Records Post Added', function(done) {
		api.get('/api/v1/matches/results')
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
