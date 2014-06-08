"use strict";

var section = require('./section');
var async = require('async');

exports.getAllSections = function(dbinfo, ptKey, callback) {
    var types = Object.keys(dbinfo.typeToSection);
    var f = function(type, cb) {
        section.getSection(dbinfo, type, ptKey, cb);
    };
    async.map(types, f, function(err, sections) {
        if (err) {
            callback(err);
        } else {
            var accumulator = function(r, type, index) {
                var name = dbinfo.typeToSection[type];
                r[name] = sections[index];
                return r;
            };
            var result = types.reduce(accumulator, {});
            callback(null, result);
        }
    });
};

exports.saveAllSectionsAsNew = function(dbinfo, ptKey, master, fileId, callback) {
    var types = Object.keys(dbinfo.typeToSection);
    var f = function(type, cb) {
        var name = dbinfo.typeToSection[type];
        section.saveNewEntries(dbinfo, type, ptKey, master[name], fileId, cb);
    };
    async.map(types, f, callback);
};
