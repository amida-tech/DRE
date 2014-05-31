var mongo = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var _ = require('underscore');

var db = require('./db');
var models = require('./models');
var storage = require('./storage');
var merge = require('./merge');
var match = require('./match');
var section = require('./section');
var jsutil = require('./jsutil');
var modelutil = require('./modelutil');
var allsections = require('./allsections');

var typeToSection = exports.typeToSection = {
    allergy: 'allergies',
    procedure: 'procedures',
    medication: 'medications',
    encounter: 'encounters',
    vital: 'vitals',
    result: 'results',
    social: 'socialHistory',
    immunization: 'immunizations',
    demographic: 'demographics',
    problem: 'problems'
};

var sectionToType = exports.sectionToType = {
    allergies: 'allergy',
    procedures: 'procedure',
    medications: 'medication',
    encounters: 'encounter',
    vitals: 'vital',
    results: 'result',
    socialHistory: 'social',
    immunizations: 'immunization',
    demographics: 'demographic',
    problems: 'problem'
};

var typeToSchemaDesc = {};
Object.keys(typeToSection).forEach(function(type) {
    var desc = models.modelDescription('ccda_' + typeToSection[type]);
    if (!desc) {throw new Error('cannot get schema for ' + 'ccda_' + typeToSection[type]);}
    typeToSchemaDesc[type] = desc;
});
//typeToSchemaDesc.medication.date = typeToSchemaDesc.medication.date[0];
exports.typeToSchemaDesc = typeToSchemaDesc;

var dbinfo = null;

exports.connectDatabase = function connectDatabase(server, dbName, callback) {
    if (! callback) {
        callback = dbName;
        dbName = 'dre';
    }
    if (dbinfo !== null) {
        callback();
        return;
    }
    options = {
        dbName: dbName,
        typeToSection: typeToSection,
        typeToSchemaDesc: typeToSchemaDesc
    };
    db.connect(server, options, function(err, dbinfoin) {
        if (err) {
            callback(err);
        } else {
            dbinfo = dbinfoin;
            callback(null, dbinfo);
        }    
    });
};

// Records

exports.saveRecord = function(patKey, inboundFile, inboundFileInfo, inboundXMLType, callback) {
    storage.saveRecord(dbinfo, patKey, inboundFile, inboundFileInfo, inboundXMLType, callback);
};

exports.getRecordList = function(patKey, callback) {
    storage.getRecordList(dbinfo, patKey, callback);
};

exports.getRecord = function(fileId, callback) {
    storage.getRecord(dbinfo, fileId, callback);
};

exports.recordCount = function(patKey, callback) {
    storage.recordCount(dbinfo, patKey, callback);
};

// Merges

exports.getMerges = function(patientKey, type, typeFields, recordFields, callback) {
    merge.getMerges(dbinfo, patientKey, sectionToType[type], typeFields, recordFields, callback);
};

exports.setMerge = function(mergeObject, callback) {
    merge.saveMerge(dbinfo, mergeObject, callback);
};

exports.mergeCount = function(type, conditions, callback) {
    merge.count(dbinfo, type, conditions, callback);
};

// Matches
exports.getMatches = function(type, typeFields, recordFields, callback) {
    match.getMatches(dbinfo, sectionToType[type], typeFields, recordFields, callback);
};

exports.getMatch = function(type, matchId, callback) {
    match.getMatch(dbinfo, sectionToType[type], matchId, callback);
};

exports.updateMatch = function(type, identifier, updateFields, callback) {
    match.updateMatch(dbinfo, sectionToType[type], identifier, updateFields, callback);   
};

exports.matchCount = function(type, conditions, callback) {
    match.count(dbinfo, type, conditions, callback);
};

// Sections
var capitalize = function(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

module.exports.capitalize = capitalize;

Object.keys(typeToSection).forEach(function(type) {
    var sectionName = capitalize(typeToSection[type]);
    var typeName = capitalize(type);
    
    exports['saveNew' + sectionName] = function(patKey, inputArray, sourceID, callback) {
        section.saveNewEntries(dbinfo, type, patKey, inputArray, sourceID, callback);
    };

    exports['update' + typeName] = function(patKey, recordId, recordUpdate, callback) {
        section.updateEntry(dbinfo, type, patKey, recordId, recordUpdate, callback);
    };

    exports['get' + typeName] = function(recordId, callback) {
        section.getEntry(dbinfo, type, recordId, callback);
    };

    exports['savePartial' + sectionName] = function(patKey, inputArray, sourceID, callback) {
        section.savePartialEntries(dbinfo, type, patKey, inputArray, sourceID, callback);
    };

    exports['removePartial' + typeName] = function(patKey, partialID, callback) {
        section.removeEntry(dbinfo, type, patKey, partialID, callback);
    };

    exports['add' + sectionName + 'MatchEntry'] = function(patKey, inputArray, callback) {
        section.saveMatchEntries(dbinfo, type, patKey, inputArray, callback);
    };

    exports['get' + sectionName] = function(patKey, callback) {
        section.getSection(dbinfo, type, patKey, callback);
    };

    exports['getPartial' + sectionName] = function(patKey, callback) {
        section.getPartialSection(dbinfo, type, patKey, callback);
    };

    exports['add' + typeName + 'MergeEntry'] = function(update_id, mergeInfo, callback) {
        section.addEntryMergeEntry(dbinfo, type, update_id, mergeInfo, callback);
    };

    exports[type + 'Count'] = function(conditions, callback) {
        section.sectionEntryCount(dbinfo, type, conditions, callback);
    };

});

exports.getAllSections = function(patientKey, callback) {
    allsections.getAllSections(dbinfo, patientKey, callback);
};

exports.saveAllSectionsAsNew = function(patientKey, patientRecord, fileId, callback) {
    allsections.saveAllSectionsAsNew(dbinfo, patientKey, patientRecord, fileId, callback);
};

// Utility

exports.cleanSectionEntries = function(input) {
    return modelutil.mongooseToBBModelSection(input);
};

// Matches

//Will need a get 



