"use strict";

var chai = require('chai');
var util = require('util');
var path = require('path');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var storage = require('../../lib/recordjs/storage');

var expect = chai.expect;
var assert = chai.assert;

describe('merges', function() {
    var dbinfo = null;
    var storageIds = [];

    var createStorage = function(pat, filename, index, done) {
        storage.saveRecord(dbinfo, pat, 'content', {
            type: 'text/xml',
            filename: filename
        }, 'ccda', function(err, result) {
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

        var typeToSchemaDesc = {};
        typeToSchemaDesc.testallergy = {
            date: Date,
            name: String,
            severity: String
        };
        typeToSchemaDesc.testprocedure = {
            date: Date,
            name: String,
            type: String
        };
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
});
