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

var storage = require('../../lib/recordjs/storage');
var db = require('../../lib/recordjs/db');
var modelutil = require('../../lib/recordjs/modelutil');
var allsections = require('../../lib/recordjs/allsections');

var expect = chai.expect;
var assert = chai.assert;

describe('CCD_1', function() {
    var dbinfo = null;
    var ccd = null;
    var fileId = null;
    var dbCcd = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        var parseResult = bb.parseString(xml);
        ccd = parseResult.data;
        options = {
            dbName: 'allsectionstest',
            typeToSection: record.typeToSection,
            typeToSchemaDesc: record.typeToSchemaDesc
        };
        db.connect('localhost', options, function(err, dbinfoin) {
            if (err) {
                done(err);
            } else {
                dbinfo = dbinfoin;
                done();
            }    
        });
    });
    
    it('check ccd/dbinfo', function(done) {
        assert.ok(ccd, 'ccd problem');
        assert.ok(dbinfo, 'dbinfo problem');
        done();
    });
        
    it('storage', function(done) {
        var fileInfo = {name: 'ccd_1.xml', type: 'text/xml'};
        storage.saveRecord(dbinfo, 'pat1', 'dummy context', fileInfo, 'ccda', function(err, result) {
            if (err) {
                done(err);
            } else {
                fileId = result._id;
                expect(fileId).to.exist;
                done();
            }
        });
    });
    
    it('saveAllSectionsAsNew', function(done) {
        allsections.saveAllSectionsAsNew(dbinfo, 'patientKey', ccd, fileId, function(err) {
            done(err);
        });
    });
    
    it('getAllSections', function(done) {
        allsections.getAllSections(dbinfo, 'patientKey', function(err, result) {
            if (err) {
                done(err);
            } else {
                modelutil.mongooseCleanFullRecord(result);
                expect(result).to.deep.equal(ccd);
                done();
            }
        });
    });

    after(function(done) {
        dbinfo.db.dropDatabase();
        done();
    });
});
