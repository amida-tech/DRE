/*=======================================================================
Copyright 2014 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var chai = require('chai');
var util = require('util')
var path = require('path');
var bb = require('blue-button');
var fs = require('fs');

var record = require('../../lib/recordjs');

var expect = chai.expect;
var assert = chai.assert;

describe('CCD_1', function() {
    var ccd = null;

    before(function(done) {
        var filepath  = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        bb.parse(xml, {component: 'ccda_ccd'}, function(err, result) {
            if (err) {
                done(err);
            } else {
                ccd = result.toJSON();
                record.connectDatabase('localhost', 'indextest', function(err, dbresult) {
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
            }
        });
    });
    
    it('check ccd', function(done) {
        assert.ok(ccd, 'ccd problem');
        done();
    });
    
    it('saveAllergies/getAllergies', function(done) {
        var allergies = ccd.allergies;
        var order = {};
        var n = allergies.length;
        for (var i=0; i<n; ++i) {
            order[allergies[i].name] = i;
        }
        record.saveNewAllergies('pat1', allergies, null, function(err) {
            assert.notOk(err, 'saveAllergies failed');
            record.getAllergies('pat1', function(err, results) {
                var cleanResults = record.cleanSectionEntries(results);
                var orderedResults = [];
                for (var j=0; j<n; ++j) {
                    orderedResults[order[cleanResults[j].name]] = cleanResults[j];
                }
                assert.deepEqual(orderedResults, allergies, 'write, read failed');
                done();
            });
        });
    });
});