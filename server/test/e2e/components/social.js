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


describe('Pre Test Cleanup', function() {

	it('Remove Social Collections', function(done) {
		removeCollection('social_histories', function(err) {
			if (err) {
				done(err);
			}
			removeCollection('social_historymerges', function(err) {
				if (err) {
					done(err);
				}
				removeCollection('social_historymatches', function(err) {
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

describe('Social API - Test New:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-01-original.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.social_history, null, 10));
				expect(res.body.social_history.length).to.equal(4);
				done();
			});
	});

	it('Get Social Match Records', function(done) {
		api.get('/api/v1/matches/social_history')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.matches.length).to.equal(0);
				done();
			});
	});

	it('Get Social Merge Records', function(done) {
		api.get('/api/v1/merges/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				expect(res.body.merges.length).to.equal(4);
				for (var i in res.body.merges) {
					expect(res.body.merges[i].merge_reason).to.equal('new');
					expect(res.body.merges[i].entry_type).to.equal('social_history');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				//console.log(JSON.stringify(res.body.merges, null, 10));
				done();
			});
	});

});

describe('Social API - Test Duplicate:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.allergies, null, 10));
				expect(res.body.social_history.length).to.equal(4);
				done();
			});
	});


	it('Get Social Match Records', function(done) {
		api.get('/api/v1/matches/social_history')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.matches.length).to.equal(0);
				done();
			});
	});

	it('Get Social Merge Records', function(done) {
		api.get('/api/v1/merges/social_history')
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
					expect(res.body.merges[i].entry_type).to.equal('social_history');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				expect(newCnt).to.equal(4);
				expect(dupCnt).to.equal(4);
				done();
			});
	});


});

describe('Social API - Test New/Dupe Mix:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-03-updated.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(res.body.social_history);
				expect(res.body.social_history.length).to.equal(4);
				done();
			});
	});


	it('Get Social Match Records', function(done) {
		api.get('/api/v1/matches/social_history')
			.expect(200)
			.end(function(err, res) {
				expect(res.body.matches.length).to.equal(0);
				done();
			});
	});

	it('Get Social Merge Records', function(done) {
		api.get('/api/v1/merges/social_history')
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
					expect(res.body.merges[i].entry_type).to.equal('social_history');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				//console.log(JSON.stringify(res.body.merges, null, 10));
				expect(newCnt).to.equal(4);
				expect(dupCnt).to.equal(8);
				
				done();
			});
	});
});

//Modified 1 allergy's date range.
describe('Social API - Test Partial Matches:', function() {

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.social_history, null, 10));
				expect(res.body.social_history.length).to.equal(4);
				done();
			});
	});

	it('Get Social Merge Records', function(done) {
		api.get('/api/v1/merges/social_history')
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
					expect(res.body.merges[i].entry_type).to.equal('social_history');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				expect(newCnt).to.equal(4);
				expect(dupCnt).to.equal(8);
				done();
			});
	});

	it('Get Social Match Records', function(done) {
		api.get('/api/v1/matches/social_history')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body.matches, null, 10));
				expect(res.body.matches.length).to.equal(4);
				for (var i in res.body.matches) {
					expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
					expect(res.body.matches[i].entry_type).to.equal('social_history');
				}
				done();
			});
	});

});

describe('Social API - Test Added Matches', function() {

	var update_id = '';
	var match_id = '';

	it('Update Social Match Records', function(done) {

		api.get('/api/v1/matches/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {
					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].entry._id;
					api.post('/api/v1/matches/social_history/' + update_id)
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

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.social_history.length).to.equal(5);
				var total_allergies = 0;
				for (var iEntry in res.body.social_history) {
					if (res.body.social_history[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_allergies++;
					}
				}
				expect(total_allergies).to.equal(1);
				done();
			});
	});

	it('Get Social Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/social_history')
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
					expect(res.body.merges[i].entry_type).to.equal('social_history');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(8);
				done();
			});
	});

	it('Get Social Match Records Post Added', function(done) {
		api.get('/api/v1/matches/social_history')
		.expect(200)
		.end(function(err, res) {
			if (err)  {
				done(err);
			}
			//console.log(JSON.stringify(res.body, null, 10));
			expect(res.body.matches.length).to.equal(3);
			done();
		});
	});

});




