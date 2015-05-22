var assert = require("assert");
var request = require('supertest');
var api = request.agent('http://localhost:3000');
var expect = require('chai').expect;
var common = require('../common/common.js');

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});

describe('authentication', function (done) {
    it('should be unauthenticated', function (done) {
        api
            .get('/api/v1/account')
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('should register', function (done) {
        api
            .post('/api/v1/register')
            .send({
                'username': 'test',
                'password': 'test',

                'middleName': 'Bacon',
                'firstName': 'Kevin',
                'lastName': 'Schmidt',
                //'middleName': 'Isa',
                //'firstName': 'Isabella',
                //'lastName': 'Jones',
                'dob': '10/10/1980',
                'gender': 'Male',
                'email': 'kevin@ba.com'
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('should still be unauthenticated', function (done) {
        api
            .get('/api/v1/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('should login', function (done) {
        common.login(api, 'test', 'test', done);
    });

    it('should be authenticated', function (done) {
        api
            .get('/api/v1/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(true);
                done();
            });
    });

    it('should logout', function (done) {
        api
            .post('/api/v1/logout')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('should be unauthenticated again', function (done) {
        api
            .get('/api/v1/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });
});
