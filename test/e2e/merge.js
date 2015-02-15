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
var common2 = require('./common.js');
var common = require(path.join(__dirname, '../common/common.js'));

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

describe('Base Merge API:', function () {

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
        'problems': 0,
        'payers': 0,
        'plan_of_care': 0
    };

    it('File Endpoint PUT', function (done) {
        var filepath = path.join(__dirname, '../artifacts/test-r1.0/bluebutton-01-original.xml');
        api.put('/api/v1/storage')
            .attach('file', filepath)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {
                    expect(res.body).to.deep.equal({});
                    done();
                }
            });
    });

    it('Get Merges', function (done) {
        api.get('/api/v1/merges')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                } else {

                    expect(res.body.merges).to.exist;
                    expect(res.body.merges.length).to.equal(26); //was 31 with disabled sections

                    for (var i in res.body.merges) {
                        supportedCount[res.body.merges[i].entry_type] ++;

                        expect(res.body.merges[i].entry).to.exist;
                        expect(res.body.merges[i].entry._id).to.exist;
                        expect(res.body.merges[i].record).to.exist;
                        expect(res.body.merges[i].record._id).to.exist;

                        if (res.body.merges[i].merge_reason === 'duplicate') {
                            console.log(res.body.merges[i]);
                        }
                        //expect(res.body.merges[i].merge_reason).to.equal('new');

                    }

                    //console.log(supportedCount);

                    expect(supportedCount.allergies).to.equal(3);
                    expect(supportedCount.procedures).to.equal(3);
                    expect(supportedCount.medications).to.equal(1);
                    expect(supportedCount.encounters).to.equal(1);
                    expect(supportedCount.vitals).to.equal(6);
                    expect(supportedCount.results).to.equal(1);
                    expect(supportedCount.social_history).to.equal(4);
                    expect(supportedCount.immunizations).to.equal(4);
                    expect(supportedCount.demographics).to.equal(0);
                    expect(supportedCount.problems).to.equal(2);
                    expect(supportedCount.payers).to.equal(1); //was 1
                    expect(supportedCount.plan_of_care).to.equal(0); //was 4
                    done();
                }
            });
    });

});
