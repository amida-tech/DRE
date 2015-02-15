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

    it('Remove Immunization Collections', function (done) {
        removeCollection('immunizations', function (err) {
            if (err) {
                done(err);
            }
            removeCollection('immunizationsmerges', function (err) {
                if (err) {
                    done(err);
                }
                removeCollection('immunizationsmatches', function (err) {
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

describe('Immunizations API - Test New:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Immunization Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.immunizations.length).to.equal(4);
                //console.log(JSON.stringify(res.body.immunizations, null, 10));
                done();
            });
    });

    it('Get Immunization Match Records', function (done) {
        api.get('/api/v1/matches/immunizations')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Immunization Merge Records', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(4);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('immunizations');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Immunizations API - Test Duplicate:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Immunization Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.immunizations, null, 10));
                expect(res.body.immunizations.length).to.equal(4);
                done();
            });
    });

    it('Get Immunization Match Records', function (done) {
        api.get('/api/v1/matches/immunizations')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Immunization Merge Records', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('immunizations');
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

describe('Immunizations API - Test New/Dupe Mix:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-03-updated.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Immunizations Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                //console.log(res.body.immunizations);

                expect(res.body.immunizations.length).to.equal(5);
                done();
            });
    });

    it('Get Immunization Match Records', function (done) {
        api.get('/api/v1/matches/immunizations')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Immunization Merge Records', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
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
                    expect(res.body.merges[i].entry_type).to.equal('immunizations');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(5);
                expect(dupCnt).to.equal(8);
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Immunizations API - Test Partial Matches:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Immunization Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.immunizations, null, 10));
                expect(res.body.immunizations.length).to.equal(5);
                done();
            });
    });

    it('Get Immunization Merge Records', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(15);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('immunizations');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(5);
                expect(dupCnt).to.equal(10);
                done();
            });
    });

    it('Get Immunization Match Records', function (done) {
        api.get('/api/v1/matches/immunizations')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body.matches, null, 10));
                expect(res.body.matches.length).to.equal(3);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('immunizations');
                }
                done();
            });
    });

});

