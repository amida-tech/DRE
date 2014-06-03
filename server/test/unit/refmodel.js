"use strict";

var chai = require('chai');
var async = require('async');

var db = require('../../lib/recordjs/db');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');

var expect = chai.expect;
chai.config.includeStack = true;

var typeToSection = {
    testallergy: 'testallergies',
    testprocedure: 'testprocedures'    
};

var typeToSchemaDesc = {
    testallergy: {
        name: String,
        severity: String,
        value: {
            code: String, 
            display: String
        }
    },
    testprocedure : {
        name: String,
        proc_type: String,
        proc_value: {
            code: String,
            display: String
        }
    }
};

var getConnectionOptions = function(dbName) {
    return {
        dbName: dbName,
        typeToSection: typeToSection,
        typeToSchemaDesc: typeToSchemaDesc
    };
};

var createStorage = exports.createStorage = function(context, pat, filename, index, callback) {
    storage.saveRecord(context.dbinfo, pat, 'content', {type: 'text/xml', name: filename}, 'ccda', function(err, result) {
        if (err) {
            callback(err);
        } else {
            expect(result).to.exist;
            expect(result._id).to.exist;
            context.storageIds[index] = result._id;
            callback();
        }
    });
};

var createAllergies = exports.createAllergies = function(context, patKey, recordIndex, count, callback) {
    var data = [];
    for (var i=0; i<count; ++i) {
        var suffix = '_' + recordIndex + '.' + i;
        data[i] = {
            name: 'name' + suffix,
            severity: 'severity' + suffix,
            value: {code: 'code' + suffix, display: 'display' + suffix}
        }    
    };
    section.saveNewEntries(context.dbinfo, 'testallergy', patKey, data, context.storageIds[recordIndex], callback);
};

var createProcedures = exports.createProcedures = function(context, patKey, recordIndex, count, callback) {
    var data = [];
    for (var i=0; i<count; ++i) {
        var suffix = '_' + recordIndex + '.' + i;
        data[i] = {
            name: 'name' + suffix,
            proc_type: 'proc_type' + suffix,
            proc_value: {code: 'code' + suffix, display: 'display' + suffix}
        }    
    };
    section.saveNewEntries(context.dbinfo, 'testprocedure', patKey, data, context.storageIds[recordIndex], callback);
};
    
exports.setConnectionContext = function(dbName, context, callback) {
    var options = getConnectionOptions(dbName);
    db.connect('localhost', options, function(err, result) {
        if (err) {
            callback(err);
        } else {
            context.dbinfo = result;
            callback();
        }
    });
};

exports.testConnectionModels = function() {
    it('connection and models', function(done) {
        expect(this.dbinfo).to.exist;
        expect(this.dbinfo.db).to.exist;
        expect(this.dbinfo.grid).to.exist;
        expect(this.dbinfo.models).to.exist;
        expect(this.dbinfo.models.testallergy).to.exist;
        expect(this.dbinfo.models.testprocedure).to.exist;
        done();
    });
};

exports.addNewData = function() {
    it('add new storage', function(done) {
        var that = this;
        async.parallel([
            function(callback) {createStorage(that.context, 'pat0', 'c00.xml', '0.0', callback);},
            function(callback) {createStorage(that.context, 'pat0', 'c01.xml', '0.1', callback);},
            function(callback) {createStorage(that.context, 'pat0', 'c02.xml', '0.2', callback);},
            function(callback) {createStorage(that.context, 'pat1', 'c10.xml', '1.0', callback);},
            function(callback) {createStorage(that.context, 'pat1', 'c11.xml', '1.1', callback);},
            function(callback) {createStorage(that.context, 'pat2', 'c20.xml', '2.0', callback);}
            ], 
            function(err) {done(err);}
        );
    });
    
    it('add allergies and procedures', function(done) {
        var that = this;
        async.parallel([
            function(callback) {createAllergies(that.context, 'pat0', '0.0', 2, callback);},
            function(callback) {createAllergies(that.context, 'pat2', '2.0', 3, callback);},
            function(callback) {createProcedures(that.context, 'pat0', '0.0', 2, callback);},
            function(callback) {createProcedures(that.context, 'pat1', '1.0', 3, callback);},
            ], 
            function(err) {done(err);}
        );
    });
};
