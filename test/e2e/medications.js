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

describe('Medications API', function () {

    var data = {
        "date_range": {
            "start": "2011-03-01T05:00:00Z",
            "end": "2012-03-01T05:00:00Z"
        },
        "product": {
            "name": "Test med",
            "code": "329498",
            "code_system": null,
            "translation": {
                "name": null,
                "code": "573621",
                "code_system": null,
                "code_system_name": null
            }
        }
    };
    var tmp_med = {
        'data': data
    }

    it('Add (POST)', function (done) {
        api.post('/api/v1/medications/add')
            .send(tmp_med)
            .expect(200)
            .end(function (err, res) {
            if (err) {
                return done(err);
            } else {
                done();
            }
        });
    });





    it('GET all', function (done) {
        api.get('/api/v1/medications/all')
            .expect(200)
            .end(function (err, res) {
            if (err) {
                return done(err);
            } else {
                expect(res.body.length).to.equal(1);
                expect(res.body[0]._id).to.exist;
                expect(res.body[0].data.product.name).to.equal('Test med');
                done();
            }
        });
    });



    describe('Edit', function () {

        var data = {
            "date_range": {
                "start": "2011-03-01T05:00:00Z",
                "end": "2012-03-01T05:00:00Z"
            },
            "product": {
                "name": "Test med edited",
                "code": "329498",
                "code_system": null,
                "translation": {
                    "name": null,
                    "code": "573621",
                    "code_system": null,
                    "code_system_name": null
                }
            }
        };
        var tmp_edit = {
            'data': data
        }

        before(function (done) {

            api.get('/api/v1/medications/all')
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

        it('POST', function (done) {
            api.post('/api/v1/medications/edit')
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

        it('GET all', function (done) {
            api.get('/api/v1/medications/all')
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]._id).to.exist;
                    expect(res.body[0].data.product.name).to.equal('Test med edited');
                    done();
                }
            });
        });

    });

    describe('Delete', function () {

        var tmp_delete = {
            id: ""
        };

        before(function (done) {

            api.get('/api/v1/medications/all')
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

        it('POST', function (done) {
            api.post('/api/v1/medications/delete')
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

        it('GET all', function (done) {
            api.get('/api/v1/medications/all')
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

});
