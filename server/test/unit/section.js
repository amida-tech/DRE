"use strict";

var chai = require('chai');
var async = require('async');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var entry = require('../../lib/recordjs/entry');
var storage = require('../../lib/recordjs/storage');
var modelutil = require('../../lib/recordjs/modelutil');
var match = require('../../lib/recordjs/match');

var refmodel = require('./refModel')

var expect = chai.expect;
chai.config.includeStack = true;

describe('partial methods', function() {
    var context = {};

    refmodel.prepareConnection('sectiontest', context)();

    it('add new storage', function(done) {
        refmodel.addRecordsPerPatient(context, [3, 3, 2], done);
    });
    
    it('save news', function(done) {
        async.parallel([
            function(callback) {refmodel.saveSection(context, 'testallergies', 'pat0', '0.0', 5, callback);},
            function(callback) {refmodel.saveSection(context, 'testallergies', 'pat2', '2.0', 3, callback);},
            function(callback) {refmodel.saveSection(context, 'testprocedures', 'pat0', '0.0', 3, callback);},
            function(callback) {refmodel.saveSection(context, 'testprocedures', 'pat1', '1.0', 5, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    it('save partials', function(done) {
        var matchInfo0 = refmodel.createMatchInformation('0.1', [4, 0, 2], ['diff', 'partial', 'diffsub']);
        var matchInfo1 = refmodel.createMatchInformation('2.1', [1], ['diffsub']);
        var matchInfo2 = refmodel.createMatchInformation('0.1', [2], ['partialsub']);
        var matchInfo3 = refmodel.createMatchInformation('1.1', [1, 3], ['partial', 'diff']);
        var matchInfo4 = refmodel.createMatchInformation('1.2', [2, 4], ['partialsub', 'diffsub']);

        async.parallel([
            function(callback) {refmodel.savePartialSection(context, 'testallergies', 'pat0', '0.1', '0.0', matchInfo0, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testallergies', 'pat2', '2.1', '2.0', matchInfo1, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testprocedures', 'pat0', '0.1', '0.0', matchInfo2, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testprocedures', 'pat1', '1.1', '1.0', matchInfo3, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testprocedures', 'pat1', '1.2', '1.0', matchInfo4, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    it('get partials', function(done) {
        async.parallel([
            function(callback) {section.getPartial(context.dbinfo, 'testallergies', 'pat0', callback);},
            function(callback) {section.getPartial(context.dbinfo, 'testallergies', 'pat2', callback);},
            function(callback) {section.getPartial(context.dbinfo, 'testprocedures', 'pat0', callback);},
            function(callback) {section.getPartial(context.dbinfo, 'testprocedures', 'pat1', callback);},
            ], 
            function(err, results) {
                if (! err) {
                    var checkBBData = function(getResult, original) {
                        var bbClean = modelutil.mongooseToBBModelSection(getResult);
                        expect(original).to.deep.include.members(bbClean);
                        expect(bbClean).to.deep.include.members(original);
                    };
                    checkBBData(results[0], refmodel.createTestSection('testallergies', '0.1', 3));
                    checkBBData(results[1], refmodel.createTestSection('testallergies', '2.1', 1));
                    checkBBData(results[2], refmodel.createTestSection('testprocedures', '0.1', 1));
                    var piece11 = refmodel.createTestSection('testprocedures', '1.1', 2);
                    var piece12 = refmodel.createTestSection('testprocedures', '1.2', 2);
                    checkBBData(results[3], piece11.concat(piece12));
    
                    results.forEach(function(result) {
                        result.forEach(function(entry) {
                            expect(entry.archived).to.not.be.ok;
                            expect(entry.reviewed).to.not.be.ok;
                            expect(entry.metadata).to.exist;
                            expect(entry.metadata.attribution).to.exist;
                            expect(entry.metadata.attribution).to.have.length(1);
                            expect(entry.metadata.attribution[0].merge_reason).to.equal('new');
                            expect(entry.metadata.attribution[0].record_id).to.exist;                       
                        });
                    });
    
                    var checkPatientNFile = function(result, ptKey, filename) {
                        result.forEach(function(entry) {
                            expect(entry.patKey).to.equal(ptKey);
                            expect(entry.metadata.attribution[0].record_id.filename).to.equal(filename);                       
                        });
                    };
    
                    checkPatientNFile(results[0], 'pat0', 'c01.xml');
                    checkPatientNFile(results[1], 'pat2', 'c21.xml');
                    checkPatientNFile(results[2], 'pat0', 'c01.xml');
    
                    var cntFilename = {};
                    results[3].forEach(function(entry) {
                        expect(entry.patKey).to.equal('pat1');
                        var filename = refmodel.propertyToFilename(entry.name);
                        expect(entry.metadata.attribution[0].record_id.filename).to.equal(filename);                       
                        cntFilename[filename] = (cntFilename[filename] || 0) + 1; 
                    });
                    expect(cntFilename['c11.xml']).to.equal(2);
                    expect(cntFilename['c12.xml']).to.equal(2);
    
                    expect(results[0]).to.have.length(3);
                    expect(results[1]).to.have.length(1);
                    expect(results[2]).to.have.length(1);
                    expect(results[3]).to.have.length(4);
                }
                done(err);
            }
        );
    });

    it('remove partials', function(done) {
        var key0 = refmodel.partialEntriesContextKey('testallergies', '2.1');
        var id0 = context[key0][0].match_entry_id;
        var key1 = refmodel.partialEntriesContextKey('testprocedures', '1.2');
        var id1 = context[key1][1].match_entry_id
        async.parallel([
            function(callback) {entry.remove(context.dbinfo, 'testallergies', id0, callback);},
            function(callback) {entry.remove(context.dbinfo, 'testprocedures', id1, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    it('get partials post remove', function(done) {
        async.parallel([
            function(callback) {section.getPartial(context.dbinfo, 'testallergies', 'pat2', callback);},
            function(callback) {section.getPartial(context.dbinfo, 'testprocedures', 'pat1', callback);},
            ], 
            function(err, results) {
                if (! err) {
                    expect(results[0]).to.have.length(0);
                    expect(results[1]).to.have.length(3);
                    var cntFilename = {};
                    results[1].forEach(function(entry) {
                        expect(entry.patKey).to.equal('pat1');
                        var filename = refmodel.propertyToFilename(entry.name);
                        expect(entry.metadata.attribution[0].record_id.filename).to.equal(filename);                       
                        cntFilename[filename] = (cntFilename[filename] || 0) + 1; 
                    });
                    expect(cntFilename['c11.xml']).to.equal(2);
                    expect(cntFilename['c12.xml']).to.equal(1);
                }
                done(err);
            }
        );
    });

    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});
