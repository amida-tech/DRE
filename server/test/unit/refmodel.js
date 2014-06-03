"use strict";

var chai = require('chai');

var db = require('../../lib/recordjs/db');

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
}
