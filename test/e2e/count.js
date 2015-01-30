var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;
var common2 = require('./common.js');
var common = require(path.join(__dirname, '../common/common.js'));


describe('Pre Test Cleanup', function() {

    it('Clean Database', function(done) {
        common.removeAll(function(err, results) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Login', function(done) {
        common2.register(api, 'test', 'test', function() {
            common2.login(api, 'test', 'test', function() {
                done();
            });
        });
    });
});


describe('Count API - Test New:', function() {

    it('File Endpoint PUT', function(done) {
        var filepath = path.join(__dirname, '../artifacts/test-r1.0/bluebutton-01-original.xml');
        api.put('/api/v1/storage')
            .attach('file', filepath)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body).to.deep.equal({});
                    done();
                }
            });
    });

    it('Get Count Records', function(done) {
        api.get('/api/v1/notification')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }     


                expect(res.body.notifications.unreviewed_merges).to.equal(1);
                expect(res.body.notifications.new_merges).to.equal(26);
                expect(res.body.notifications.duplicate_merges).to.equal(0);
                expect(res.body.notifications.file_count).to.equal(1);
                //console.log(JSON.stringify(res.body, null, 10));

                done();
            });
    });


});

describe('Count API - Test Duplicate:', function() {

    before(function(done) {
        common.loadTestRecord(api, 'bluebutton-02-duplicate.xml', function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Count Records', function(done) {
        api.get('/api/v1/notification')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                //console.log(JSON.stringify(res.body, null, 10));
                expect(res.body.notifications.unreviewed_merges).to.equal(2);
                expect(res.body.notifications.new_merges).to.equal(26);
                expect(res.body.notifications.duplicate_merges).to.equal(26);
                expect(res.body.notifications.file_count).to.equal(2);
                done();
            });
    });


});

describe('Count API - Test New/Dupe Mix:', function() {

    before(function(done) {
        common.loadTestRecord(api, 'bluebutton-03-updated.xml', function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Count Records', function(done) {
        api.get('/api/v1/notification')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.notifications.unreviewed_merges).to.equal(3);
                expect(res.body.notifications.new_merges).to.equal(47);
                expect(res.body.notifications.duplicate_merges).to.equal(51);
                expect(res.body.notifications.file_count).to.equal(3);
                done();
            });
    });

});

//Modified severity on 2nd and 3rd allergy.  Changed Nausea to Hives on first allergy.
describe('Count API - Test Partial Matches:', function() {

    before(function(done) {
        common.loadTestRecord(api, 'bluebutton-04-diff-source-partial-matches.xml', function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Get Count Records', function(done) {
        api.get('/api/v1/notification')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.notifications.unreviewed_merges).to.equal(32);
                expect(res.body.notifications.new_merges).to.equal(47);
                expect(res.body.notifications.duplicate_merges).to.equal(67);
                expect(res.body.notifications.file_count).to.equal(4);
                done();
            });
    });

});

describe('Count API - Test Added Matches via Allergies', function() {

    var update_id = '';
    var match_id = '';

    it('Update Allergy Match Records', function(done) {

        api.get('/api/v1/matches/allergies')
            .expect(200)
            .end(function(err, res) {
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

    it('Get Count Records', function(done) {
        api.get('/api/v1/notification')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.notifications.unreviewed_merges).to.equal(31);
                expect(res.body.notifications.new_merges).to.equal(48);
                expect(res.body.notifications.duplicate_merges).to.equal(67);
                expect(res.body.notifications.file_count).to.equal(4);
                done();
            });
    });

});

