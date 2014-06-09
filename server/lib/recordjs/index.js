"use strict";

var db = require('./db');

var storage = require('./storage');
var merge = require('./merge');
var match = require('./match');
var section = require('./section');
var entry = require('./entry');
var allsections = require('./allsections');
var modelutil = require('./modelutil');

// db

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

// records

exports.saveRecord = function(ptKey, content, sourceInfo, contentType, callback) {
    storage.saveRecord(dbinfo, ptKey, content, sourceInfo, contentType, callback);
};

exports.getRecordList = function(ptKey, callback) {
    storage.getRecordList(dbinfo, ptKey, callback);
};

exports.getRecord = function(sourceId, callback) {
    storage.getRecord(dbinfo, sourceId, callback);
};

exports.recordCount = function(ptKey, callback) {
    storage.recordCount(dbinfo, ptKey, callback);
};

// merges

exports.getMerges = function(secName, ptKey, entryFields, recordFields, callback) {
    merge.getAll(dbinfo, secName, ptKey, entryFields, recordFields, callback);
};

exports.mergeCount = function(secName, ptKey, conditions, callback) {
    merge.count(dbinfo, secName, ptKey, conditions, callback);
};

// matches

exports.getMatches = function(secName, ptKey, entryFields, recordFields, callback) {
    match.getAll(dbinfo, secName, ptKey, entryFields, recordFields, callback);
};

exports.getMatch = function(secName, id, callback) {
    match.get(dbinfo, secName, id, callback);
};

exports.matchCount = function(secName, ptKey, conditions, callback) {
    match.count(dbinfo, secName, ptKey, conditions, callback);
};

exports.cancelMatch = function(secName, id, reason, callback) {
    match.cancel(dbinfo, secName, id, reason, callback);
};

exports.acceptMatch = function(secName, id, reason, callback) {
    match.accept(dbinfo, secName, id, reason, callback);
};

// section

exports.getSection = function(secName, ptKey, callback) {
    section.get(dbinfo, secName, ptKey, callback);
};

exports.saveSection = function(secName, ptKey, inputSection, sourceId, callback) {
    section.save(dbinfo, secName, ptKey, inputSection, sourceId, callback);
};

exports.getAllSections = function(ptKey, callback) {
    allsections.get(dbinfo, ptKey, callback);
};

exports.saveAllSections = function(ptKey, ptRecord, sourceId, callback) {
    allsections.save(dbinfo, ptKey, ptRecord, sourceId, callback);
};

// partial section

exports.getPartialSection = function(secName, ptKey, callback) {
    section.getPartial(dbinfo, secName, ptKey, callback);
};

exports.savePartialSection = function(secName, ptKey, inputSection, sourceId, callback) {
    section.savePartial(dbinfo, secName, ptKey, inputSection, sourceId, callback);
};

// entry

exports.getEntry = function(secName, id, callback) {
    entry.get(dbinfo, secName, id, callback);
};

exports.updateEntry = function(secName, id, sourceId, updateObject, callback) {
    entry.update(dbinfo, secName, id, sourceId, updateObject, callback);
};

exports.duplicateEntry = function(secName, id, sourceId, callback) {
    entry.duplicate(dbinfo, secName, id, sourceId, callback);
};

exports.removeEntry = function(secName, id, callback) {
    entry.remove(dbinfo, secName, id, callback);
};

// utility

exports.cleanSection = function(input) {
    return modelutil.mongooseToBBModelSection(input);
};
