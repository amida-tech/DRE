"use strict";

var chai = require('chai');
var util = require('util');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;
var db = require('../../lib/recordjs/db');
var section = require('../../lib/recordjs/section');

var expect = chai.expect;
var assert = chai.assert;
var db_connection;

function getDBConnection(callback) {

    var options = {
        dbName: 'partialtest',
        typeToSection: {},
        typeToSchemaDesc: {}
    };

    var typeToSection = {};
    typeToSection.testallergy = 'testallergies';
    options.typeToSection = typeToSection;

    var typeToSchemaDesc = {};
    typeToSchemaDesc.testallergy = {
        date: Date,
        name: String,
        severity: String,
        reviewed: Boolean
    };

    options.typeToSchemaDesc = typeToSchemaDesc;



    db.connect('localhost', options, function(err, result) {
        if (err) {
            done(err);
        } else {
            callback(null, result);
        }
    });
}



describe('Save Partial Records:', function() {

    before(function(done) {
        getDBConnection(function(err, conn) {
            if (err) {
                done(err);
            } else {
                //console.log(conn);
                db_connection = conn;
                done();
            }
        });
    });

    xit('Save Test Partial Record', function(done) {
        var test_partial_entry = [{
            name: 'fake_record'
        }];
        var test_patient = 'test';
        var filename = 'test_filename';
        //var par_source_id = new ObjectId().toString();
        section.savePartialEntries(db_connection, 'testallergy', test_patient, test_partial_entry, 'par_source_id', function(err, partial_save_result) {
            done();
        });
    });

    xit('Save Test New Record', function(done) {
        var test_partial_entry = [{
            name: 'fake_record'
        }];
        var test_patient = 'test';
        var filename = 'test_filename';
        var new_source_id = new ObjectId().toString();
        section.saveNewEntries(db_connection, 'testallergy', test_patient, test_partial_entry, new_source_id, function(err, partial_save_result) {
            done();
        });
    });

});

//Need to test exclusion between reviewed and unreviewed.

describe('Get Partial Records:', function(done) {

    before(function(done) {
        if (db_connection === undefined) {
            getDBConnection(function(err, conn) {
                if (err) {
                    done(err);
                } else {
                    //console.log(conn);
                    db_connection = conn;
                    done();
                }
            });
        } else {
            done();
        }
    });

    it('Get Partial Records', function(done) {
        var test_patient = 'test';
        section.getPartialSection(db_connection, 'testallergy', test_patient, function(err, res) {
            //console.log(res);
            done();
        });
    });

    //Need to reconfigure to have attribution to input record to function correctly.
    it('Get Normal Records', function(done) {
        var test_patient = 'test';
        section.getSection(db_connection, 'testallergy', test_patient, function(err, res) {
            //console.log(res);
            done();
        });
    });

});






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
    

    /*
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
