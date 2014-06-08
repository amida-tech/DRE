"use strict";

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

var expect = chai.expect;
var assert = chai.assert;

chai.config.includeStack = true;

describe('CCD_1', function() {
    var dbinfo = null;
    var xml = null;
    var ccd = null;
    var fileId = null;
    var allergies = null;
    var storedAllergies = null;
    
    before(function(done) {
        var filepath  = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
        xml = fs.readFileSync(filepath, 'utf-8');
        var result = bb.parseString(xml);
        ccd = result.data;
        var options = {
            dbName: 'indextest',
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
        storage.saveRecord(dbinfo, 'pat1', xml, fileInfo, 'ccda', function(err, result) {
            if (err) {
                done(err);
            } else {
                fileId = result._id;
                expect(fileId).to.exist;
                done();
            }
        });
    });
    
    it('saveAllergies/getAllergies', function(done) {
        allergies = ccd.allergies;
        var n = allergies.length;
        section.saveNewEntries(dbinfo, 'allergy', 'pat1', allergies, fileId, function(err) {
            assert.notOk(err, 'saveAllergies failed');
            section.getSection(dbinfo, 'allergy', 'pat1', function(err, results) {
                storedAllergies = results;
                var cleanResults = record.cleanSectionEntries(results);
                expect(cleanResults).to.deep.include.members(allergies);
                expect(allergies).to.deep.include.members(cleanResults);
                done();
            });
        });
    });
    
    it('saveProcedures/getProcedures', function(done) {
        var procedures = ccd.procedures;
        var n = procedures.length;
        section.saveNewEntries(dbinfo, 'procedure', 'pat1', procedures, fileId, function(err) {
            assert.notOk(err, 'saveProcedures failed');
            section.getSection(dbinfo, 'procedure', 'pat1', function(err, results) {
                var cleanResults = record.cleanSectionEntries(results);
                expect(cleanResults).to.deep.include.members(procedures);
                expect(procedures).to.deep.include.members(cleanResults);
                done();
            });
        });
    });
    
    it('saveDemographics/getDemographics', function(done) {
        var demographics = ccd.demographics;
        section.saveNewEntries(dbinfo, 'demographic', 'pat1', demographics, fileId, function(err) {
            assert.notOk(err, 'saveProcedures failed');
            section.getSection(dbinfo, 'demographic', 'pat1', function(err, results) {
                var cleanResults = record.cleanSectionEntries(results);
                assert.deepEqual(cleanResults[0], demographics, 'write, read failed');
                done();
            });
        });
    });
    
    it('saveMedication/getMedication', function(done) {
        var medications = ccd.medications;
        section.saveNewEntries(dbinfo, 'medication', 'pat1', medications, fileId, function(err) {
            assert.notOk(err, 'saveMedication failed');
            section.getSection(dbinfo, 'medication', 'pat1', function(err, results) {
                var cleanResults = record.cleanSectionEntries(results);
                expect(cleanResults).to.deep.include.members(medications);
                expect(medications).to.deep.include.members(cleanResults);
                done();
            });
        });
    });
    
    it('saveProblems/getProblems', function(done) {
        var problems = ccd.problems;
        section.saveNewEntries(dbinfo, 'problem', 'pat1', problems, fileId, function(err) {
            assert.notOk(err, 'saveProblems failed');
            section.getSection(dbinfo, 'problem', 'pat1', function(err, results) {
                var cleanResults = record.cleanSectionEntries(results);
                expect(cleanResults).to.deep.include.members(problems);
                expect(problems).to.deep.include.members(cleanResults);
                done();
            });
        });
    });
    
    it('saveImmunizations/getImmunizations', function(done) {
        var immunizations = ccd.immunizations;
        section.saveNewEntries(dbinfo, 'immunization', 'pat1', immunizations, fileId, function(err) {
            assert.notOk(err, 'saveImmunizations failed');
            section.getSection(dbinfo, 'immunization', 'pat1', function(err, results) {
                var cleanResults = record.cleanSectionEntries(results);
                expect(cleanResults).to.deep.include.members(immunizations);
                expect(immunizations).to.deep.include.members(cleanResults);
                done();
            });
        });
    });
    
    it('allergyCount', function(done) {
        section.sectionEntryCount(dbinfo, 'allergy', {patKey: 'pat1'}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(3).to.equal(count);
                done();
            }
        });
    });
    
    it('mergeCount', function(done) {
        merge.count(dbinfo, 'allergy', 'pat1', {}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(3).to.equal(count);
                done();
            }
        });
    });
    
    it('getMerges', function(done) {
        merge.getMerges(dbinfo, 'allergy', 'pat1', 'name severity', 'filename uploadDate', function(err, mergeList) {
            if (err) {
                done(err);
            } else {
                var order = {};
                var n = allergies.length;
                for (var i=0; i<n; ++i) {
                    order[allergies[i].name] = i;
                }
                expect(n).to.equal(mergeList.length);
                for (i=0; i<n; ++i) {
                    var mergeRecord = mergeList[i];
                    var index = order[mergeRecord.entry_id.name];
                    expect(index).to.exist;
                    expect(allergies[index].severity).to.equal(mergeRecord.entry_id.severity);
                    expect(mergeRecord.record_id.filename).to.equal('ccd_1.xml');
                    expect(mergeRecord.merge_reason).to.equal('new');
                }
                done();
            }
        });
    });
    
    it('addAllergyMergeEntry', function(done) {
        var id = storedAllergies[0]._id;
        section.duplicateEntry(dbinfo, 'allergy', id, fileId, function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    });
    
    it('mergeCount all', function(done) {
        merge.count(dbinfo, 'allergy', 'pat1', {}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(4).to.equal(count);
                done();
            }
        });
    });
    
    it('mergeCount new', function(done) {
        merge.count(dbinfo, 'allergy', 'pat1', {merge_reason: 'new'}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(3).to.equal(count);
                done();
            }
        });
    });
    
    it('mergeCount duplicate', function(done) {
        merge.count(dbinfo, 'allergy', 'pat1', {merge_reason: 'duplicate'}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(1).to.equal(count);
                done();
            }
        });
    });
    
    after(function(done) {
        dbinfo.db.dropDatabase();
        done();
    });
});