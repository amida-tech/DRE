var assert = require("assert");
var request = require('supertest');
var api = request.agent('http://localhost:3000');
var expect = require('chai').expect;
var path = require('path');
var common = require(path.join(__dirname, '../../../test/common/common.js'));


describe('Pre Admin Test Cleanup', function (done) {
    it('Clear DB', function (done) {
        common.removeAll(function (err, results) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });
});

describe('authentication', function (done) {
    it('admin should be unauthenticated', function (done) {
        api
            .get('/api/v1/admin/account')
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('should register admin', function (done) {
        api
            .post('/api/v1/admin/register')
            .send({
                'username': 'admin@amida-demo.com',
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

    it('admin should still be unauthenticated', function (done) {
        api
            .get('/api/v1/admin/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(false);
                done();
            });
    });

    it('admin should login', function (done) {
        api
            .post('/api/v1/admin/login')
            .send({
                'username': 'admin@amida-demo.com',
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

    it('admin should be authenticated', function (done) {
        api
            .get('/api/v1/admin/account')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.authenticated).to.equal(true);
                done();
            });
    });
    
    it('admin should see client list', function (done) {
        api
            .get('/api/v1/admin/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.length).to.equal(4);
                done();
            });
    });
    
    it('admin adds a new client', function (done) {
        api
            .post('/api/v1/admin/clients/add')
            .send({
                'client_name': 'mochaTestClient',
                'token_endpoint_auth_method':'',
                'launch_uri': '',
                'redirect_uri': '',
                'logo_uri': '',
                'owner_email': 'admin@amida-demo.com',
                'grant_types': '',
                'scope': '',
                'approved': true
            })
            .expect(200)
            .end(function (err, client) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
    
    it('admin should see updated client list', function (done) {
        api
            .get('/api/v1/admin/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.length).to.equal(5);
                expect(res.body[4].name).to.equal('mochaTestClient');
                expect(res.body[4]._id).to.exist;
                done();
            });
    });
    
    it('admin unapproves new client', function (done) {
       api
            .post('/api/v1/admin/clients/approve')
            .send({
                'client_name': 'mochaTestClient',
                'approval': false
            })
            .expect(200)
            .end(function (err, client) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
        
    it('admin should see unapproved new client in client list', function (done) {
        api
            .get('/api/v1/admin/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body[4].approved).to.equal(false);
                done();
            });
    });
    
    it('admin deletes new client', function (done) {
        api
            .post('/api/v1/admin/clients/delete')
            .send({
                'client_name': 'mochaTestClient'
            })
            .expect(200)
            .end(function (err, client) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
    
    it('admin should see reverted client list', function (done) {
        api
            .get('/api/v1/admin/clients/all')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                expect(res.body.length).to.equal(4);
                done();
            });
    });

    it('admin should logout', function (done) {
        api
            .post('/api/v1/admin/logout')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('admin should be unauthenticated again', function (done) {
        api
            .get('/api/v1/admin/account')
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
