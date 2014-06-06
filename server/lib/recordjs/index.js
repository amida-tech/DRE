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
    merge.count(dbinfo, sectionToType[type], conditions, callback);
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
    match.count(dbinfo, sectionToType[type], conditions, callback);
};

exports.cancelMatch = function(type, id, reason, callback) {
    match.cancel(dbinfo, sectionToType[type], id, reason, callback);
};

// Sections

exports.saveNewSection = function(type, patKey, inputArray, sourceID, callback) {
    section.saveNewEntries(dbinfo, sectionToType[type], patKey, inputArray, sourceID, callback);
};

exports.savePartialSection = function(type, patKey, inputArray, sourceID, callback) {
    section.savePartialEntries(dbinfo, sectionToType[type], patKey, inputArray, sourceID, callback);
};

exports.getSection = function(type, patKey, callback) {
    section.getSection(dbinfo, sectionToType[type], patKey, callback);
};

exports.getPartialSection = function(type, patKey, callback) {
    section.getPartialSection(dbinfo, sectionToType[type], patKey, callback);
};

exports.removeEntry = function(type, partialID, callback) {
    section.removeEntry(dbinfo, sectionToType[type], partialID, callback);
};

exports.updateEntry = function(type, patKey, recordId, recordUpdate, callback) {
    section.updateEntry(dbinfo, sectionToType[type], patKey, recordId, recordUpdate, callback);
};

exports.getEntry = function(type, recordId, callback) {
    section.getEntry(dbinfo, sectionToType[type], recordId, callback);
};

exports.addMergeEntry = function(type, update_id, mergeInfo, callback) {
    section.addEntryMergeEntry(dbinfo, sectionToType[type], update_id, mergeInfo, callback);
};

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
