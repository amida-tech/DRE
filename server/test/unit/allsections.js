"use strict";

var chai = require('chai');
var async = require('async');

var db = require('../../lib/recordjs/db');
var allsections = require('../../lib/recordjs/allsections');
var modelutil = require('../../lib/recordjs/modelutil');

var refmodel = require('./refModel')

var expect = chai.expect;
chai.config.includeStack = true;

describe('allsections.js methods', function() {
	var context = {}; // populated by refmodel common methods

    refmodel.prepareConnection('allsectionstest2', context)();

    it('add records', function(done) {
        refmodel.addRecordsPerPatient(context, [1, 1], done);
    });

    var save = function(ptKey, recordIndex, counts, callback) {
    	var a = refmodel.createTestSection('testallergies', recordIndex, counts[0]);
    	var p = refmodel.createTestSection('testprocedures', recordIndex, counts[1]);
        var d = refmodel.createTestSection('testdemographics', recordIndex, 1);
    	var r = {
    		testallergies: a,
    		testprocedures: p,
            testdemographics: d[0]
    	};
    	var sourceId = context.storageIds[recordIndex];
    	allsections.save(context.dbinfo, ptKey, r, sourceId, callback);    	
    }

    it('save', function(done) {
    	async.parallel([
    		function(cb) {save('pat0', '0.0', [3, 3], cb);},
    		function(cb) {save('pat1', '1.0', [2, 4], cb);}
    		],
    		function(err) {
    			done(err);
    		}
    	);
    });

    var verify = function(actual, secName, recordIndex, count) {
    	var expected = refmodel.createTestSection(secName, recordIndex, count);
        var actualSection = actual[secName];
        expect(expected).to.deep.include.members(actualSection);
        expect(actualSection).to.deep.include.members(expected);
    };

    it('get', function(done) {
    	async.parallel([
    		function(cb) {allsections.get(context.dbinfo, 'pat0', cb);},
    		function(cb) {allsections.get(context.dbinfo, 'pat1', cb);},
    		],
    		function(err, results) {
    			if (err) {
    				done(err);
    			} else {
    				var actuals = results.map(function(result) {
    					return modelutil.mongooseToBBModelFullRecord(result);
    				});
    				verify(actuals[0], 'testallergies', '0.0', 3);
    				verify(actuals[0], 'testprocedures', '0.0', 3);
                    verify(actuals[0], 'testdemographics', '0.0', 1);
    				verify(actuals[1], 'testallergies', '1.0', 2);
    				verify(actuals[1], 'testprocedures', '1.0', 4);
                    verify(actuals[1], 'testdemographics', '1.0', 1);
    				done();
    			}
    		}
    	);
    });

    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});
