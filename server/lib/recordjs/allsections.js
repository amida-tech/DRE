"use strict";

var section = require('./section');
var async = require('async');

exports.getAllSections = function(dbinfo, ptKey, callback) {
    var secNames = Object.keys(dbinfo.sectionToType);
    var f = function(secName, cb) {
        section.getSection(dbinfo, secName, ptKey, cb);
    };
    async.map(secNames, f, function(err, sections) {
        if (err) {
            callback(err);
        } else {
            var accumulator = function(r, secName, index) {
                r[secName] = sections[index];
                return r;
            };
            var result = secNames.reduce(accumulator, {});
            callback(null, result);
        }
    });
};

exports.saveAllSectionsAsNew = function(dbinfo, ptKey, master, fileId, callback) {
    var secNames = Object.keys(dbinfo.sectionToType);
    var f = function(name, cb) {
        section.saveNewEntries(dbinfo, name, ptKey, master[name], fileId, cb);
    };
    async.map(secNames, f, callback);
};
