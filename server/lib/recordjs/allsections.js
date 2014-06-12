"use strict";

var section = require('./section');
var async = require('async');

exports.get = function(dbinfo, ptKey, callback) {
    var secNames = dbinfo.sectionNames();
    var f = function(secName, cb) {
        section.get(dbinfo, secName, ptKey, cb);
    };
    async.map(secNames, f, function(err, sections) {
        if (err) {
            callback(err);
        } else {
            var result = secNames.reduce(function(r, secName, index) {
                r[secName] = sections[index];
                return r;
            }, {});
            callback(null, result);
        }
    });
};

exports.save = function(dbinfo, ptKey, ptRecord, sourceId, callback) {
    var f = function(name, cb) {
        section.save(dbinfo, name, ptKey, ptRecord[name], sourceId, cb);
    };
    async.map(dbinfo.sectionNames(), f, callback);
};
