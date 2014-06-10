"use strict";

var chai = require('chai');
var async = require('async');
var _ = require('underscore');
var util = require('util');

var db = require('../../lib/recordjs/db');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');

var expect = chai.expect;
chai.config.includeStack = true;

var sectionToType = exports.sectionToType = {
    testallergies: 'testallergy',
    testprocedures: 'testprocedure'    
};

var schemas = {
    testallergies: {
        name: String,
        severity: String,
        value: {
            code: String, 
            display: String
        }
    },
    testprocedures : {
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
        sectionToType: sectionToType,
        schemas: schemas,
        matchFields: {
            match: "string",
            percent: "number",
            diff: "string",
            subelements: null
        }
    };
};

var testObjectInstance = exports.testObjectInstance = {
    testallergies: function(suffix) {
        return {
            name: 'name' + suffix,
            severity: 'severity' + suffix,
            value: {
                code: 'code' + suffix, 
                display: 'display' + suffix
            }
        };
    },
    testprocedures: function(suffix) {
        return {
            name: 'name' + suffix,
            proc_type: 'proc_type' + suffix,
            proc_value: {
                code: 'code' + suffix, 
                display: 'display' + suffix
            }
        };
    }
};

var matchObjectInstance = exports.matchObjectInstance = {
    diff: function(suffix, entryIndex) {
        return {
            match: 'diff',
            diff: 'diff' + suffix
        }
    },
    partial: function(suffix, entryIndex) {
        return {
            match: 'partial',
            percent: (entryIndex + 1) * 10,
            diff: 'diff' + suffix            
        }
    },
   diffsub: function(suffix, entryIndex) {
        return {
            match: 'diff',
            diff: 'diff' + suffix,
            subelements: 'subelements' + suffix
        }
    },
    partialsub: function(suffix, entryIndex) {
        return {
            match: 'partial',
            percent: (entryIndex + 1) * 10,
            diff: 'diff' + suffix,
            subelements: 'subelements' + suffix
        }
    }    
};

var createStorage = function(context, pat, filename, index, callback) {
    storage.saveRecord(context.dbinfo, pat, 'content', {type: 'text/xml', name: filename}, 'ccda', function(err, result) {
        if (err) {
            callback(err);
        } else {
            expect(result).to.exist;
            expect(result._id).to.exist;
            if (! context.storageIds) {
                context.storageIds = {};
            }
            context.storageIds[index] = result._id;
            callback();
        }
    });
};

var createTestSection = exports.createTestSection = function(type, recordIndex, count) {
    return _.range(count).reduce(function(r, i) {
        var suffix = '_' + recordIndex + '.' + i;
        r[i] = testObjectInstance[type](suffix);
        return r;            
    }, []);
};

var newEntriesContextKey = exports.newEntriesContextKey = function(type, recordIndex) {
    return util.format("new.%s.%s", type, recordIndex);   
};

var partialEntriesContextKey = exports.partialEntriesContextKey = function(type, recordIndex) {
    return util.format("partial.%s.%s", type, recordIndex);   
};

exports.propertyToFilename = function(value) {
    var n = value.length;
    return util.format('c%s%s.xml', value.charAt(n-5), value.charAt(n-3));
}

var pushToContext = exports.pushToContext = function(context, keyGen, type, recordIndex, values) {
    if (values) {
        var key = keyGen(type, recordIndex);
        var r = context[key];
        if (! r) r = context[key] = [];
        Array.prototype.push.apply(r, values);
    }
};

var saveSection = exports.saveSection = function(context, type, patKey, recordIndex, count, callback) {
    var data = createTestSection(type, recordIndex, count);
    var sourceId = context.storageIds[recordIndex];
    section.save(context.dbinfo, type, patKey, data, sourceId, function(err, ids) {
        if (! err) {
            pushToContext(context, newEntriesContextKey, type, recordIndex, ids);
        }
        callback(err);
    });
};

exports.saveNewPartialSection = function(context, type, patKey, recordIndex, destRecordIndex, extraContent, callback) {
    var data = createTestSection(type, recordIndex, extraContent.length);
    var sourceId = context.storageIds[recordIndex];
    var key = newEntriesContextKey(type, destRecordIndex);
    var extendedData = data.reduce(function(r, e, index) {
        var v = {
            partial_array: e,
            partial_match: extraContent[index].matchObject,
            match_record_id: context[key][extraContent[index].destIndex]
        };
        r.push(v);
        return r;
    }, []);
    section.savePartial(context.dbinfo, type, patKey, extendedData, sourceId, function(err, result) {
        if (! err) {
            pushToContext(context, partialEntriesContextKey, type, recordIndex, result);
        }
        callback(err);
    });
};

var setConnectionContext = exports.setConnectionContext = function(dbName, context, callback) {
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

exports.prepareConnection = function(dbname, context) {
    return function() {
        before(function(done) {
            setConnectionContext(dbname, context, done)
        });

        it('check connection and models', function(done) {
            expect(context.dbinfo).to.exist;
            expect(context.dbinfo.db).to.exist;
            expect(context.dbinfo.grid).to.exist;
            expect(context.dbinfo.models).to.exist;
            expect(context.dbinfo.models.testallergies).to.exist;
            expect(context.dbinfo.models.testprocedures).to.exist;
            done();
        });
    }
};

var addRecordsPerPatient = exports.addRecordsPerPatient = function(context, countPerPatient, callback) {
    var fs = countPerPatient.reduce(function(r, fileCount, i) {
        var patKey = util.format('pat%d', i);
        return _.range(fileCount).reduce(function(q, j) {
            var filename = util.format('c%d%d.xml', i, j);
            var recordIndex = util.format('%d.%d', i, j);
            var f = function(cb) {createStorage(context, patKey, filename, recordIndex, cb);};
            q.push(f);
            return q;
        }, r);
        return r;
    }, []);

    async.parallel(fs, callback);
}

exports.createMatchInformation = function(recordIndex, destIndices, matchTypes) {
    return matchTypes.reduce(function(r, matchType, index) {
        var destIndex = destIndices[index];
        var suffix = '_' + recordIndex + '.' + destIndex;
        var v = {
            matchObject: matchObjectInstance[matchType](suffix, destIndex),
            destIndex: destIndex
        };
        r.push(v);
        return r;
    }, []);
}
