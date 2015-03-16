var chai = require('chai');
var expect = chai.expect;
chai.config.includeStack = true;

var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;
var common = require(path.join(__dirname, '../../common/common.js'));
var common2 = require('../common.js');

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

    it('Login', function (done) {
        common2.register(api, 'test', 'test', function () {
            common2.login(api, 'test', 'test', function () {
                done();
            });
        });
    });
});

describe('Allergies API - Test New:', function () {

    before(function (done) {
        common.loadTestRecord(api, 'bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Allergy Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                //console.log(res.body.allergies);

                expect(res.body.allergies.length).to.equal(3);
                //console.log(JSON.stringify(res.body.allergies, null, 10));
                done();
            });
    });

    it('Get Match Allergy Records', function (done) {
        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Allergy Merge Records', function (done) {
        api.get('/api/v1/merges/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.merges.length).to.equal(3);
                for (var i in res.body.merges) {
                    expect(res.body.merges[i].merge_reason).to.equal('new');
                    expect(res.body.merges[i].entry_type).to.equal('allergies');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });

});

describe('Allergies API - Test Duplicate:', function () {

    before(function (done) {
        common.loadTestRecord(api, 'bluebutton-02-duplicate.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Allergy Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.allergies, null, 10));
                expect(res.body.allergies.length).to.equal(3);
                done();
            });
    });

    it('Get Match Allergy Records', function (done) {
        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Allergy Merge Records', function (done) {
        api.get('/api/v1/merges/allergies')
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
                    expect(res.body.merges[i].entry_type).to.equal('allergies');
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

describe('Allergies API - Test New/Dupe Mix:', function () {

    before(function (done) {
        common.loadTestRecord(api, 'bluebutton-03-updated.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Allergies Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.allergies.length).to.equal(5);
                //console.log(res.body.allergies);
                done();
            });
    });

    it('Get Match Allergy Records', function (done) {
        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.matches.length).to.equal(0);
                done();
            });
    });

    it('Get Allergy Merge Records', function (done) {
        api.get('/api/v1/merges/allergies')
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
                    expect(res.body.merges[i].entry_type).to.equal('allergies');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(5);
                expect(dupCnt).to.equal(6);
                //console.log(JSON.stringify(res.body.merges, null, 10));
                done();
            });
    });
});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Allergies API - Test Partial Matches:', function () {

    before(function (done) {
        common.loadTestRecord(api, 'bluebutton-04-diff-source-partial-matches.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Allergy Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body.allergies, null, 10));
                expect(res.body.allergies.length).to.equal(5);
                done();
            });
    });

    it('Get Allergy Merge Records', function (done) {
        api.get('/api/v1/merges/allergies')
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
                    expect(res.body.merges[i].entry_type).to.equal('allergies');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(5);
                expect(dupCnt).to.equal(6);
                done();
            });
    });

    var exampleMatch;

    it('Get Allergy Match Records', function (done) {
        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body.matches, null, 10));
                expect(res.body.matches.length).to.equal(3);
                for (var i in res.body.matches) {
                    expect(res.body.matches[i].entry.name).to.equal(res.body.matches[i].entry.name);
                    expect(res.body.matches[i].entry_type).to.equal('allergies');
                }
                exampleMatch = res.body.matches[0];
                done();
            });
    });

    it('Get Allergy Single Match Record', function (done) {
        api.get('/api/v1/match/allergies/' + exampleMatch._id)
            .expect(200)
            .end(function (err, res) {
                expect(res.body.entry.name).to.equal(exampleMatch.entry.name);
                expect(res.body.entry.name).to.equal(exampleMatch.entry.name);
                done();
            });
    });
});

