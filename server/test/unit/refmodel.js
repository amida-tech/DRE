"use strict";

var options = {
    dbName: 'mergestest',
    typeToSection: {},
            typeToSchemaDesc: {}
        };
        
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

exports.getConnectionOptions = function(dbName) {
    return {
        dbName: dbName,
        typeToSection: typeToSection,
        typeToSchemaDesc: typeToSchemaDesc
    };
};
