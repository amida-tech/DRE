/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/mocha/mocha.d.ts"/>
/// <reference path="../../typings/supertest/supertest.d.ts""/>
/// <reference path="../../typings/superagent/superagent.d.ts"/>
'use strict';

var expect = require('chai').expect;
var oauth = require('../../lib/oauth2');
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + process.env.DBname || 'tests';
var extend = require('util')._extend;
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');
var url = require('url');
var cookieParser = require('cookie-parser');
var common = require(path.join(__dirname, '../common/common.js'));

// test "client" data
var client = {
    "client_name": "Cool SMART App",
    "redirect_uris": [
        "https://srv.me/app/cool",
        "https://srv.me/app/cool2"
    ],
    "token_endpoint_auth_method": "none",
    "grant_types": ["authorization_code"],
    "initiate_login_uri": "https://srv.me/app/launch.html",
    "logo_uri": "https://srv.me/img/cool.png",
    "scope": "launch launch/patient launch/encounter patient/*.read user/*.* openid profile",
    "state": "nonsence"
};
var callback = "https://srv.me/app/cool";
var username = 'test';
var password = 'test';

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
        common.register(api, 'test', 'test', function () {
            common.login(api, 'test', 'test', function () {
                done();
            });
        });
    });
});

describe("OAuth acceptance test (expect that user test/test exists and DRE is running on a port 3000)", function () {
    describe("dynamic confidential client registration", function () {
        it("should register a new client", function (done) {
            // remove test record
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) {
                    done(err);
                }
                var temp = extend({}, client);
                temp.token_endpoint_auth_method = 'client_secret_basic';
                // Register a confident client
                api.post('/oauth2/register').send(temp).expect(200).end(function (err2, res2) {
                    if (err2) {
                        return done(err2);
                    }
                    var keys = Object.keys(temp);
                    console.log(keys, res2.body);
                    keys.push('client_id');
                    keys.push('client_secret');
                    for (var i = 0; i < keys.length; i++) {
                        expect(res2.body).to.have.property(keys[i]);
                    }
                    done();
                });
            });
        });

        it("should login with new id and secret", function (done) {

            // remove test record
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) {
                    done(err);
                }
                var temp = extend({}, client);
                temp.token_endpoint_auth_method = 'client_secret_basic';

                // Make a dynamic registration request
                api.post('/oauth2/register').send(temp).expect(200).end(function (err2, res2) {
                    if (err2) {
                        return done(err2);
                    }
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    keys.push('client_secret');
                    for (var i = 0; i < keys.length; i++) {
                        expect(res2.body).to.have.property(keys[i]);
                    }

                    var client_id = res2.body.client_id;
                    var client_secret = res2.body.client_secret;

                    // Attempt to get authorization
                    api.get('/oauth2/authorize?redirect_uri=' + encodeURIComponent(callback + '?client_id=' + client_id) + '&response_type=code&client_id=' + client_id).expect(302).end(function (err3, res3) {
                        if (err3) {
                            return done(err3);
                        }
                        var login_uri = res3.headers.location;
                        expect(login_uri && (login_uri.indexOf('/oauth2/login') === 0)).to.be.true;
                        var query = url.parse(login_uri, true).query;

                        // Post data to a login form
                        api.post(login_uri).type('form').send({
                            username: username,
                            password: password,
                            redirectUri: query.redirectUri
                        }).expect(302).end(function (err4, res4) {
                            if (err4) {
                                return done(err4);
                            }
                            // Read 'decision' form
                            api.get(res4.header.location).expect(200).end(function (err5, res5) {
                                if (err5) {
                                    return done(err5);
                                }
                                var trans_rege = /input name="transaction_id" type="hidden" value="([^"]+)"/;
                                var transaction_id = trans_rege.exec(res5.text)[1];
                                var decide_rge = /<form action="(\/oauth2\/decision)" method="post">/;
                                var decide_uri = decide_rge.exec(res5.text)[1];

                                // Post data to a 'decision' form
                                api.post(decide_uri).type('form').send({
                                    transaction_id: transaction_id
                                }).expect(302).end(function (err6, res6) {

                                    if (err6) {
                                        return done(err6);
                                    }
                                    expect(res6.header.location && res6.header.location.indexOf('https://srv.me/app/cool?client_id=' + client_id + '&code=') === 0).to.be.true;
                                    var query = url.parse(res6.header.location, true).query;
                                    // Get access & refresh tokens (also some other ....)
                                    api.post('/oauth2/token').type('form').auth(client_id, client_secret).send({
                                        code: query.code,
                                        redirect_uri: (callback + '?client_id=' + client_id),
                                        client_id: client_id,
                                        client_secret: client_secret,
                                        grant_type: 'authorization_code'
                                    }).expect(302).end(function (err7, res7) {

                                        var access_params = res7.body;
                                        expect(access_params).to.have.property('access_token');
                                        expect(access_params).to.have.property('refresh_token');
                                        expect(access_params).to.have.property('expires_in');
                                        expect(access_params).to.have.property('patient');
                                        expect(access_params).to.have.property('token_type', 'Bearer');

                                        // Test token refresh
                                        api.post('/oauth2/refresh').type('form').auth(client_id, client_secret).send({
                                            refresh_token: access_params.refresh_token,
                                            client_id: client_id,
                                            grant_type: 'refresh_token'
                                        }).expect(200).end(function (err8, res8) {

                                            //access_params.access_token = res8.body.access_token;
                                            //access_params.expires_in = res8.body.expires_in;
                                            expect(res8.body).to.have.property('access_token');
                                            expect(res8.body).to.have.property('refresh_token');
                                            expect(res8.body).to.have.property('expires_in');
                                            expect(res8.body).to.have.property('token_type', 'Bearer');

                                            expect(res8.body.access_token).is.not.equal(access_params.access_token);
                                            expect(res8.body.refresh_token).is.equal(access_params.refresh_token);

                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe("dynamic public client registration", function () {
        it("should register a new client", function (done) {

            // remove test record
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) {
                    done(err);
                }

                // Register a public client
                api.post('/oauth2/register').send(client).expect(200).end(function (err2, res2) {
                    if (err2) {
                        return done(err2);
                    }
                    var keys = Object.keys(client);
                    keys.push('client_id');
                    for (var i = 0; i < keys.length; i++) {
                        expect(res2.body).to.have.property(keys[i]);
                    }

                    done();
                });
            });
        });

        it("should login with new id", function (done) {

            // remove test record
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) {
                    done(err);
                }
                var temp = extend({}, client);
                temp.token_endpoint_auth_method = 'none';

                // Make a dynamic registration request
                api.post('/oauth2/register').send(temp).expect(200).end(function (err2, res2) {
                    if (err2) {
                        return done(err2);
                    }
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    //keys.push('client_secret'); // No client sicret since it's a public client
                    expect(res2.body).not.to.have.property('client_secret');
                    for (var i = 0; i < keys.length; i++) {
                        expect(res2.body).to.have.property(keys[i]);
                    }

                    var client_id = res2.body.client_id;

                    // Attempt to get authorization
                    api.get('/oauth2/authorize?redirect_uri=' + encodeURIComponent(callback + '?client_id=' + client_id) + '&response_type=code&client_id=' + client_id).expect(302).end(function (err3, res3) {
                        if (err3) {
                            return done(err3);
                        }
                        var login_uri = res3.headers.location;
                        expect(login_uri && (login_uri.indexOf('/oauth2/login') === 0)).to.be.true;
                        var query = url.parse(login_uri, true).query;

                        // Post data to a login form
                        api.post(login_uri).type('form').send({
                            username: username,
                            password: password,
                            redirectUri: query.redirectUri
                        }).expect(302).end(function (err4, res4) {
                            if (err4) {
                                return done(err4);
                            }

                            // Read 'decision' form
                            api.get(res4.header.location).expect(200).end(function (err5, res5) {
                                if (err5) {
                                    return done(err5);
                                }
                                var trans_rege = /input name="transaction_id" type="hidden" value="([^"]+)"/;
                                var transaction_id = trans_rege.exec(res5.text)[1];
                                var decide_rge = /<form action="(\/oauth2\/decision)" method="post">/;
                                var decide_uri = decide_rge.exec(res5.text)[1];

                                // Post data to a 'decision' form
                                api.post(decide_uri).type('form').send({
                                    transaction_id: transaction_id
                                }).expect(302).end(function (err6, res6) {

                                    if (err6) {
                                        return done(err6);
                                    }
                                    expect(res6.header.location && res6.header.location.indexOf('https://srv.me/app/cool?client_id=' + client_id + '&code=') === 0).to.be.true;
                                    var query = url.parse(res6.header.location, true).query;

                                    // Get access & refresh tokens (also some other ....)
                                    api.post('/oauth2/token').type('form').auth(client_id, null).send({
                                        code: query.code,
                                        redirect_uri: (callback + '?client_id=' + client_id),
                                        client_id: client_id,
                                        grant_type: 'authorization_code'
                                    }).expect(302).end(function (err7, res7) {

                                        var access_params = res7.body;
                                        expect(access_params).to.have.property('access_token');
                                        expect(access_params).to.have.property('refresh_token');
                                        expect(access_params).to.have.property('expires_in');
                                        expect(access_params).to.have.property('patient');
                                        expect(access_params).to.have.property('token_type', 'Bearer');
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
