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

describe('Pre Test Cleanup 1', function () {

    it('Remove Notes Collections', function (done) {
        removeCollection('notes', function (err) {
            if (err) {
                done(err);
            }
        });
    });
});

describe('Notes API', function () {
    var sampleNote = '';

    before(function (done) {
        common.register(api, 'test', 'test', function () {
            common.login(api, 'test', 'test', function () {
                done();
            });
        });
    });

    it('Notes Endpoint POST', function (done) {
        var note = req.body;
        api.post('/api/v1/notes/add')
        .send({
        	determination: "added"
        })
        .expect(200)
        .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body).to.deep.equal({note});
                    done();
                }
            });
    });

});

describe('Notes API Get All Notes', function () {

    it('Notes Endpoint GET', function (done) {
        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.notes).to.exist;
                    expect(res.body.notes.length).to.equal(1);
                    expect(res.body.notes[0].section).to.equal('allergies');
                    expect(res.body.notes[0].note).to.equal('note string');
                    expect(res.body.notes[0].star).to.equal(false);
                    done();
                }
            });
    });
});
