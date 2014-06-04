"use strict";

var chai = require('chai');
var util = require('util')
var path = require('path');
var async = require('async');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');
var modelutil = require('../../lib/recordjs/modelutil');

var refmodel = require('./refModel')

var expect = chai.expect;
var assert = chai.assert;

chai.config.includeStack = true;

describe('partial methods', function() {
    var context = {
        storageIds: {},
    };

    var saveNewPartialSection = function(context, type, patKey, recordIndex, destRecordIndex, extraContent, callback) {
        var data = refmodel.createTestSection(type, recordIndex, extraContent.length);
        var sourceId = context.storageIds[recordIndex];
        var key = refmodel.newEntriesContextKey(type, destRecordIndex);
        var extendedData = data.reduce(function(r, e, index) {
            var v = {
                partial_array: e,
                partial_match: extraContent[index].matchObject,
                match_record_id: context[key][extraContent[index].destIndex]
            };
            r.push(v);
            return r;
        }, []);
        section.savePartialEntries(context.dbinfo, type, patKey, extendedData, sourceId, callback);
    };

    before(function(done) {
        refmodel.setConnectionContext('partialtest', context, done)
    });

    beforeEach(function(done) {
        this.dbinfo = context.dbinfo;
        this.context = context;
        done();
    });

    refmodel.testConnectionModels();

    it('connection match models', function(done) {
        expect(this.dbinfo.matchModels).to.exist;
        expect(this.dbinfo.matchModels.testallergy).to.exist;
        expect(this.dbinfo.matchModels.testprocedure).to.exist;
        done();
    });
    
    it('add new storage', function(done) {
        refmodel.addStoragePerPatient(context, [3, 3, 2], done);
    });
    
    it('add new allergies and procedures', function(done) {
        async.parallel([
            function(callback) {refmodel.saveNewTestSection(context, 'testallergy', 'pat0', '0.0', 5, callback);},
            function(callback) {refmodel.saveNewTestSection(context, 'testallergy', 'pat2', '2.0', 3, callback);},
            function(callback) {refmodel.saveNewTestSection(context, 'testprocedure', 'pat0', '0.0', 3, callback);},
            function(callback) {refmodel.saveNewTestSection(context, 'testprocedure', 'pat1', '1.0', 5, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    it('save partial allergies and procedures', function(done) {
        var matchInfo0 = refmodel.createMatchInformation('0.1', [4, 0, 2], ['diff', 'partial', 'diffsub']);
        var matchInfo1 = refmodel.createMatchInformation('2.1', [1], ['diffsub']);
        var matchInfo2 = refmodel.createMatchInformation('0.1', [2], ['partialsub']);
        var matchInfo3 = refmodel.createMatchInformation('1.1', [1, 3], ['partial', 'diff']);
        var matchInfo4 = refmodel.createMatchInformation('1.2', [2, 4], ['partialsub', 'diffsub']);

        async.parallel([
            function(callback) {saveNewPartialSection(context, 'testallergy', 'pat0', '0.1', '0.0', matchInfo0, callback);},
            function(callback) {saveNewPartialSection(context, 'testallergy', 'pat2', '2.1', '2.0', matchInfo1, callback);},
            function(callback) {saveNewPartialSection(context, 'testprocedure', 'pat0', '0.1', '0.0', matchInfo2, callback);},
            function(callback) {saveNewPartialSection(context, 'testprocedure', 'pat1', '1.1', '1.0', matchInfo3, callback);},
            function(callback) {saveNewPartialSection(context, 'testprocedure', 'pat1', '1.2', '1.0', matchInfo4, callback);},
            ], 
            function(err) {done(err);}
        );
    });



    it('get partial allergies and procedures', function(done) {
        async.parallel([
            function(callback) {section.getPartialSection(context.dbinfo, 'testallergy', 'pat0', callback);},
            function(callback) {section.getPartialSection(context.dbinfo, 'testallergy', 'pat2', callback);},
            function(callback) {section.getPartialSection(context.dbinfo, 'testprocedure', 'pat0', callback);},
            function(callback) {section.getPartialSection(context.dbinfo, 'testprocedure', 'pat1', callback);},
            ], 
            function(err, results) {
                var checkBBData = function(getResult, original) {
                    var bbClean = modelutil.mongooseToBBModelSection(getResult);
                    expect(original).to.deep.include.members(bbClean);
                    expect(bbClean).to.deep.include.members(original);
                };
                checkBBData(results[0], refmodel.createTestSection('testallergy', '0.1', 3));
                checkBBData(results[1], refmodel.createTestSection('testallergy', '2.1', 1));
                checkBBData(results[2], refmodel.createTestSection('testprocedure', '0.1', 1));
                var piece11 = refmodel.createTestSection('testprocedure', '1.1', 2);
                var piece12 = refmodel.createTestSection('testprocedure', '1.2', 2);
                checkBBData(results[3], piece11.concat(piece12));

                done(err);
            }
        );
    });

    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});
