var assert = require("assert");
var request = require('supertest');
var api = request.agent('http://localhost:3000');
var expect = require('chai').expect;
var path = require('path');
// var common = require(path.join(__dirname, '../../../test/common/common.js'));


// describe('Pre Dev Test Cleanup', function (done) {
//     it('Clear DB', function (done) {
//         common.removeClients(function (err, results) {
//             if (err) {
//                 done(err);
//             } else {
//                 done();
//             }
//         });
//     });
// });

describe('authentication', function (done) {
    it('dev should be unauthenticated', function (done) {
        api
            .get('/api/v1/developer/account')
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('should register developer', function (done) {
        api
            .post('/api/v1/developer/register')
            .send({
                'username': 'developer@other-app.com',
                'password': 'asdf'
            })
            // .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('developer should still be unauthenticated', function (done) {
        api
            .get('/api/v1/developer/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('developer should login', function (done) {
        api
            .post('/api/v1/developer/login')
            .send({
                'username': 'developer@other-app.com',
                'password': 'asdf'
            })
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('developer should be authenticated', function (done) {
        api
            .get('/api/v1/developer/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(true);
                done();
            });
    });
    
    it('developer should see client list', function (done) {
        api
            .get('/api/v1/developer/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.length).to.equal(0);
                done();
            });
    });
    
    it('developer adds a new client', function (done) {
        api
            .post('/api/v1/developer/clients/add')
            .send({
                'client_name': 'mochaDevTestClient',
                'token_endpoint_auth_method':'',
                'launch_uri': '',
                'redirect_uri': '',
                'logo_uri': '',
                'owner_email': 'developer@other-app.com',
                'grant_types': '',
                'scope': '',
                'approved': false
            })
            .expect(200)
            .end(function (err, client) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
    
    it('developer should see updated client list', function (done) {
        api
            .get('/api/v1/developer/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.length).to.equal(1);
                expect(res.body[0].name).to.equal('mochaDevTestClient');
                expect(res.body[0]._id).to.exist;
                done();
            });
    });
    
    it('developer deletes new client', function (done) {
        api
            .post('/api/v1/developer/clients/delete')
            .send({
                'client_name': 'mochaDevTestClient'
            })
            .expect(200)
            .end(function (err, client) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
    
    it('developer should see reverted client list', function (done) {
        api
            .get('/api/v1/developer/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.length).to.equal(0);
                done();
            });
    });

    it('developer should logout', function (done) {
        api
            .post('/api/v1/developer/logout')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('developer should be unauthenticated again', function (done) {
        api
            .get('/api/v1/developer/account')
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
