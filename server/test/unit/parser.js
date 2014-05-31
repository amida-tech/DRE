"use strict";
/*jshint -W117 */

var should = require('chai').should;
var fs = require('fs');
var storage = require('../../lib/parser/index.js');
var path = require('path');

function loadSampleRecord(callback) {
    var filepath = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
    fs.readFile(filepath, 'utf8', function(err, data) {
        if (err) {
            callback(err);
        }
        callback(null, data);
    });
}


describe('Storage API', function() {
    var sampleFile = '';

    before(function(done) {
        loadSampleRecord(function(err, file) {
            if (err) {
                done(err);
            }
            sampleFile = file;
            done();
        });
    });

    it('Test 1', function(done) {
        storage.extractRecord(sampleFile, function(err, results) {
            done();
        });
    });

});
