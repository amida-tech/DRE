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
var url = require('url');
var cookieParser = require('cookie-parser');

// test "client" data
var client = {
    "client_name": "Cool SMART App",
    "redirect_uris": [
        "https://srv.me/app/cool"
    ],
    "token_endpoint_auth_method": "none",
    "grant_types": ["authorization_code"],
    "initiate_login_uri": "https://srv.me/app/launch.html",
    "logo_uri": "https://srv.me/img/cool.png",
    "scope": "launch launch/patient launch/encounter patient/*.read user/*.* openid profile"
};
var callback = "https://srv.me/app/cool";
var username = 'test';
var password = 'test';
var client_id;
var client_secret;
var login_uri;
var decide_uri;
var access_params;

describe("OAuth acceptance test (expect that user test/test exists)", function () {
    describe("dynamic client registration", function () {
        it("should register a new confidential client", function (done) {
            // remove test record
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) {
                    done(err);
                }
                var temp = extend({}, client);
                temp.token_endpoint_auth_method = 'client_secret_basic';
                // Register a confident client
                api.post('/oauth2/register').send(temp).expect(200).end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    keys.push('client_secret');
                    expect(res.body).to.have.all.keys(keys);
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
                api.post('/oauth2/register').send(temp).expect(200).end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    keys.push('client_secret');
                    expect(res.body).to.have.all.keys(keys);
                    client_id = res.body.client_id;
                    client_secret = res.body.client_secret;

                    // Attempt to get authorization
                    api.get('/oauth2/authorize?redirect_uri=' + encodeURIComponent(callback + '?client_id=' + client_id) + '&response_type=code&client_id=' + client_id).expect(302).end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        login_uri = res.headers.location;
                        expect(login_uri && (login_uri.indexOf('/oauth2/login') === 0)).to.be.true;
                        var query = url.parse(login_uri, true).query;

                        // Post data to a login form
                        api.post(login_uri).type('form').send({
                            username: username,
                            password: password,
                            redirectUri: query.redirectUri
                        }).expect(302).end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            // Read 'decision' form
                            api.get(res.header.location).expect(200).end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var trans_rege = /input name="transaction_id" type="hidden" value="([^"]+)"/;
                                var transaction_id = trans_rege.exec(res.text)[1];
                                var decide_rge = /<form action="(\/oauth2\/decision)" method="post">/;
                                var decide_uri = decide_rge.exec(res.text)[1];

                                // Post data to a 'decision' form
                                api.post(decide_uri).type('form').send({
                                    transaction_id: transaction_id
                                }).expect(302).end(function (err, res) {
                                    if (err) {
                                        return done(err);
                                    }
                                    expect(res.header.location && res.header.location.indexOf('https://srv.me/app/cool?client_id=' + client_id + '&code=') === 0).to.be.true;
                                    var query = url.parse(res.header.location, true).query;

                                    // Get access & refresh tokens (also some other ....)
                                    api.post('/oauth2/token').type('form').auth(client_id, client_secret).send({
                                        code: query.code,
                                        redirect_uri: client.redirect_uris[0],
                                        client_id: client_id,
                                        client_secret: client_secret,
                                        grant_type: 'authorization_code'
                                    }).expect(302).end(function (err, res) {

                                        access_params = res.body;
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
                                        }).expect(200).end(function (err, res) {

                                            access_params.access_token = res.body.access_token;
                                            access_params.expires_in = res.body.expires_in;

                                            expect(res.body).to.have.property('access_token');
                                            expect(res.body).to.have.property('refresh_token');
                                            expect(res.body).to.have.property('expires_in');
                                            expect(res.body).to.have.property('token_type', 'Bearer');

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

    describe("dynamic client registration", function () {
        it("should register a new public client", function (done) {
            // remove test record
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) {
                    done(err);
                }
                // Register a public client
                api.post('/oauth2/register').send(client).expect(200).end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    var keys = Object.keys(client);
                    keys.push('client_id');
                    expect(res.body).to.have.all.keys(keys);
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
                api.post('/oauth2/register').send(temp).expect(200).end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    //keys.push('client_secret'); // No client sicret since it's a public client
                    client_secret = null; // Drop it if any
                    expect(res.body).to.have.all.keys(keys);
                    client_id = res.body.client_id;

                    // Attempt to get authorization
                    api.get('/oauth2/authorize?redirect_uri=' + encodeURIComponent(callback + '?client_id=' + client_id) + '&response_type=code&client_id=' + client_id).expect(200).end(function (err, res) {
                        console.log(res.body);
                        if (err) {
                            return done(err);
                        }
                        login_uri = res.headers.location;
                        expect(login_uri && (login_uri.indexOf('/oauth2/login') === 0)).to.be.true;
                        var query = url.parse(login_uri, true).query;

                        // Post data to a login form
                        api.post(login_uri).type('form').send({
                            username: username,
                            password: password,
                            redirectUri: query.redirectUri
                        }).expect(302).end(function (err, res) {
                            console.log(res.body);

                            if (err) {
                                return done(err);
                            }

                            // Read 'decision' form
                            api.get(res.header.location).expect(200).end(function (err, res) {
                                if (err) {
                                    return done(err);
                                }
                                var trans_rege = /input name="transaction_id" type="hidden" value="([^"]+)"/;
                                var transaction_id = trans_rege.exec(res.text)[1];
                                var decide_rge = /<form action="(\/oauth2\/decision)" method="post">/;
                                var decide_uri = decide_rge.exec(res.text)[1];

                                // Post data to a 'decision' form
                                api.post(decide_uri).type('form').send({
                                    transaction_id: transaction_id
                                }).expect(302).end(function (err, res) {
                                    if (err) {
                                        return done(err);
                                    }
                                    expect(res.header.location && res.header.location.indexOf('https://srv.me/app/cool?client_id=' + client_id + '&code=') === 0).to.be.true;
                                    var query = url.parse(res.header.location, true).query;

                                    // Get access & refresh tokens (also some other ....)
                                    api.post('/oauth2/token').type('form').auth(client_id, client_secret).send({
                                        code: query.code,
                                        redirect_uri: client.redirect_uris[0],
                                        client_id: client_id,
                                        client_secret: client_secret,
                                        grant_type: 'authorization_code'
                                    }).expect(302).end(function (err, res) {

                                        access_params = res.body;
                                        expect(access_params).to.have.property('access_token');
                                        expect(access_params).not.to.have.property('refresh_token');
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