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

exports.getMerges = function(secName, patientKey, typeFields, recordFields, callback) {
    merge.getMerges(dbinfo, secName, patientKey, typeFields, recordFields, callback);
};

exports.mergeCount = function(secName, patientKey, conditions, callback) {
    merge.count(dbinfo, secName, patientKey, conditions, callback);
};

// Matches
exports.getMatches = function(secName, patientKey, typeFields, recordFields, callback) {
    match.getMatches(dbinfo, secName, patientKey, typeFields, recordFields, callback);
};

exports.getMatch = function(secName, matchId, callback) {
    match.getMatch(dbinfo, secName, matchId, callback);
};

exports.matchCount = function(secName, patKey, conditions, callback) {
    match.count(dbinfo, secName, patKey, conditions, callback);
};

exports.cancelMatch = function(secName, id, reason, callback) {
    match.cancel(dbinfo, secName, id, reason, callback);
};

exports.acceptMatch = function(secName, id, reason, callback) {
    match.accept(dbinfo, secName, id, reason, callback);
};

// Sections

exports.saveNewSection = function(secName, patKey, inputArray, sourceID, callback) {
    section.saveNewEntries(dbinfo, secName, patKey, inputArray, sourceID, callback);
};

exports.savePartialSection = function(secName, patKey, inputArray, sourceID, callback) {
    section.savePartialEntries(dbinfo, secName, patKey, inputArray, sourceID, callback);
};

exports.getSection = function(secName, patKey, callback) {
    section.getSection(dbinfo, secName, patKey, callback);
};

exports.getPartialSection = function(secName, patKey, callback) {
    section.getPartialSection(dbinfo, secName, patKey, callback);
};

exports.removeEntry = function(secName, partialID, callback) {
    section.removeEntry(dbinfo, secName, partialID, callback);
};

exports.updateEntry = function(secName, recordId, fileId, recordUpdate, callback) {
    section.updateEntry(dbinfo, secName, recordId, fileId, recordUpdate, callback);
};

exports.getEntry = function(secName, recordId, callback) {
    section.getEntry(dbinfo, secName, recordId, callback);
};

exports.duplicateEntry = function(secName, update_id, sourceID, callback) {
    section.duplicateEntry(dbinfo, secName, update_id, sourceID, callback);
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
