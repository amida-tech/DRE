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

    var tmp_med = {
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
        },
        "dose_quantity": {
            "value": "1",
            "unit": null
        },
        "rate_quantity": {
            "value": "90",
            "unit": "ml/min"
        },
        "route": {
            "name": null,
            "code": "C38216",
            "code_system": null,
            "code_system_name": null
        },
        "vehicle": {
            "name": null,
            "code": "412307009",
            "code_system": null,
            "code_system_name": null
        },
        "administration": {
            "name": null,
            "code": "C42944",
            "code_system": null,
            "code_system_name": null
        },
        "prescriber": {
            "organization": "Good Health Clinic",
            "person": null
        }
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

    it('Medications Endpoint: POST', function (done) {
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

});

describe('Medications API Get All', function () {

    it('Medications Endpoint: GET', function (done) {
        api.get('/api/v1/medications/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]._id).to.exist;
                    expect(res.body[0].note).to.equal('Inconsistent reaction');
                    done();
                }
            });
    });

});

describe('Medications API Edit', function () {

    var tmp_edit = {
        id: "",
        note: "Active allergy as a result of most recent appointment"
    };

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

    it('Medications Endpoint: POST Edit', function (done) {
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

    it('Medications Endpoint: GET', function (done) {
        api.get('/api/v1/medications/all')
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

describe('Medications API Delete', function () {

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

    it('Medications Endpoint: POST Delete', function (done) {
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

    it('Medications Endpoint: GET', function (done) {
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
