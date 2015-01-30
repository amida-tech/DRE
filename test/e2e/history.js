var supertest = require('supertest');
//var api = supertest.agent('http://localhost:3000');
//Local db used for testing
var api = supertest.agent('http://localhost:3000');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));
var database = require('mongodb').Db;

var path = require('path');
var common2 = require('./common.js');
var common = require(path.join(__dirname, '../common/common.js'));

var record = require('blue-button-record');

describe('Pre Test Cleanup', function() {

    before(function(done) {
        var options = {
            dbName: 'dre',
            supported_sections: ['allergies', 'procedures']
        };

        dbinfo = record.connectDatabase('localhost', options, function(err) {
            //assert.ifError(err);
            if (err) {
                console.log(">>>> ", err)
            };

            record.clearDatabase(function(err) {
                done(err);
            });


        });

    });

    it('Clean Database', function(done) {
        common.removeAll(function(err, results) {
            if (err) {
                console.log('Error in remove all');
                done(err);
            } else {
                done();
            }
        });
    });


    it('add account history - loggedIn', function(done) {
        //record.
        record.saveEvent("loggedIn", "test", "note", "file", function() {

            record.getRecentLogin(function(err, data) {
                //console.log("recent login: ", data);

                expect(data.time).to.exist;
                expect(data._id).to.exist;
                expect(data.event_type).to.exist;
                expect(data.event_type).to.be.equal('loggedIn');

                done();

            });
        });

    });

    it('add account history - fileUploaded', function(done) {
        //record.
        record.saveEvent("fileUploaded", "test", "note", "file", function() {

            record.getRecentUpdate(function(err, data) {
                //console.log("recent login: ", data);

                expect(data.time).to.exist;
                expect(data._id).to.exist;
                expect(data.event_type).to.exist;
                expect(data.event_type).to.be.equal('fileUploaded');

                done();

            });
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

describe('Account History - basic', function() {

    it('Clean Database', function(done) {
        common.removeAll(function(err, results) {
            if (err) {
                console.log('Error in remove all');
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


    it('Shows Full Event History', function(done) {
        api.get('/api/v1/account_history/all')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                    done();
                } else {
                    expect(res.body).to.have.length(6);
                    (res.body).should.all.have.property('userID', 'test');
                    (res.body).should.include.something.with.property('event_type', 'initAccount');
                    (res.body).should.include.something.with.property('event_type', 'loggedIn');
                    (res.body).should.include.something.with.property('event_type', 'fileUploaded');
                    done();
                }
            });
    });
});

describe('Account History - recent for UI', function() {

    it('Returns last login', function(done) {
        api.get('/api/v1/account_history/mostRecent')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                    done();
                } else {
                    console.log(res.body);
                    //expect(res.body).to.have.property('login');
                    //console.log(res.body);
                    expect(res.body.update).to.have.deep.property('userID', 'test');
                    expect(res.body.login).to.have.deep.property('event_type', 'loggedIn');
                    done();
                }
            });
    });

    it('Returns last MHR update via file upload', function(done) {
        api.get('/api/v1/account_history/mostRecent')
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                    done();
                } else {
                    //console.log(res.body);
                    expect(res.body).to.have.property('update');
                    expect(res.body.update).to.have.deep.property('userID', 'test');
                    expect(res.body.update).to.have.deep.property('event_type', 'fileUploaded');
                    expect(res.body.update).to.have.property('time');
                    done();
                }
            });
    });
});

describe('clear entire database', function() {
    it('clearDatabase', function(done) {
        record.clearDatabase(function(err) {
            done(err);
        });
    });

    after(function(done) {
        record.disconnect(function(err) {
            done(err);
        });
    });

});
