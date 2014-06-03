"use strict";

var chai = require('chai');
var util = require('util')
var path = require('path');
var async = require('async');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');

var refModel = require('./refModel')

var expect = chai.expect;
var assert = chai.assert;

describe('partial methods', function() {
    var dbinfo = null;

    before(function(done) {
        var options = refModel.geConnectionOptions('partialtest');
        db.connect('localhost', options, function(err, result) {
            if (err) {
                done(err);
            } else {
                dbinfo = result;
                done();
            }
        });
    });

    after(function(done) {
        dbinfo.db.dropDatabase();
        done();
    });
});
