var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var common = require('../../common/common.js');
var common2 = require('../common.js');

function loadTestRecord(fileName, callback) {
    var filepath = path.join(__dirname, '../../artifacts/test-r1.5/' + fileName);
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

    it('Remove Procedure Collections', function (done) {
        common.removeCollection('procedures', function (err) {
            if (err) {
                done(err);
            }
            common.removeCollection('proceduresmerges', function (err) {
                if (err) {
                    done(err);
                }
                common.removeCollection('proceduresmatches', function (err) {
                    if (err) {
                        done(err);
                    }
                    common.removeCollection('storage.files', function (err) {
                        if (err) {
                            done(err);
                        }
                        common.removeCollection('storage.chunks', function (err) {
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

describe('Procedures API - Test New:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Procedure Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.procedures.length).to.equal(3);
                //console.log(JSON.stringify(res.body.procedures, null, 10));
                done();
            });
    });

    it('Get Procedure Match Records', function (done) {
        api.get('/api/v1/matches/procedures')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Procedure Merge Records', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(3);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('procedures');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Procedures API - Test Duplicate:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Procedure Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.procedures, null, 10));
                expect(res.body.procedures.length).to.equal(3);
                done();
            });
    });

    it('Get Procedure Match Records', function (done) {
        api.get('/api/v1/matches/procedures')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Procedure Merge Records', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
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
                    expect(res.body.merges[i].entry_type).to.equal('procedures');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(3);
                expect(dupCnt).to.equal(3);
                done();
            });
    });

});

describe('Procedures API - Test New/Dupe Mix:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-03-updated.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Procedures Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.procedures.length).to.equal(4);
                done();
            });
    });

    it('Get Procedure Match Records', function (done) {
        api.get('/api/v1/matches/procedures')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Procedure Merge Records', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(10);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('procedures');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(6);
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Procedures API - Test Partial Matches:', function () {

    before(function (done) {
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Procedure Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.allergies, null, 10));
                expect(res.body.procedures.length).to.equal(4);
                done();
            });
    });

    it('Get Procedure Merge Records', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(res.body.merges);
                expect(res.body.merges.length).to.equal(11);
                var newCnt = 0;
                var dupCnt = 0;
                for (var i in res.body.merges) {
                    if (res.body.merges[i].merge_reason === 'new') {
                        newCnt++;
                    }
                    if (res.body.merges[i].merge_reason === 'duplicate') {
                        dupCnt++;
                    }
                    expect(res.body.merges[i].entry_type).to.equal('procedures');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(4);
                expect(dupCnt).to.equal(7);
                done();
            });
    });

    it('Get Procedure Match Records', function (done) {
        api.get('/api/v1/matches/procedures')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body.matches, null, 10));
                expect(res.body.matches.length).to.equal(3);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('procedures');
                }
                done();
            });
    });

});

