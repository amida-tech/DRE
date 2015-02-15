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

    it('Remove Vital Collections', function (done) {
        removeCollection('vitals', function (err) {
            if (err) {
                done(err);
            }
            removeCollection('vitalsmerges', function (err) {
                if (err) {
                    done(err);
                }
                removeCollection('vitalsmatches', function (err) {
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

describe('Vitals API - Test New:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Vital Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.vitals.length).to.equal(6);
                //console.log(JSON.stringify(res.body.vitals, null, 10));
                done();
            });
    });

    it('Get Vital Match Records', function (done) {
        api.get('/api/v1/matches/vitals')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Vital Merge Records', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(6);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('vitals');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Vitals API - Test Duplicate:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Vital Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.vitals, null, 10));
                expect(res.body.vitals.length).to.equal(6);
                done();
            });
    });

    it('Get Vital Match Records', function (done) {
        api.get('/api/v1/matches/vitals')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Vital Merge Records', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('vitals');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(6);
                done();
            });
    });

});

describe('Vitals API - Test New/Dupe Mix:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-03-updated.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Vitals Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.vitals.length).to.equal(11);
                done();
            });
    });

    it('Get Vital Match Records', function (done) {
        api.get('/api/v1/matches/vitals')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Vital Merge Records', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('vitals');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(11);
                expect(dupCnt).to.equal(12);
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Vitals API - Test Partial Matches:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Vital Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.vitals.length).to.equal(11);
                done();
            });
    });

    it('Get Vital Merge Records', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('vitals');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(11);
                expect(dupCnt).to.equal(20);
                done();
            });
    });

    it('Get Vital Match Records', function (done) {
        api.get('/api/v1/matches/vitals')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body.matches, null, 10));
                expect(res.body.matches.length).to.equal(3);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('vitals');
                }
                done();
            });
    });

});

describe('Vitals API - Test Added Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Vital Match Records', function (done) {

        api.get('/api/v1/matches/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/vitals/' + update_id)
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

    it('Get Vital Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
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

    it('Get Vital Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('vitals');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(12);
                expect(dupCnt).to.equal(20);
                done();
            });
    });

    it('Get Vital Match Records Post Added', function (done) {
        api.get('/api/v1/matches/vitals')
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

describe('Vitals API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Vital Match Records Ignored', function (done) {
        api.get('/api/v1/matches/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/vitals/' + update_id)
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

    it('Get Vital Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
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

    it('Get Vital Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('vitals');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(12);
                expect(dupCnt).to.equal(20);
                done();
            });
    });

    it('Get Vital Match Records Post Added', function (done) {
        api.get('/api/v1/matches/vitals')
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

describe('Vitals API - Test Merged Matches', function () {

    var match_id = '';

    var base_id = '';
    var base_object = {};

    var update_id = '';
    var tmp_updated_entry = {
        "vital": {
            "name": "Weight",
            "code": "3141-9",
            "code_system_name": "LOINC",
            "translations": []
        },
        "date": [{
            "date": "2012-10-01T00:00:00.000Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
            "identifier_type": "1166602190002918"
        }, {
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
            "identifier_type": "1166602190003518"
        }],
        "interpretations": [],
        "status": "completed",
        "unit": "[lb_av]",
        "value": 178
    };

    it('Update Vital Match Records Merged', function (done) {

        api.get('/api/v1/matches/vitals')
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
                    api.get('/api/v1/record/vitals')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.vitals.length; i++) {
                                    if (res.body.vitals[i]._id === base_id) {
                                        base_object = res.body.vitals[i];
                                    }
                                }
                                api.post('/api/v1/matches/vitals/' + update_id + '/0')
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

    it('Get Vital Records', function (done) {
        api.get('/api/v1/record/vitals')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.vitals.length).to.equal(12);
                var total_vitals = 0;
                for (var iEntry in res.body.vitals) {
                    if (res.body.vitals[iEntry]._id === match_id) {
                        total_vitals++;
                    }
                    if (res.body.vitals[iEntry]._id === base_id) {

                        //console.log(res.body.vitals[iEntry]);
                        //console.log(tmp_updated_entry);

                        //SHIM in empty arrays.

                        if (res.body.vitals[iEntry].interpretations === undefined) {
                            res.body.vitals[iEntry].interpretations = [];
                        }

                        if (res.body.vitals[iEntry].vital.translations === undefined) {
                            res.body.vitals[iEntry].vital.translations = [];
                        }

                        //Test each component.
                        expect(res.body.vitals[iEntry].vital.code).to.deep.equal(tmp_updated_entry.vital.code);
                        expect(res.body.vitals[iEntry].vital.code_system_name).to.deep.equal(tmp_updated_entry.vital.code_system_name);
                        expect(res.body.vitals[iEntry].date).to.deep.equal(tmp_updated_entry.date);
                        expect(res.body.vitals[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
                        expect(res.body.vitals[iEntry].vital.name).to.deep.equal(tmp_updated_entry.vital.name);
                        expect(res.body.vitals[iEntry].status).to.deep.equal(tmp_updated_entry.status);
                        expect(res.body.vitals[iEntry].unit).to.deep.equal(tmp_updated_entry.unit);
                        expect(res.body.vitals[iEntry].value).to.deep.equal(tmp_updated_entry.value);
                        //Metadata slightly different test.
                        expect(res.body.vitals[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

                    }
                }
                expect(total_vitals).to.equal(0);
                done();
            });
    });

    it('Get Vital Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/vitals')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges,null, 10));
                expect(res.body.merges.length).to.equal(33);
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
                expect(newCnt).to.equal(12);
                expect(dupCnt).to.equal(20);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Vital Match Records Post Added', function (done) {
        api.get('/api/v1/matches/vitals')
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
