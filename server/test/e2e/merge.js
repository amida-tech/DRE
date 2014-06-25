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
    allergies: 'allergy',
    procedures: 'procedure',
    medications: 'medication',
    encounters: 'encounter',
    vitals: 'vital',
    results: 'result',
    social_histories: 'social',
    immunizations: 'immunization',
    demographics: 'demographic',
    problems: 'problem'
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
    'allergy': 0,
    'procedure': 0,
    'medication': 0,
    'encounter': 0,
    'vital': 0,
    'result': 0,
    'social': 0,
    'immunization': 0,
    'demographic': 0,
    'problem': 0
  };

  before(function(done) {
    loadTestRecord('bluebutton-01-original.xml', function(err) {
      if (err) {
        done(err);
      } else {
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
          expect(res.body.merges.length).to.equal(23);

          for (var i in res.body.merges) {
            supportedCount[res.body.merges[i].entry_type]++;

            expect(res.body.merges[i].patKey).to.exist;
            expect(res.body.merges[i].entry_id).to.exist;
            expect(res.body.merges[i].entry_id._id).to.exist;
            expect(res.body.merges[i].record_id).to.exist;
            expect(res.body.merges[i].record_id._id).to.exist;
            expect(res.body.merges[i].merge_reason).to.equal('new');

          }

          expect(supportedCount.allergy).to.equal(3);
          expect(supportedCount.procedure).to.equal(3);
          expect(supportedCount.medication).to.equal(1);
          expect(supportedCount.encounter).to.equal(1);
          expect(supportedCount.vital).to.equal(6);
          expect(supportedCount.result).to.equal(1);
          expect(supportedCount.social).to.equal(1);
          expect(supportedCount.immunization).to.equal(4);
          expect(supportedCount.demographic).to.equal(1);
          expect(supportedCount.problem).to.equal(2);
          done();
        }
      });
  });

});