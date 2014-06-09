"use strict";

var chai = require('chai');

var match = require('../../lib/recordjs/match');

var refmodel = require('./refModel')

var expect = chai.expect;
chai.config.includeStack = true;

describe('match.js methods', function() {
	var context = {}; // populated by refmodel common methods

    refmodel.prepareConnection('matchtest', context)();

    it('check match models', function(done) {
        expect(context.dbinfo.matchModels).to.exist;
        expect(context.dbinfo.matchModels.testallergies).to.exist;
        expect(context.dbinfo.matchModels.testprocedures).to.exist;
        done();
    });

    it('add records', function(done) {
        refmodel.addRecordsPerPatient(context, [4, 4, 2], done);
    });
    



    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});