describe('Procedures API - Test Added Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Procedure Match Records', function (done) {

        api.get('/api/v1/matches/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/procedures/' + update_id)
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

    it('Get Procedure Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.procedures.length).to.equal(5);
                var total_procedures = 0;
                for (var iEntry in res.body.procedures) {
                    if (res.body.procedures[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_procedures++;
                    }
                }
                expect(total_procedures).to.equal(1);
                done();
            });
    });

    it('Get Procedure Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('procedures');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(5);
                expect(dupCnt).to.equal(7);
                done();
            });
    });

    it('Get Procedure Match Records Post Added', function (done) {
        api.get('/api/v1/matches/procedures')
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

describe('Procedures API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Procedure Match Records Ignored', function (done) {
        api.get('/api/v1/matches/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/procedures/' + update_id)
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

    it('Get Procedure Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.procedures.length).to.equal(5);
                var total_procedures = 0;
                for (var iEntry in res.body.procedures) {
                    if (res.body.procedures[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_procedures++;
                    }
                }
                expect(total_procedures).to.equal(0);
                done();
            });
    });

    it('Get Procedure Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
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
                    expect(res.body.merges[i].entry_type).to.equal('procedures');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(5);
                expect(dupCnt).to.equal(7);
                done();
            });
    });

    it('Get Procedure Match Records Post Added', function (done) {
        api.get('/api/v1/matches/procedures')
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

describe('Procedures API - Test Merged Matches', function () {

    var match_id = '';

    var base_id = '';
    var base_object = {};

    var update_id = '';
    var tmp_updated_entry = {
        "body_sites": [],
        "procedure": {
            "name": "Colonic knifing",
            "code": "274025005",
            "code_system_name": "SNOMED CT",
            "translations": []
        },
        "date": [{
            "date": "2011-02-03T00:00:00.000Z",
            "precision": "day"
        }],
        "identifiers": [{
            "identifier": "1.2.3.4.5.6.7.8",
            "identifier_type": "1234567"
        }],
        "locations": [{
            "name": "Community Gastroenterology Clinic",
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
                "name": "Gastroenterology Clinic",
                "code": "1118-9",
                "code_system_name": "HealthcareServiceLocation",
                "translations": []
            }
        }],
        "procedure_type": "act",
        "providers": [{
            "organization": {
                "name": "Community Health ",
                "address": {
                    "streetLines": []
                }
            },
            "phone": [{
                "number": "(555)523-555-1234",
                "type": "work place"
            }],
            "address": {
                "city": "Baltimore",
                "state": "MD",
                "zip": "02368",
                "country": "US",
                "streetLines": [
                    "17 Daws Rd."
                ]
            }
        }],
        "status": "Completed"
    };

    it('Update Procedure Match Records Merged', function (done) {

        api.get('/api/v1/matches/procedures')
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
                    api.get('/api/v1/record/procedures')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.procedures.length; i++) {
                                    if (res.body.procedures[i]._id === base_id) {
                                        base_object = res.body.procedures[i];
                                    }
                                }
                                api.post('/api/v1/matches/procedures/' + update_id + '/0')
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

    it('Get Procedure Records', function (done) {
        api.get('/api/v1/record/procedures')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.procedures.length).to.equal(5);
                var total_procedures = 0;
                for (var iEntry in res.body.procedures) {
                    if (res.body.procedures[iEntry]._id === match_id) {
                        total_procedures++;
                    }
                    if (res.body.procedures[iEntry]._id === base_id) {

                        //console.log(JSON.stringify(res.body.procedures[iEntry], null, 10));
                        //console.log(JSON.stringify(tmp_updated_entry, null, 10));

                        //SHIM in empty arrays.
                        if (res.body.procedures[iEntry].body_sites === undefined) {
                            res.body.procedures[iEntry].body_sites = [];
                        }

                        if (res.body.procedures[iEntry].procedure.translations === undefined) {
                            res.body.procedures[iEntry].procedure.translations = [];
                        }

                        for (var iFind in res.body.procedures[iEntry].locations) {
                            if (res.body.procedures[iEntry].locations[iFind].phones === undefined) {
                                res.body.procedures[iEntry].locations[iFind].phones = [];
                            }
                            if (res.body.procedures[iEntry].locations[iFind].loc_type === undefined) {
                                res.body.procedures[iEntry].locations[iFind].loc_type = {};
                            }
                            res.body.procedures[iEntry].locations[iFind].loc_type.translations = [];

                        }

                        for (iFind in res.body.procedures[iEntry].providers) {
                            if (res.body.procedures[iEntry].providers[iFind].organization.address === undefined) {
                                res.body.procedures[iEntry].providers[iFind].organization.address = {};
                                res.body.procedures[iEntry].providers[iFind].organization.address.streetLines = [];
                            }
                        }

                        //Test each component.
                        expect(res.body.procedures[iEntry].body_sites).to.deep.equal(tmp_updated_entry.body_sites);
                        expect(res.body.procedures[iEntry].procedure.code).to.deep.equal(tmp_updated_entry.procedure.code);
                        expect(res.body.procedures[iEntry].procedure.code_system_name).to.deep.equal(tmp_updated_entry.procedure.code_system_name);
                        expect(res.body.procedures[iEntry].date).to.deep.equal(tmp_updated_entry.date);
                        expect(res.body.procedures[iEntry].identifiers).to.deep.equal(tmp_updated_entry.identifiers);
                        expect(res.body.procedures[iEntry].locations).to.deep.equal(tmp_updated_entry.locations);
                        expect(res.body.procedures[iEntry].procedure.name).to.deep.equal(tmp_updated_entry.procedure.name);
                        expect(res.body.procedures[iEntry].procedure_type).to.deep.equal(tmp_updated_entry.procedure_type);
                        expect(res.body.procedures[iEntry].providers).to.deep.equal(tmp_updated_entry.providers);
                        expect(res.body.procedures[iEntry].status).to.deep.equal(tmp_updated_entry.status);
                        expect(res.body.procedures[iEntry].procedure.translations).to.deep.equal(tmp_updated_entry.procedure.translations);

                        //Metadata slightly different test.
                        expect(res.body.procedures[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);

                    }
                }
                expect(total_procedures).to.equal(0);
                done();
            });
    });

    it('Get Procedure Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/procedures')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.merges,null, 10));
                expect(res.body.merges.length).to.equal(13);
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
                expect(dupCnt).to.equal(7);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Procedure Match Records Post Added', function (done) {
        api.get('/api/v1/matches/procedures')
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