describe('Social API - Test Ignored Matches', function() {

	var update_id = '';
	var match_id = '';

	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});

	it('Update Social Match Records Ignored', function(done) {
		api.get('/api/v1/matches/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					done(err);
				} else {

					//console.log(res.body.matches);

					update_id = res.body.matches[0]._id;
					match_id = res.body.matches[0].entry._id;
					api.post('/api/v1/matches/social_history/' + update_id)
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

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.social_history.length).to.equal(5);
				var total_allergies = 0;
				for (var iEntry in res.body.social_history) {
					if (res.body.social_history[iEntry]._id === match_id) {
						//console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
						total_allergies++;
					}
				}
				expect(total_allergies).to.equal(0);
				done();
			});
	});

	it('Get Social Merge Records Post Added', function(done) {
		api.get('/api/v1/merges/social_history')
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
					expect(res.body.merges[i].entry_type).to.equal('social_history');
					expect(res.body.merges[i].record).to.exist;
					expect(res.body.merges[i].record._id).to.exist;
					expect(res.body.merges[i].entry._id).to.exist;
				}
				expect(newCnt).to.equal(5);
				expect(dupCnt).to.equal(9);
				done();
			});
	});

	it('Get Social Match Records Post Added', function(done) {
		api.get('/api/v1/matches/social_history')
		.expect(200)
		.end(function(err, res) {
			if (err)  {
				done(err);
			}
			//console.log(JSON.stringify(res.body, null, 10));
			expect(res.body.matches.length).to.equal(5);
			done();
		});
	});

});


describe('Social API - Test Merged Matches', function() {


	before(function(done) {
		loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});
	var match_id = '';

	var base_id = '';
	var base_object = {};

	var update_id = '';
	var tmp_updated_entry = {
		"smoking_statuses": [{
			"date": [{
				"date": "2005-05-01T00:00:00.000Z",
				"precision": "day"
			}, {
				"date": "2012-02-27T13:00:00.000Z",
				"precision": "subsecond"
			}],
			"value": "Heavy smoker"
		}]
	};

	it('Update Social Match Records Merged', function(done) {

		api.get('/api/v1/matches/social_history')
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
					api.get('/api/v1/record/social_history')
						.expect(200)
						.end(function(err, res) {
							if (err) {
								done(err);
							} else {
								for (var i = 0; i < res.body.social_history.length; i++) {
									if (res.body.social_history[i]._id === base_id) {
										base_object = res.body.social_history[i];
									}
								}
								api.post('/api/v1/matches/social_history/' + update_id + '/0')
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

	it('Get Social Records', function(done) {
		api.get('/api/v1/record/social_history')
			.expect(200)
			.end(function(err, res) {
				//console.log(JSON.stringify(res.body, null, 10));
				expect(res.body.social_history.length).to.equal(5);
				var total_socials = 0;
				for (var iEntry in res.body.social_history) {
					if (res.body.social_history[iEntry]._id === match_id) {
						total_socials++;
					}
					if (res.body.social_history[iEntry]._id === base_id) {

						//console.log(res.body.social_history[iEntry]);
						//console.log(tmp_updated_entry);

						//Test each component.
						expect(res.body.social_history[iEntry].smoking_statuses[0].date).to.deep.equal(tmp_updated_entry.smoking_statuses[0].date);
						expect(res.body.social_history[iEntry].smoking_statuses[0].value).to.deep.equal(tmp_updated_entry.smoking_statuses[0].value);
						//Metadata slightly different test.
						expect(res.body.social_history[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

					}
				}
				expect(total_socials).to.equal(0);
				done();
			});
	});

	it('Get Social Merge Records Post Merged', function(done) {
		api.get('/api/v1/merges/social_history')
			.expect(200)
			.end(function(err, res) {
				if (err) {
					return done(err);
				}
				//console.log(JSON.stringify(res.body.merges,null, 10));
				expect(res.body.merges.length).to.equal(16);
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
				expect(dupCnt).to.equal(10);
				expect(mrgCnt).to.equal(1);
				done();
			});
	});

	it('Get Social Match Records Post Added', function(done) {
		api.get('/api/v1/matches/social_history')
		.expect(200)
		.end(function(err, res) {
			if (err)  {
				done(err);
			}
			//console.log(JSON.stringify(res.body, null, 10));
			expect(res.body.matches.length).to.equal(7);
			done();
		});
	});


});