describe('Immunizations API - Test Added Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Immunization Match Records', function (done) {

        api.get('/api/v1/matches/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/immunizations/' + update_id)
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

    it('Get Immunization Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.immunizations.length).to.equal(6);
                var total_immunizations = 0;
                for (var iEntry in res.body.immunizations) {
                    if (res.body.immunizations[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.immunizations[iEntry], null, 10));
                        total_immunizations++;
                    }
                }
                expect(total_immunizations).to.equal(1);
                done();
            });
    });

    it('Get Immunization Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(16);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('immunizations');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(10);
                done();
            });
    });

    it('Get Immunization Match Records Post Added', function (done) {
        api.get('/api/v1/matches/immunizations')
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

describe('Immunizations API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Immunization Match Records Ignored', function (done) {
        api.get('/api/v1/matches/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/immunizations/' + update_id)
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

    it('Get Immunization Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.immunizations.length).to.equal(6);
                var total_immunizations = 0;
                for (var iEntry in res.body.immunizations) {
                    if (res.body.immunizations[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.immunizations[iEntry], null, 10));
                        total_immunizations++;
                    }
                }
                expect(total_immunizations).to.equal(0);
                done();
            });
    });

    it('Get Immunization Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(16);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('immunizations');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(10);
                done();
            });
    });

    it('Get Immunization Match Records Post Added', function (done) {
        api.get('/api/v1/matches/immunizations')
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

describe('Immunizations API - Test Merged Matches', function () {

    var match_id = '';

    var base_id = '';
    var base_object = {};

    var update_id = '';
    var tmp_updated_entry = {
        "administration": {
            "form": {
                "translations": []
            },
            "dose": {
                "value": 0.8,
                "unit": "ml"
            },
            "body_site": {
                "translations": []
            },
            "route": {
                "name": "FACIAL",
                "code": "C28161",
                "code_system_name": "Medication Route FDA",
                "translations": []
            }
        },
        "date": [{
            "date": "2012-08-06T00:00:00.000Z",
            "precision": "hour"
        }],
        "identifiers": [{
            "identifier": "1.3.6.1.4.1.22812.4.111.0.4.4",
            "identifier_type": "1049280"
        }],
        "performer": {
            "organization": [],
            "phone": [{
                "number": "+1-(535)555-1002"
            }],
            "email": [{
                "address": "hank@somewhere.com"
            }],
            "address": [{
                "city": "Portland",
                "state": "OR",
                "zip": "97005",
                "country": "US",
                "streetLines": [
                    "1002 Healthcare Dr."
                ]
            }],
            "name": [{
                "last": "Seven",
                "first": "Henry",
                "middle": ["Delta"]
            }],
            "identifiers": [{
                "identifier": "2.16.840.1.113883.4.6",
                "identifier_type": "1569874562"
            }]
        },
        "product": {
            "lot_number": "MK456987",
            "manufacturer": "Merck and Co., Inc.",
            "product": {
                "name": "Pneumococcal (2 years and up)",
                "code": "23",
                "code_system_name": "CVX"
            }
        },
        "status": "refused"
    };

    it('Update Immunization Match Records Merged', function (done) {

        api.get('/api/v1/matches/immunizations')
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
                    api.get('/api/v1/record/immunizations')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.immunizations.length; i++) {
                                    if (res.body.immunizations[i]._id === base_id) {
                                        base_object = res.body.immunizations[i];
                                    }
                                }
                                api.post('/api/v1/matches/immunizations/' + update_id + '/0')
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

    it('Get Immunization Records', function (done) {
        api.get('/api/v1/record/immunizations')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.immunizations.length).to.equal(6);
                var total_immunizations = 0;
                for (var iEntry in res.body.immunizations) {
                    if (res.body.immunizations[iEntry]._id === match_id) {
                        total_immunizations++;
                    }
                    if (res.body.immunizations[iEntry]._id === base_id) {

                        //console.log(res.body.immunizations[iEntry]);
                        //console.log(tmp_updated_entry);

                        //SHIM in empty arrays.
                        for (var iFind in res.body.immunizations[iEntry].findings) {
                            if (res.body.immunizations[iEntry].findings[iFind].translations === undefined) {
                                res.body.immunizations[iEntry].findings[iFind].translations = [];
                            }
                        }

                        if (res.body.immunizations[iEntry].administration.form === undefined) {
                            res.body.immunizations[iEntry].administration.form = {};
                        }
                        if (res.body.immunizations[iEntry].administration.form.translations === undefined) {
                            res.body.immunizations[iEntry].administration.form.translations = [];
                        }
                        if (res.body.immunizations[iEntry].administration.body_site === undefined) {
                            res.body.immunizations[iEntry].administration.body_site = {};
                        }
                        if (res.body.immunizations[iEntry].administration.body_site.translations === undefined) {
                            res.body.immunizations[iEntry].administration.body_site.translations = [];
                        }
                        if (res.body.immunizations[iEntry].administration.route === undefined) {
                            res.body.immunizations[iEntry].administration.route = {};
                        }
                        if (res.body.immunizations[iEntry].administration.route.translations === undefined) {
                            res.body.immunizations[iEntry].administration.route.translations = [];
                        }
                        if (res.body.immunizations[iEntry].performer.organization === undefined) {
                            res.body.immunizations[iEntry].performer.organization = [];
                        }
                        if (res.body.immunizations[iEntry].performer.organization === undefined) {
                            res.body.immunizations[iEntry].performer.organization = [];
                        }

                        for (iFind in res.body.immunizations[iEntry].performer.name) {
                            if (res.body.immunizations[iEntry].performer.name[iFind].middle === undefined) {
                                res.body.immunizations[iEntry].performer.name[iFind].middle = [];
                            }
                        }

                        //Test each component.
                        expect(res.body.immunizations[iEntry].administration).to.deep.equal(tmp_updated_entry.administration);
                        expect(res.body.immunizations[iEntry].date).to.deep.equal(tmp_updated_entry.date);
                        expect(res.body.immunizations[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
                        expect(res.body.immunizations[iEntry].performer).to.deep.equal(tmp_updated_entry.performer);
                        expect(res.body.immunizations[iEntry].product).to.deep.equal(tmp_updated_entry.product);
                        expect(res.body.immunizations[iEntry].status).to.deep.equal(tmp_updated_entry.status);
                        //Metadata slightly different test.
                        expect(res.body.immunizations[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

                    }
                }
                expect(total_immunizations).to.equal(0);
                done();
            });
    });

    it('Get Immunization Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/immunizations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges,null, 10));
                expect(res.body.merges.length).to.equal(17);
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
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(10);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Immunization Match Records Post Added', function (done) {
        api.get('/api/v1/matches/immunizations')
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
