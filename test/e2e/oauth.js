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

describe("OAuth acceptance test", function () {
    describe("dynamic client registration", function () {
        it("should register a new public client", function (done) {
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) done(err);
                api.post('/oauth2/register').send(client).expect(200).end(function (err, res) {
                    if (err) return done(err);
                    var keys = Object.keys(client);
                    keys.push('client_id');
                    expect(res.body).to.have.all.keys(keys);
                    done();
                });
            });
        });
        it("should register a new confidential client", function (done) {
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) done(err);
                var temp = extend({}, client);
                temp.token_endpoint_auth_method = 'client_secret_basic';
                api.post('/oauth2/register').send(temp).expect(200).end(function (err, res) {
                    if (err) return done(err);
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    keys.push('client_secret');
                    expect(res.body).to.have.all.keys(keys);
                    done();
                });
            });
        });
/*        it("should login with new id and secred", function (done) {
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) done(err);
                var temp = extend({}, client);
                temp.token_endpoint_auth_method = 'client_secret_basic';
                api.post('/oauth2/register').send(temp).expect(200).end(function (err, res) {
                    if (err) return done(err);
                    var keys = Object.keys(temp);
                    keys.push('client_id');
                    keys.push('client_secret');
                    expect(res.body).to.have.all.keys(keys);
                    api.get('/oauth2/register').auth(res.body.client_id, res.body.cleint_secret).expect(200).end(function (err, res) {
                        if (err) return done(err);
                        var keys = Object.keys(temp);
                        keys.push('client_id');
                        keys.push('client_secret');
                        expect(res.body).to.have.all.keys(keys);
                        done();
                    });
                });
            });
        });*/
    });
});