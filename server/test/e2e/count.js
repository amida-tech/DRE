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
    var filepath = path.join(__dirname, '../artifacts/test-r1.0/' + fileName);
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

describe('Pre Test Cleanup 1', function() {

    it('Remove File Collections', function(done) {
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

describe('Pre Test Cleanup 2', function() {

    var supportedComponents = {
        allergies: 'allergies',
        procedures: 'procedures',
        medications: 'medications',
        encounters: 'encounters',
        vitals: 'vitals',
        results: 'results',
        social_histories: 'social_history',
        immunizations: 'immunizations',
        demographics: 'demographics',
        problems: 'problems',
        claims: 'claims',
        insurance: 'insurance'

    };

    it('Remove All Collections', function(done) {

        var secIteration = 0;
        var secTotal = 0;

        for (var iComponent in supportedComponents) {
            secTotal++;
        }

        function checkLoopComplete() {
            secIteration++;
            if (secIteration === secTotal) {
                done();
            }
        }

        function removeSections(componentSingular, componentPlural, callback) {
            removeCollection(componentPlural, function(err) {
                if (err) {
                    done(err);
                }
                removeCollection(componentSingular + 'merges', function(err) {
                    if (err) {
                        console.log(err);
                        done(err);
                    }
                    removeCollection(componentSingular + 'matches', function(err) {
                        if (err) {
                            done(err);
                        }
                        callback();
                    });
                });
            });
        }

        var e=function(err){checkLoopComplete();};
        for (iComponent in supportedComponents) {
            removeSections(supportedComponents[iComponent], iComponent, e);
        }

    });

});



describe('Count API - Test New:', function() {

    before(function(done) {
        loadTestRecord('bluebutton-01-original.xml', function(err) {
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
                expect(res.body.notifications.unreviewed_merges).to.equal(0);
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
        loadTestRecord('bluebutton-02-duplicate.xml', function(err) {
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
                expect(res.body.notifications.unreviewed_merges).to.equal(0);
                expect(res.body.notifications.new_merges).to.equal(26);
                expect(res.body.notifications.duplicate_merges).to.equal(4);
                expect(res.body.notifications.file_count).to.equal(2);
                done();
            });
    });


});

describe('Count API - Test New/Dupe Mix:', function() {

    before(function(done) {
        loadTestRecord('bluebutton-03-updated.xml', function(err) {
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
                expect(res.body.notifications.unreviewed_merges).to.equal(0);
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
        loadTestRecord('bluebutton-04-diff-source-partial-matches.xml', function(err) {
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
                expect(res.body.notifications.unreviewed_merges).to.equal(29);
                expect(res.body.notifications.new_merges).to.equal(47);
                expect(res.body.notifications.duplicate_merges).to.equal(66);
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
                expect(res.body.notifications.unreviewed_merges).to.equal(28);
                expect(res.body.notifications.new_merges).to.equal(48);
                expect(res.body.notifications.duplicate_merges).to.equal(66);
                expect(res.body.notifications.file_count).to.equal(4);
                done();
            });
    });

});
