"use strict";

var chai = require('chai');
var util = require('util');
var path = require('path');
var bb = require('blue-button');
var fs = require('fs');

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
        var options = {
            dbName: 'allsectionstest'
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
                var cleanResult = modelutil.mongooseToBBModelFullRecord(result);
                expect(cleanResult.demographics[0]).to.deep.equal(ccd.demographics);
                var ccdKeys = Object.keys(ccd).sort();
                var cleanResultKeys = Object.keys(cleanResult).sort();
                expect(ccdKeys).to.deep.equal(cleanResultKeys);
                ccdKeys.splice(ccdKeys.indexOf('demographics'), 1);
                ccdKeys.forEach(function(key) {
                    var a = ccd[key];
                    var b = cleanResult[key];
                    expect(b).to.deep.include.members(a);
                    expect(a).to.deep.include.members(b);
                });
               done();
            }
        });
    });

    after(function(done) {
        dbinfo.db.dropDatabase();
        done();
    });
});
