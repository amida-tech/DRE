var chai = require('chai');
var util = require('util');
var path = require('path');
var bb = require('blue-button');
var fs = require('fs');

var record = require('../../lib/recordjs');

var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');
var db = require('../../lib/recordjs/db');
var jsutil = require('../../lib/recordjs/jsutil');
var modelutil = require('../../lib/recordjs/modelutil');

var expect = chai.expect;
var assert = chai.assert;

describe('modelutil.js', function() {
    it('empty array/inside object/inside object', function(done) {
        var input = [{
            "patKey": "pat1",
            "precondition": {
                "value": {
                    "translations": []
                },
                "code": {
                    "translations": []
                }
            }
        }];
        modelutil.mongooseCleanSection(input);
        expect(input.precondition).to.not.exist;
        done();
    });
});

