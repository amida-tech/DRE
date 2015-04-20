var chai = require('chai');
var expect = chai.expect;
chai.config.includeStack = true;

var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + process.env.DBname || 'tests';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var database = require('mongodb').Db;
var common = require(path.join(__dirname, '../common/common.js'));
var common2 = require('./common.js');

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

// For a note on Penicillin Allergy in Allergies section

describe('Notes API', function () {

    var tmp_note = {
        section: "allergies",
        entry: "54f2421f6dd0f66b43862e82",
        note: "Inconsistent reaction"
    };

    before(function (done) {
        common.loadTestRecord(api, 'bluebutton-01-original.xml', function (err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Notes Endpoint: POST', function (done) {
        api.post('/api/v1/notes/add')
            .send(tmp_note)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    done();
                }
            });
    });

});

describe('Notes API Get All', function () {

    it('Notes Endpoint: GET', function (done) {
        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]._id).to.exist;
                    expect(res.body[0].star).to.equal(false);
                    expect(res.body[0].note).to.equal('Inconsistent reaction');
                    done();
                }
            });
    });

});

describe('Notes API Edit', function () {

    var tmp_edit = {
        id: "",
        note: "Active allergy as a result of most recent appointment"
    };

    before(function (done) {

        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    tmp_edit.id = res.body[0]._id;
                    done();
                }
            });
    });

    it('Notes Endpoint: POST Edit', function (done) {
        api.post('/api/v1/notes/edit')
            .send(tmp_edit)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    done();
                }
            });
    });

    it('Notes Endpoint: GET', function (done) {
        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]._id).to.exist;
                    expect(res.body[0].star).to.equal(false);
                    expect(res.body[0].note).to.equal('Active allergy as a result of most recent appointment');
                    done();
                }
            });
    });

});

describe('Notes API Star', function () {

    var tmp_star = {
        id: "",
        star: true
    };

    before(function (done) {

        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    tmp_star.id = res.body[0]._id;
                    done();
                }
            });
    });

    it('Notes Endpoint: POST Star', function (done) {
        api.post('/api/v1/notes/star')
            .send(tmp_star)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    done();
                }
            });
    });

    it('Notes Endpoint: GET', function (done) {
        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]._id).to.exist;
                    expect(res.body[0].star).to.equal(true);
                    expect(res.body[0].note).to.equal('Active allergy as a result of most recent appointment');
                    done();
                }
            });
    });

});

describe('Notes API Delete', function () {

    var tmp_delete = {
        id: ""
    };

    before(function (done) {

        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    tmp_delete.id = res.body[0]._id;
                    done();
                }
            });
    });

    it('Notes Endpoint: POST Delete', function (done) {
        api.post('/api/v1/notes/delete')
            .send(tmp_delete)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    done();
                }
            });
    });

    it('Notes Endpoint: GET', function (done) {
        api.get('/api/v1/notes/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.length).to.equal(0);
                    expect(res.body[0]).to.not.exist;
                    done();
                }
            });
    });

});
