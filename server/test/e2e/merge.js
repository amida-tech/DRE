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
var common = require('./common.js');


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

function loadTestRecord(api, fileName, callback) {
    console.log("loading files to storage");
    var filepath = path.join(__dirname, '../artifacts/test-r1.0/' + fileName);
    api.put('/api/v1/storage')
        .attach('file', filepath)
    //.expect(200)
    .end(function(err, res) {
        if (err) {
            console.log(err);
            callback(err);
        }
        callback();
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
        problems: 'problems'
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

        var e = function(err) {
            checkLoopComplete();
        };
        for (iComponent in supportedComponents) {
            removeSections(supportedComponents[iComponent], iComponent, e);
        }

    });

});

describe('Base Merge API:', function() {

    var supportedCount = {
        'allergies': 0,
        'procedures': 0,
        'medications': 0,
        'encounters': 0,
        'vitals': 0,
        'results': 0,
        'social_history': 0,
        'immunizations': 0,
        'demographics': 0,
        'problems': 0
    };



    before(function(done) {
        common.register(api, 'test', 'test', function() {
            common.login(api, 'test', 'test', function() {
                //loadTestRecord(api, 'bluebutton-01-original.xml', done);
                done();
            });
        });
    });

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

    it('Get Merges', function(done) {
        api.get('/api/v1/merges')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.merges).to.exist;
                    expect(res.body.merges.length).to.equal(26);

                    for (var i in res.body.merges) {
                        supportedCount[res.body.merges[i].entry_type]++;

                        expect(res.body.merges[i].entry).to.exist;
                        expect(res.body.merges[i].entry._id).to.exist;
                        expect(res.body.merges[i].record).to.exist;
                        expect(res.body.merges[i].record._id).to.exist;
                        expect(res.body.merges[i].merge_reason).to.equal('new');

                    }

                    expect(supportedCount.allergies).to.equal(3);
                    expect(supportedCount.procedures).to.equal(3);
                    expect(supportedCount.medications).to.equal(1);
                    expect(supportedCount.encounters).to.equal(1);
                    expect(supportedCount.vitals).to.equal(6);
                    expect(supportedCount.results).to.equal(1);
                    expect(supportedCount.social_history).to.equal(4);
                    expect(supportedCount.immunizations).to.equal(4);
                    expect(supportedCount.demographics).to.equal(1);
                    expect(supportedCount.problems).to.equal(2);
                    done();
                }
            });
    });

});
