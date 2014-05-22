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

var db = require('../../lib/recordjs/db');
var section = require('../../lib/recordjs/section')

var expect = chai.expect;
var assert = chai.assert;





/*
describe('partial', function() {
    var dbinfo = null;
    var storageIds = [];

    var createStorage = function(pat, filename, index, done) {
        storage.saveRecord(dbinfo, pat, 'content', {type: 'text/xml', filename: filename}, 'ccda', function(err, result) {
            if (err) {
                done(err);
            } else {
                assert.notOk(err, 'storage error');
                assert.ok(result, 'result error');
                assert.ok(result._id, 'result._id error');
                storageIds[index] = result._id;
                done();
            }
        });
    };
    
    before(function(done) {
        var options = {
            dbName: 'mergestest',
            typeToSection: {},
            typeToSchemaDesc: {}
        };
        
        var typeToSection = {};
        typeToSection.testallergy = 'testallergies';
        typeToSection.testprocedure = 'testprocedures';
        options.typeToSection = typeToSection;
        
        var typeToSchemaDesc = {}
        typeToSchemaDesc.testallergy = {
            date: Date,
            name: String,
            severity: String
        }
        typeToSchemaDesc.testprocedure = {
            date: Date,
            name: String,
            type: String
        }
        options.typeToSchemaDesc = typeToSchemaDesc;
        
        db.connect('localhost', options, function(err, result) {
            if (err) {
                done(err);
            } else {
                dbinfo = result;
                done();
            }
        });
    });

    it('dbinfo check', function(done) {
        assert.ok(dbinfo, 'no dbinfo');
        assert.ok(dbinfo.db, 'no dbinfo.db');
        assert.ok(dbinfo.grid, 'no dbinfo');
        assert.ok(dbinfo.models, 'no dbinfo.models');
        assert.ok(dbinfo.mergeModels, 'no dbinfo.mergeModels');
        assert.ok(dbinfo.storageModel, 'no dbinfo.storageModel');
        assert.ok(dbinfo.models.testallergy, 'no dbinfo.models.testallergy');
        assert.ok(dbinfo.mergeModels.testallergy, 'no dbinfo.mergeModels.testallergy');
        assert.ok(dbinfo.models.testprocedure, 'no dbinfo.models.testprocedure');
        assert.ok(dbinfo.mergeModels.testprocedure, 'no dbinfo.mergeModels.testprocedure');
        done();
    });
    
    it('storage creation 0', function(done) {
        createStorage('pat1', 'c1.xml', 0, done);
    });
    
    it('storage creation 1', function(done) {
        createStorage('pat2', 'c2.xml', 1, done);
    });
    
    it('storage creation 2', function(done) {
        createStorage('pat1', 'c3.xml', 2, done);
    });
    
    after(function(done) {
        dbinfo.db.dropDatabase();
        done();
    });
});*/