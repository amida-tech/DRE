"use strict";

var chai = require('chai');
var util = require('util')
var path = require('path');
var async = require('async');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');

var refmodel = require('./refModel')

var expect = chai.expect;
var assert = chai.assert;

chai.config.includeStack = true;

describe('partial methods', function() {
    var context = {
        storageIds: {}
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
    
    refmodel.addNewData();
    
    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});