// Add new Codeine Entry
describe('Allergies API - Test Added Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Allergy Match Records', function (done) {

        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/allergies/' + update_id)
                        .send({
                            determination: "added"
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

    it('Get Allergy Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.allergies.length).to.equal(6);
                var total_allergies = 0;
                for (var iEntry in res.body.allergies) {
                    if (res.body.allergies[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_allergies++;
                    }
                }
                expect(total_allergies).to.equal(1);
                done();
            });
    });

    it('Get Allergy Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/allergies')
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
                    expect(res.body.merges[i].entry_type).to.equal('allergies');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(6);
                done();
            });
    });

    it('Get Allergy Match Records Post Added', function (done) {
        api.get('/api/v1/matches/allergies')
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

describe('Allergies API - Test Ignored Matches', function () {

    var update_id = '';
    var match_id = '';

    it('Update Allergy Match Records Ignored', function (done) {
        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                } else {
                    update_id = res.body.matches[0]._id;
                    match_id = res.body.matches[0].entry._id;
                    api.post('/api/v1/matches/allergies/' + update_id)
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

    it('Get Allergy Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.allergies.length).to.equal(6);
                var total_allergies = 0;
                for (var iEntry in res.body.allergies) {
                    if (res.body.allergies[iEntry]._id === match_id) {
                        //console.log(JSON.stringify(res.body.allergies[iEntry], null, 10));
                        total_allergies++;
                    }
                }
                expect(total_allergies).to.equal(0);
                done();
            });
    });

    it('Get Allergy Merge Records Post Added', function (done) {
        api.get('/api/v1/merges/allergies')
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
                    expect(res.body.merges[i].entry_type).to.equal('allergies');
                    expect(res.body.merges[i].record).to.exist;
                    expect(res.body.merges[i].record._id).to.exist;
                    expect(res.body.merges[i].entry._id).to.exist;
                }
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(6);
                done();
            });
    });

    it('Get Allergy Match Records Post Added', function (done) {
        api.get('/api/v1/matches/allergies')
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

describe('Allergies API - Test Merged Matches', function () {

    var match_id = '';

    var base_id = '';
    var base_object = {};

    var update_id = '';
    var tmp_updated_entry = {
        "allergen": {
            "name": "ALLERGENIC EXTRACT, PENICILLIN",
            "code": "314422",
            "code_system_name": "RXNORM"
        },
        "date": [{
            "date": "2007-05-01T00:00:00.000Z",
            "precision": "day",
        }],
        "identifiers": [{
            "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
        }],
        "reaction": [{
            "severity": "Mild",
            "name": "Nausea",
            "code": "422587007",
            "code_system_name": "SNOMED CT",
            "translations": []
        }],
        "severity": "Moderate to severe",
        "status": "Inactive",
        "translations": []
    };

    it('Update Allergies Match Records Merged', function (done) {

        api.get('/api/v1/matches/allergies')
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
                    api.get('/api/v1/record/allergies')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                done(err);
                            } else {
                                for (var i = 0; i < res.body.allergies.length; i++) {
                                    if (res.body.allergies[i]._id === base_id) {
                                        base_object = res.body.allergies[i];
                                    }
                                }
                                api.post('/api/v1/matches/allergies/' + update_id + '/0')
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

    it('Get Allergy Records', function (done) {
        api.get('/api/v1/record/allergies')
            .expect(200)
            .end(function (err, res) {
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.allergies.length).to.equal(6);
                var total_allergies = 0;
                for (var iEntry in res.body.allergies) {
                    if (res.body.allergies[iEntry]._id === match_id) {
                        total_allergies++;
                    }
                    if (res.body.allergies[iEntry]._id === base_id) {

                        //SHIM in empty translation objects.
                        if (res.body.allergies[iEntry].translations === undefined) {
                            res.body.allergies[iEntry].translations = [];
                        }

                        for (var iReaction in res.body.allergies[iEntry].reactions) {
                            if (res.body.allergies[iEntry].reactions[iReaction].translations === undefined) {
                                res.body.allergies[iEntry].reactions[iReaction].translations = [];
                            }
                        }

                        //Test each component.
                        expect(res.body.allergies[iEntry].allergen.code).to.equal(tmp_updated_entry.allergen.code);
                        expect(res.body.allergies[iEntry].allergen.code_system_name).to.equal(tmp_updated_entry.allergen.code_system_name);
                        expect(res.body.allergies[iEntry].date[0]).to.deep.equal(tmp_updated_entry.date[0]);
                        expect(res.body.allergies[iEntry].identifiers[0]).to.deep.equal(tmp_updated_entry.identifiers[0]);
                        expect(res.body.allergies[iEntry].allergen.name).to.equal(tmp_updated_entry.allergen.name);
                        expect(res.body.allergies[iEntry].severity).to.equal(tmp_updated_entry.severity);
                        expect(res.body.allergies[iEntry].reactions).to.equal(tmp_updated_entry.reactions);
                        expect(res.body.allergies[iEntry].status).to.equal(tmp_updated_entry.status);
                        expect(res.body.allergies[iEntry].allergen.translations).to.deep.equal(tmp_updated_entry.allergen.translations);

                        //Metadata slightly different test.
                        expect(res.body.allergies[iEntry].metadata.attribution.length).to.equal(base_object.metadata.attribution.length + 1);
                    }
                }
                expect(total_allergies).to.equal(0);
                done();
            });
    });

    it('Get Allergy Merge Records Post Merged', function (done) {
        api.get('/api/v1/merges/allergies')
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
                expect(newCnt).to.equal(6);
                expect(dupCnt).to.equal(6);
                expect(mrgCnt).to.equal(1);
                done();
            });
    });

    it('Get Allergy Match Records Post Added', function (done) {
        api.get('/api/v1/matches/allergies')
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
