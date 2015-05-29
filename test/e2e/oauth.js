/// <reference path="../../typings/mocha/mocha.d.ts"/>
'use strict';

var expect = require('chai').expect;
var oauth = require('../../lib/oauth2');
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + process.env.DBname || 'tests';
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
        it("should register a new client", function (done) {
            api.get('/oauth2/cleantest').end(function (err, res) {
                if (err) done(err);
                api.post('/oauth2/register').send(client).expect(200).end(function (err, res) {
                    if (err) return done(err);
                    expect(res.body).have.property('client_id');
                    done();
                });
            });
        });
    });
});