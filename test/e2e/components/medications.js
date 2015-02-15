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

    it('Remove Medication Collections', function (done) {
        removeCollection('medications', function (err) {
            if (err) {
                done(err);
            }
            removeCollection('medicationsmerges', function (err) {
                if (err) {
                    done(err);
                }
                removeCollection('medicationsmatches', function (err) {
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

describe('Medications API - Test New:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Medication Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.medications.length).to.equal(1);
                //console.log(JSON.stringify(res.body.medications, null, 10));
                done();
            });
    });

    it('Get Medication Match Records', function (done) {
        api.get('/api/v1/matches/medications')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Medication Merge Records', function (done) {
        api.get('/api/v1/merges/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(1);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('medications');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Medications API - Test Duplicate:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Medication Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.medications, null, 10));
                expect(res.body.medications.length).to.equal(1);
                done();
            });
    });

    it('Get Medication Match Records', function (done) {
        api.get('/api/v1/matches/medications')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Medication Merge Records', function (done) {
        api.get('/api/v1/merges/medications')
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
                    expect(res.body.merges[i].entry_type).to.equal('medications');
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

describe('Medications API - Test New/Dupe Mix:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-03-updated.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Medications Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.medications.length).to.equal(3);
                done();
            });
    });

    it('Get Medication Match Records', function (done) {
        api.get('/api/v1/matches/medications')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Medication Merge Records', function (done) {
        api.get('/api/v1/merges/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
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
                    expect(res.body.merges[i].entry_type).to.equal('medications');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(3);
                expect(dupCnt).to.equal(2);
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Medications API - Test Partial Matches:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Medication Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.medications, null, 10));
                expect(res.body.medications.length).to.equal(3);
                done();
            });
    });

    it('Get Medication Merge Records', function (done) {
        api.get('/api/v1/merges/medications')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('medications');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(3);
                expect(dupCnt).to.equal(2);
                done();
            });
    });

    it('Get Medication Match Records', function (done) {
        api.get('/api/v1/matches/medications')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body.matches, null, 10));
                expect(res.body.matches.length).to.equal(3);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('medications');
                }
                done();
            });
    });

});

describe('Medications API - Test Added Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Medication Match Records', function (done) {

        api.get('/api/v1/matches/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/medications/' + update_id)
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

    it('Get Medication Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.medications.length).to.equal(4);
                var total_medications = 0;
                for (var iEntry in res.body.medications) {
                    if (res.body.medications[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.medications[iEntry], null, 10));
                        total_medications++;
                    }
                }
                expect(total_medications).to.equal(1);
                done();
            });
    });

    it('Get Medication Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/medications')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('medications');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(2);
                done();
            });
    });

    it('Get Medication Match Records Post Added', function (done) {
        api.get('/api/v1/matches/medications')
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

describe('Medications API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Medication Match Records Ignored', function (done) {
        api.get('/api/v1/matches/medications')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/medications/' + update_id)
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

    it('Get Medication Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.medications.length).to.equal(4);
                var total_medications = 0;
                for (var iEntry in res.body.medications) {
                    if (res.body.medications[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.medications[iEntry], null, 10));
                        total_medications++;
                    }
                }
                expect(total_medications).to.equal(0);
                done();
            });
    });

    it('Get Medication Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/medications')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('medications');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(2);
                done();
            });
    });

    it('Get Medication Match Records Post Added', function (done) {
        api.get('/api/v1/matches/medications')
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

describe('Medications API - Test Merged Matches', function () {

    var match_id = '';

    var base_id = '';
    var base_object = {};

    var update_id = '';
    var tmp_updated_entry = {
        "administration": {
            "form": {
                "name": "SOLUTION",
                "code": "C42986",
                "code_system_name": "Medication Route FDA",
                "translations": []
            },
            "site": {
                "translations": []
            },
            "route": {
                "translations": []
            }
        },
        "date": [{
            "date": "2012-10-01T00:00:00.000Z",
            "precision": "hour"
        }],
        "identifiers": [{
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.9",
            "identifier_type": "8"
        }, {
            "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.9",
            "identifier_type": "123"
        }],
        "precondition": {
            "value": {
                "translations": []
            },
            "code": {
                "translations": []
            }
        },
        "product": {
            "product": {
                "name": "Cefepime 200 MG/ML",
                "code": "1232",
                "code_system_name": "RXNORM",
                "translations": []
            }
        },
        "status": "Prescribed"
    };

    it('Update Medication Match Records Merged', function (done) {

        api.get('/api/v1/matches/medications')
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
                    api.get('/api/v1/record/medications')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.medications.length; i++) {
                                    if (res.body.medications[i]._id === base_id) {
                                        base_object = res.body.medications[i];
                                    }
                                }
                                api.post('/api/v1/matches/medications/' + update_id + '/0')
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

    it('Get Medication Records', function (done) {
        api.get('/api/v1/record/medications')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.medications.length).to.equal(4);
                var total_medications = 0;
                for (var iEntry in res.body.medications) {
                    if (res.body.medications[iEntry]._id === match_id) {
                        total_medications++;
                    }
                    if (res.body.medications[iEntry]._id === base_id) {

                        //console.log(res.body.medications[iEntry]);
                        //console.log(tmp_updated_entry);

                        //SHIM in empty arrays.
                        if (res.body.medications[iEntry].administration.form === undefined) {
                            res.body.medications[iEntry].administration.form = {};
                        }
                        if (res.body.medications[iEntry].administration.form.translations === undefined) {
                            res.body.medications[iEntry].administration.form.translations = [];
                        }
                        if (res.body.medications[iEntry].administration.site === undefined) {
                            res.body.medications[iEntry].administration.site = {};
                        }
                        if (res.body.medications[iEntry].administration.site.translations === undefined) {
                            res.body.medications[iEntry].administration.site.translations = [];
                        }
                        if (res.body.medications[iEntry].administration.route === undefined) {
                            res.body.medications[iEntry].administration.route = {};
                        }
                        if (res.body.medications[iEntry].administration.route.translations === undefined) {
                            res.body.medications[iEntry].administration.route.translations = [];
                        }
                        if (res.body.medications[iEntry].precondition === undefined) {
                            res.body.medications[iEntry].precondition = {};
                            res.body.medications[iEntry].precondition.value = {};
                            res.body.medications[iEntry].precondition.value.translations = [];
                            res.body.medications[iEntry].precondition.code = {};
                            res.body.medications[iEntry].precondition.code.translations = [];
                        }
                        if (res.body.medications[iEntry].product.product.translations === undefined) {
                            res.body.medications[iEntry].product.product.translations = [];
                        }

                        //Test each component.
                        expect(res.body.medications[iEntry].administration).to.deep.equal(tmp_updated_entry.administration);
                        expect(res.body.medications[iEntry].date).to.deep.equal(tmp_updated_entry.date);
                        expect(res.body.medications[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
                        expect(res.body.medications[iEntry].precondition).to.deep.equal(tmp_updated_entry.precondition);
                        expect(res.body.medications[iEntry].product).to.deep.equal(tmp_updated_entry.product);
                        expect(res.body.medications[iEntry].status).to.deep.equal(tmp_updated_entry.status);
                        //Metadata slightly different test.
                        expect(res.body.medications[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

                    }
                }
                expect(total_medications).to.equal(0);
                done();
            });
    });

    it('Get Medication Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/medications')
            .expect(200)
            .end(function (err, res) {
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
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(2);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Medication Match Records Post Added', function (done) {
        api.get('/api/v1/matches/medications')
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
