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

    it('Remove Demographic Collections', function (done) {
        removeCollection('demographics', function (err) {
            if (err) {
                done(err);
            }
            removeCollection('demographicsmerges', function (err) {
                if (err) {
                    done(err);
                }
                removeCollection('demographicsmatches', function (err) {
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

describe('Demographic API - Test New:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Demographic Records', function (done) {
        api.get('/api/v1/record/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.demographics, null, 10));
                expect(res.body.demographics.length).to.equal(1);
                done();
            });
    });

    it('Get Match Demographic Records', function (done) {
        api.get('/api/v1/matches/demographics')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Demographic Merge Records', function (done) {
        api.get('/api/v1/merges/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(1);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('demographics');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Demographic API - Test Duplicate:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Demographic Records', function (done) {
        api.get('/api/v1/record/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.allergies, null, 10));
                expect(res.body.demographics.length).to.equal(1);
                done();
            });
    });

    it('Get Match Demographic Records', function (done) {
        api.get('/api/v1/matches/demographics')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Demographic Merge Records', function (done) {
        api.get('/api/v1/merges/demographics')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('demographics');
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

//REMOVED:  New/Dupe Mix.  Invalid, as demographics can only by definition have one per record.

describe('Demographic API - Test Partial Matches:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Demographic Records', function (done) {
        api.get('/api/v1/record/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.demographics, null, 10));
                expect(res.body.demographics.length).to.equal(1);
                done();
            });
    });

    it('Get Demographic Merge Records', function (done) {
        api.get('/api/v1/merges/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
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
                    expect(res.body.merges[i].entry_type).to.equal('demographics');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(1);
                expect(dupCnt).to.equal(1);
                done();
            });
    });

    it('Get Demographic Match Records', function (done) {
        api.get('/api/v1/matches/demographics')
            .expect(200)
            .end(function (err, res) {

                //console.log(JSON.stringify(res.body.matches, null, 10));

                expect(res.body.matches.length).to.equal(1);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.deep.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('demographics');
                }
                done();
            });
    });

});

describe('Demographic API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Demographic Match Records Ignored', function (done) {
        api.get('/api/v1/matches/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/demographics/' + update_id)
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

    it('Get Demographic Records', function (done) {
        api.get('/api/v1/record/demographics')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.demographics.length).to.equal(1);
                var total_demographics = 0;
                for (var iEntry in res.body.demographics) {
                    if (res.body.demographics[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_demographics++;
                    }
                }
                expect(total_demographics).to.equal(0);
                done();
            });
    });

    it('Get Demographic Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
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
                    expect(res.body.merges[i].entry_type).to.equal('demographics');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(1);
                expect(dupCnt).to.equal(1);
                done();
            });
    });

    it('Get Demographic Match Records Post Added', function (done) {
        api.get('/api/v1/matches/demographics')
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

describe('Demographic API - Test Merged Matches', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
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
        "addresses": [{
            "city": "Beaverzone",
            "state": "AL",
            "zip": "97867",
            "country": "US",
            "use": "primary home",
            "streetLines": [
                "1352 Amber Drive"
            ]
        }],
        "birthplace": {
            "city": "Beaverlandia",
            "state": "AL",
            "zip": "97867",
            "country": "US",
            "streetLines": []
        },
        "dob": [{
            "date": "1976-05-01T00:00:00.000Z",
            "precision": "month"
        }],
        "email": [{
            "address": "bz@test.com"
        }],
        "gender": "Male",
        "guardians": [{
            "relation": "Parent",
            "email": [],
            "phone": [{
                "number": "(816)276-6909",
                "type": "primary home"
            }],
            "names": [{
                "last": "Jones",
                "first": "Ralph",
                "middle": []
            }],
            "addresses": [{
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home",
                "streetLines": [
                    "1357 Amber Drive"
                ]
            }]
        }],
        "identifiers": [{
            "identifier": "2.16.840.1.113883.19.5.99999.2",
            "extension": "998991"
        }, {
            "identifier": "2.16.840.1.113883.4.1",
            "extension": "111-00-2330"
        }],
        "languages": [{
            "language": "fr",
            "preferred": true,
            "mode": "Expressed spoken",
            "proficiency": "decent"
        }],
        "marital_status": "Divorced",
        "name": {
            "last": "Jones",
            "first": "Isabella",
            "middle": [
                "Isa"
            ]
        },
        "phone": [{
            "number": "(816)276-6909",
            "type": "primary home"
        }, {
            "number": "(813)276-6909",
            "type": "primary work"
        }],
        "race_ethnicity": "White",
        "religion": "Christian (non-Catholic, non-specific)"
    };

    it('Update Demographic Match Records Merged', function (done) {

        api.get('/api/v1/matches/demographics')
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
                    api.get('/api/v1/record/demographics')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.demographics.length; i++) {
                                    if (res.body.demographics[i]._id === base_id) {
                                        base_object = res.body.demographics[i];
                                    }
                                }
                                api.post('/api/v1/matches/demographics/' + update_id + '/0')
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

    it('Get Demographic Records', function (done) {
        api.get('/api/v1/record/demographics')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.demographics.length).to.equal(1);
                var total_demographics = 0;
                for (var iEntry in res.body.demographics) {
                    if (res.body.demographics[iEntry]._id === match_id) {
                        total_demographics++;
                    }
                    if (res.body.demographics[iEntry]._id === base_id) {

                        //console.log(res.body.demographics[iEntry]);
                        //console.log(tmp_updated_entry);

                        //SHIM in empty arrays.
                        if (res.body.demographics[iEntry].birthplace.streetLines === undefined) {
                            res.body.demographics[iEntry].birthplace.streetLines = [];
                        }
                        if (res.body.demographics[iEntry].email === undefined) {
                            res.body.demographics[iEntry].email = [];
                        }

                        for (var iGuard in res.body.demographics[iEntry].guardians) {
                            if (res.body.demographics[iEntry].guardians[iGuard].email === undefined) {
                                res.body.demographics[iEntry].guardians[iGuard].email = [];
                            }
                            for (var iName in res.body.demographics[iEntry].guardians[iGuard].names) {
                                if (res.body.demographics[iEntry].guardians[iGuard].names[iName].middle === undefined) {
                                    res.body.demographics[iEntry].guardians[iGuard].names[iName].middle = [];
                                }
                            }
                        }

                        //Test each component.
                        expect(res.body.demographics[iEntry].addresses).to.deep.equal(tmp_updated_entry.addresses);
                        expect(res.body.demographics[iEntry].birthplace).to.deep.equal(tmp_updated_entry.birthplace);
                        expect(res.body.demographics[iEntry].dob).to.deep.equal(tmp_updated_entry.dob);
                        expect(res.body.demographics[iEntry].email).to.deep.equal(tmp_updated_entry.email);
                        expect(res.body.demographics[iEntry].gender).to.deep.equal(tmp_updated_entry.gender);
                        expect(res.body.demographics[iEntry].guardians).to.deep.equal(tmp_updated_entry.guardians);
                        expect(res.body.demographics[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
                        expect(res.body.demographics[iEntry].languages).to.deep.equal(tmp_updated_entry.languages);
                        expect(res.body.demographics[iEntry].marital_status).to.deep.equal(tmp_updated_entry.marital_status);
                        expect(res.body.demographics[iEntry].name).to.deep.equal(tmp_updated_entry.name);
                        expect(res.body.demographics[iEntry].phone).to.deep.equal(tmp_updated_entry.phone);
                        expect(res.body.demographics[iEntry].race_ethnicity).to.deep.equal(tmp_updated_entry.race_ethnicity);
                        expect(res.body.demographics[iEntry].religion).to.deep.equal(tmp_updated_entry.religion);
                        //Metadata slightly different test.
                        expect(res.body.demographics[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

                    }
                }
                expect(total_demographics).to.equal(0);
                done();
            });
    });

    it('Get Demographic Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/demographics')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges,null, 10));
                expect(res.body.merges.length).to.equal(3);
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
                expect(newCnt).to.equal(1);
                expect(dupCnt).to.equal(1);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Demographic Match Records Post Added', function (done) {
        api.get('/api/v1/matches/demographics')
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
