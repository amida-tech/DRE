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

var dbinfo = null;

exports.connectDatabase = function connectDatabase(server, options, callback) {
    if (! callback) {
        callback = options;
        options = {};
    }
    db.connect(server, options, function(err, result) {
        if (err) {
            callback(err);
        } else {
            dbinfo = result;
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

exports.getMerges = function(type, patientKey, typeFields, recordFields, callback) {
    merge.getMerges(dbinfo, dbinfo.sectionToType[type], patientKey, typeFields, recordFields, callback);
};

exports.mergeCount = function(type, patientKey, conditions, callback) {
    merge.count(dbinfo, dbinfo.sectionToType[type], patientKey, conditions, callback);
};

// Matches
exports.getMatches = function(type, patientKey, typeFields, recordFields, callback) {
    match.getMatches(dbinfo, dbinfo.sectionToType[type], patientKey, typeFields, recordFields, callback);
};

exports.getMatch = function(type, matchId, callback) {
    match.getMatch(dbinfo, dbinfo.sectionToType[type], matchId, callback);
};

exports.matchCount = function(type, patKey, conditions, callback) {
    match.count(dbinfo, dbinfo.sectionToType[type], patKey, conditions, callback);
};

exports.cancelMatch = function(type, id, reason, callback) {
    match.cancel(dbinfo, dbinfo.sectionToType[type], id, reason, callback);
};

exports.acceptMatch = function(type, id, reason, callback) {
    match.accept(dbinfo, dbinfo.sectionToType[type], id, reason, callback);
};

// Sections

exports.saveNewSection = function(type, patKey, inputArray, sourceID, callback) {
    section.saveNewEntries(dbinfo, dbinfo.sectionToType[type], patKey, inputArray, sourceID, callback);
};

exports.savePartialSection = function(type, patKey, inputArray, sourceID, callback) {
    section.savePartialEntries(dbinfo, dbinfo.sectionToType[type], patKey, inputArray, sourceID, callback);
};

exports.getSection = function(type, patKey, callback) {
    section.getSection(dbinfo, dbinfo.sectionToType[type], patKey, callback);
};

exports.getPartialSection = function(type, patKey, callback) {
    section.getPartialSection(dbinfo, dbinfo.sectionToType[type], patKey, callback);
};

exports.removeEntry = function(type, partialID, callback) {
    section.removeEntry(dbinfo, dbinfo.sectionToType[type], partialID, callback);
};

exports.updateEntry = function(type, recordId, fileId, recordUpdate, callback) {
    section.updateEntry(dbinfo, dbinfo.sectionToType[type], recordId, fileId, recordUpdate, callback);
};

exports.getEntry = function(type, recordId, callback) {
    section.getEntry(dbinfo, dbinfo.sectionToType[type], recordId, callback);
};

exports.duplicateEntry = function(type, update_id, sourceID, callback) {
    section.duplicateEntry(dbinfo, dbinfo.sectionToType[type], update_id, sourceID, callback);
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
