var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;
var common2 = require('../common.js');

function removeCollection(inputCollection, callback) {
    var db;
    database.connect(databaseLocation, function (err, dbase) {
        if (err) {
            throw err;
        }
        db = dbase;
        db.collection(inputCollection, function (err, coll) {
            if (err) {
                throw err;
            }
            coll.remove({}, function (err, results) {
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
        .end(function (err, res) {
            if (err) {
                callback(err);
            }
            callback(null);
        });
}

describe('Pre Test Cleanup', function () {

    it('Remove Problem Collections', function (done) {
        removeCollection('problems', function (err) {
            if (err) {
                done(err);
            }
            removeCollection('problemsmerges', function (err) {
                if (err) {
                    done(err);
                }
                removeCollection('problemsmatches', function (err) {
                    if (err) {
                        done(err);
                    }
                    removeCollection('storage.files', function (err) {
                        if (err) {
                            done(err);
                        }
                        removeCollection('storage.chunks', function (err) {
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
    it('Login', function (done) {
        common2.register(api, 'test', 'test', function () {
            common2.login(api, 'test', 'test', function () {
                done();
            });
        });
    });
});

describe('Problems API - Test New:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Problem Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.problems.length).to.equal(2);
                //console.log(JSON.stringify(res.body.problems, null, 10));
                done();
            });
    });

    it('Get Problem Match Records', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Problem Merge Records', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(2);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('problems');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Problems API - Test Duplicate:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Problem Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.problems, null, 10));
                expect(res.body.problems.length).to.equal(2);
                done();
            });
    });

    it('Get Problem Match Records', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Problem Merge Records', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(4);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('problems');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(2);
                expect(dupCnt).to.equal(2);
                done();
            });
    });

});

describe('Problems API - Test New/Dupe Mix:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-03-updated.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Problems Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.problems.length).to.equal(3);
                done();
            });
    });

    it('Get Problem Match Records', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Problem Merge Records', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(7);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('problems');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(3);
                expect(dupCnt).to.equal(4);
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Problems API - Test Partial Matches:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Problem Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.allergies, null, 10));
                expect(res.body.problems.length).to.equal(3);
                done();
            });
    });

    it('Get Problem Merge Records', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(7);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('problems');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(3);
                expect(dupCnt).to.equal(4);
                done();
            });
    });

    it('Get Problem Match Records', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body.matches, null, 10));
                expect(res.body.matches.length).to.equal(3);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('problems');
                }
                done();
            });
    });

});

describe('Problems API - Test Added Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Problem Match Records', function (done) {

        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/problems/' + update_id)
                        .send({
                            determination: "added"
                        })
                        .expect(200)
                        .end(function (err, res) {
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

    it('Get Problem Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.problems.length).to.equal(4);
                var total_problems = 0;
                for (var iEntry in res.body.problems) {
                    if (res.body.problems[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_problems++;
                    }
                }
                expect(total_problems).to.equal(1);
                done();
            });
    });

    it('Get Problem Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
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
                    expect(res.body.merges[i].entry_type).to.equal('problems');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(4);
                done();
            });
    });

    it('Get Problem Match Records Post Added', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.matches.length).to.equal(2);
                done();
            });
    });

});

describe('Problems API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Problem Match Records Ignored', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/problems/' + update_id)
                        .send({
                            determination: "ignored"
                        })
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                done();
                            }
                        });
                }
            });
    });

    it('Get Problem Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.problems.length).to.equal(4);
                var total_problems = 0;
                for (var iEntry in res.body.problems) {
                    if (res.body.problems[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_problems++;
                    }
                }
                expect(total_problems).to.equal(0);
                done();
            });
    });

    it('Get Problem Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
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
                    expect(res.body.merges[i].entry_type).to.equal('problems');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(4);
                done();
            });
    });

    it('Get Problem Match Records Post Added', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.matches.length).to.equal(1);
                done();
            });
    });

});

describe('Problems API - Test Merged Matches', function () {

    var match_id = '';

    var base_id = '';
    var base_object = {};

    var update_id = '';
    var tmp_updated_entry = {
        "problem": {
            "name": "Hepatitus",
            "code": "36971009",
            "code_system_name": "SNOMED CT"
        },
        "date": [{
            "date": "2012-09-01T00:00:00.000Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1.2.1",
            "identifier_type": "1234556"
        }, {
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1.2.1",
            "identifier_type": "6599352434300001"
        }],
        "negation_indicator": true,
        "source_list_identifiers": [{
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1",
            "identifier_type": "615028800003"
        }, {
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1",
            "identifier_type": "659935200001"
        }],
        "status": "Inactive",
        "translations": []
    };

    it('Update Problem Match Records Merged', function (done) {

        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    //console.log(JSON.stringify(res.body.matches, null, 10));
                    base_id = res.body.matches[0].matches[0].match_entry._id;
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    //Still need this object to check metadata.
                    api.get('/api/v1/record/problems')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.problems.length; i++) {
                                    if (res.body.problems[i]._id === base_id) {
                                        base_object = res.body.problems[i];
                                    }
                                }
                                api.post('/api/v1/matches/problems/' + update_id + '/0')
                                    .send({
                                        determination: "merged",
                                        updated_entry: tmp_updated_entry
                                    })
                                    .expect(200)
                                    .end(function (err, res) {
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

    it('Get Problem Records', function (done) {
        api.get('/api/v1/record/problems')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.problems.length).to.equal(4);
                var total_problems = 0;
                for (var iEntry in res.body.problems) {
                    if (res.body.problems[iEntry]._id === match_id) {
                        total_problems++;
                    }
                    if (res.body.problems[iEntry]._id === base_id) {

                        //console.log(res.body.problems[iEntry]);
                        //console.log(tmp_updated_entry);

                        //SHIM in empty arrays.

                        if (res.body.problems[iEntry].translations === undefined) {
                            res.body.problems[iEntry].translations = [];
                        }

                        //Test each component.
                        expect(res.body.problems[iEntry].code).to.deep.equal(tmp_updated_entry.code);
                        expect(res.body.problems[iEntry].code_system_name).to.deep.equal(tmp_updated_entry.code_system_name);
                        expect(res.body.problems[iEntry].date).to.deep.equal(tmp_updated_entry.date);
                        expect(res.body.problems[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
                        expect(res.body.problems[iEntry].name).to.deep.equal(tmp_updated_entry.name);
                        expect(res.body.problems[iEntry].negation_indicator).to.deep.equal(tmp_updated_entry.negation_indicator);
                        expect(res.body.problems[iEntry].source_list_identifiers).to.deep.equal(tmp_updated_entry.source_list_identifiers);
                        expect(res.body.problems[iEntry].status).to.deep.equal(tmp_updated_entry.status);
                        expect(res.body.problems[iEntry].translations).to.deep.equal(tmp_updated_entry.translations);
                        //Metadata slightly different test.
                        expect(res.body.problems[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

                    }
                }
                expect(total_problems).to.equal(0);
                done();
            });
    });

    it('Get Problem Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges,null, 10));
                expect(res.body.merges.length).to.equal(9);
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
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(4);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Problem Match Records Post Added', function (done) {
        api.get('/api/v1/matches/problems')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

});
