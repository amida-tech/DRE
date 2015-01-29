var expect = require('chai').expect;
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
        socialhistories: 'social_history',
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


describe('Storage API', function() {
    var sampleFile = '';

    before(function(done) {
        common.register(api, 'test', 'testtest', function() {
            common.login(api, 'test', 'testtest', function() {
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

});

describe('Storage API Get List', function() {

    it('File Endpoint GET', function(done) {
        api.get('/api/v1/storage')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    console.log(res.body.storage);
                    expect(res.body.storage).to.exist;
                    expect(res.body.storage.length).to.equal(1);
                    expect(res.body.storage[0].file_name).to.equal('bluebutton-01-original.xml');
                    expect(res.body.storage[0].file_mime_type).to.equal('application/xml');
                    expect(res.body.storage[0].file_class).to.equal('ccda');
                    done();
                }
            });
    });

    it('Download File GET', function(done) {
        api.get('/api/v1/storage')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                } else {
                    api.get('/api/v1/storage/record/' + res.body.storage[0].file_id)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                return done(err);
                            } else {
                                expect(res.text.length).to.equal(129070);
                                expect(res.buffered).to.equal(true);
                                done();
                            }
                        });
                }
            });
    });

});
