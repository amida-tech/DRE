"use strict";

var chai = require('chai');
var util = require('util')
var path = require('path');
var async = require('async');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var entry = require('../../lib/recordjs/entry');
var storage = require('../../lib/recordjs/storage');

var refmodel = require('./refModel');

var expect = chai.expect;
chai.config.includeStack = true;

describe('merge.js methods', function() {
    var context = {};

    refmodel.prepareConnection('mergetest', context)();

    it('check merge models', function(done) {
        expect(context.dbinfo.mergeModels).to.exist;
        expect(context.dbinfo.mergeModels.testallergies).to.exist;
        expect(context.dbinfo.mergeModels.testprocedures).to.exist;
        done();
    });
    
    it('count empty testallergies', function(done) {
        merge.count(context.dbinfo, 'testallergies', 'pat0', {}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(count).to.equal(0);
                done();
            }
        });
     });
    
    it('count empty testprocedures', function(done) {
        merge.count(context.dbinfo, 'testprocedures', 'pat0', {}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(count).to.equal(0);
                done();
            }
        });
    });
    
    it('add records', function(done) {
        refmodel.addRecordsPerPatient(context, [3, 3, 1], done);
    });
    
    it('add sections', function(done) {
        async.parallel([
            function(callback) {refmodel.saveSection(context, 'testallergies', 'pat0', '0.0', 2, callback);},
            function(callback) {refmodel.saveSection(context, 'testallergies', 'pat2', '2.0', 3, callback);},
            function(callback) {refmodel.saveSection(context, 'testprocedures', 'pat0', '0.0', 2, callback);},
            function(callback) {refmodel.saveSection(context, 'testprocedures', 'pat1', '1.0', 3, callback);},
            ], 
            function(err) {done(err);}
        );
    });
    
    it('getAll (field specification)', function(done) {
        async.parallel([
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat0', 'name severity', 'filename', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat1', 'name', 'filename', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat2', 'name value.code',  'filename metadata.fileClass', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat0', 'name proc_type', 'filename', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name proc_value.display', 'filename', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat2', 'name', 'filename', callback);},
            ],
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    var r0 = results[0];
                    expect(r0).to.have.length(2);
                    expect([r0[0].entry_id.name, r0[1].entry_id.name]).to.include.members(['name_0.0.0', 'name_0.0.1']);
                    expect([r0[0].entry_id.severity, r0[1].entry_id.severity]).to.include.members(['severity_0.0.0', 'severity_0.0.1']);
                    for (var i=0; i<2; ++i) {
                        expect(r0[i].record_id.filename).to.equal('c00.xml');
                        expect(r0[i].entry_type).to.equal('testallergy');
                        expect(r0[i].merge_reason).to.equal('new');
                        expect(r0[i].patKey).to.equal('pat0');
                    }
            
                    expect(results[1]).to.have.length(0);

                    var r2 = results[2];
                    expect(r2).to.have.length(3);
                    expect([r2[0].entry_id.name, r2[1].entry_id.name, r2[2].entry_id.name]).to.include.members(['name_2.0.0', 'name_2.0.1', 'name_2.0.2']);
                    expect([r2[0].entry_id.value.code, r2[1].entry_id.value.code, r2[2].entry_id.value.code]).to.include.members(['code_2.0.0', 'code_2.0.1', 'code_2.0.2']);
                    for (var i=0; i<3; ++i) {
                        expect(r2[i].record_id.filename).to.equal('c20.xml');
                        expect(r2[i].record_id.metadata.fileClass).to.equal('ccda');
                        expect(r2[i].entry_type).to.equal('testallergy');
                        expect(r2[i].merge_reason).to.equal('new');
                        expect(r2[i].patKey).to.equal('pat2');
                    }
           
                    var r3 = results[3];
                    expect(r3).to.have.length(2);
                    expect([r3[0].entry_id.name, r3[1].entry_id.name]).to.include.members(['name_0.0.0', 'name_0.0.1']);
                    expect([r3[0].entry_id.proc_type, r3[1].entry_id.proc_type]).to.include.members(['proc_type_0.0.0', 'proc_type_0.0.1']);
                    for (var i=0; i<2; ++i) {
                        expect(r3[i].record_id.filename).to.equal('c00.xml');
                        expect(r3[i].entry_type).to.equal('testprocedure');
                        expect(r3[i].merge_reason).to.equal('new');
                        expect(r3[i].patKey).to.equal('pat0');
                    }
            
                    var r4 = results[4];
                    expect(r4).to.have.length(3);
                    expect([r4[0].entry_id.name, r4[1].entry_id.name, r4[2].entry_id.name]).to.include.members(['name_1.0.0', 'name_1.0.1', 'name_1.0.2']);
                    expect([r4[0].entry_id.proc_value.display, r4[1].entry_id.proc_value.display, r4[2].entry_id.proc_value.display]).to.include.members(['display_1.0.0', 'display_1.0.1', 'display_1.0.2']);
                    for (var i=0; i<3; ++i) {
                        expect(r4[i].record_id.filename).to.equal('c10.xml');
                        expect(r4[i].entry_type).to.equal('testprocedure');
                        expect(r4[i].merge_reason).to.equal('new');
                        expect(r4[i].patKey).to.equal('pat1');
                    }

                    expect(results[5]).to.have.length(0);

                    done();
                }
            }
        );
    });

    var verifyGetAll = function(context, resultsById, type, recordIndex, index) {
        var key = refmodel.newEntriesContextKey(type, recordIndex);
        var id = context[key][index];
        var result = resultsById[id];

        expect(result).to.exist;
        expect(result.record_id._id.toString()).to.equal(context.storageIds[recordIndex].toString());
    };

    var verifyGetAllNegative = function(context, resultsById, type, recordIndex, index) {
        var key = refmodel.newEntriesContextKey(type, recordIndex);
        var id = context[key][index];
        var result = resultsById[id];

        expect(result).to.not.exist;
    };

    var callGetAll = function(callback) {
        async.parallel([
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat0', '_id', '_id', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat1', '_id', '_id', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat2', '_id', '_id', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat0', '_id', '_id', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat1', '_id', '_id', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat2', '_id', '_id', callback);},
            ],
            function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    var allResults = results[0].concat(results[1]).concat(results[2]).concat(results[3]).concat(results[4]).concat(results[5]);
                    var resultsById = allResults.reduce(function(r, result) {
                        var mr = result.merge_reason;
                        r[mr][result.entry_id._id] = result;
                        return r;
                    }, {new: {}, duplicate:{}});
                    callback(null, resultsById);
                }
            }
        );
    }

    it('getAll (section only)', function(done) {
        callGetAll(function(err, resultsById) {
            if (err) {
                done(err);
            } else {
                verifyGetAll(context, resultsById.new, 'testallergies', '0.0', 0);
                verifyGetAllNegative(context, resultsById.duplicate, 'testallergies', '0.0', 0);
                verifyGetAll(context, resultsById.new, 'testallergies', '0.0', 1);
                verifyGetAllNegative(context, resultsById.duplicate, 'testallergies', '0.0', 1);
                verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 0);
                verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 1);
                verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 2);
                verifyGetAll(context, resultsById.new, 'testprocedures', '0.0', 0);
                verifyGetAll(context, resultsById.new, 'testprocedures', '0.0', 1);
                verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 0);
                verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 1);
                verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 2);
                verifyGetAllNegative(context, resultsById.new, 'testprocedures', '1.0', 3);
                done();
            }
        });
    });

    var duplicateEntry = function(context, type, recordIndex, index, callback) {
        var key = refmodel.newEntriesContextKey(type, recordIndex);
        var id = context[key][index];
        var rid = context.storageIds[recordIndex];
        entry.duplicate(context.dbinfo, type, id, rid, callback);
    };

    it('add duplicates', function(done) {
        async.parallel([
            function(callback) {duplicateEntry(context, 'testallergies', '0.0', 1, callback);},
            function(callback) {duplicateEntry(context, 'testprocedures', '1.0', 0, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    var verifyWithDuplicate = function(addlMessage) {
        return function() {
            it('getAll' + addlMessage, function(done) {
                callGetAll(function(err, resultsById) {
                    if (err) {
                        done(err);
                    } else {
                        verifyGetAll(context, resultsById.new, 'testallergies', '0.0', 0);
                        verifyGetAllNegative(context, resultsById.duplicate, 'testallergies', '0.0', 0);
                        verifyGetAll(context, resultsById.new, 'testallergies', '0.0', 1);
                        verifyGetAll(context, resultsById.duplicate, 'testallergies', '0.0', 1);
                        verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 0);
                        verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 1);
                        verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 2);
                        verifyGetAll(context, resultsById.new, 'testprocedures', '0.0', 0);
                        verifyGetAll(context, resultsById.new, 'testprocedures', '0.0', 1);
                        verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 0);
                        verifyGetAll(context, resultsById.duplicate, 'testprocedures', '1.0', 0);
                        verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 1);
                        verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 2);
                        verifyGetAllNegative(context, resultsById.new, 'testprocedures', '1.0', 3);
                        done();
                    }
                });
            });
        };        
    }

    verifyWithDuplicate(' (with duplicate)')();

    it('add partial sections', function(done) {
        var matchInfo0 = refmodel.createMatchInformation('0.1', [0], ['diff']);
        var matchInfo1 = refmodel.createMatchInformation('0.1', [1], ['diff']);
        var matchInfo2 = refmodel.createMatchInformation('1.1', [1], ['partial']);
        var matchInfo3 = refmodel.createMatchInformation('1.2', [2], ['partial']);

        async.parallel([
            function(callback) {refmodel.savePartialSection(context, 'testallergies', 'pat0', '0.1', '0.0', matchInfo0, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testprocedures', 'pat0', '0.1', '0.0', matchInfo1, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testprocedures', 'pat1', '1.1', '1.0', matchInfo2, callback);},
            function(callback) {refmodel.savePartialSection(context, 'testprocedures', 'pat1', '1.2', '1.0', matchInfo3, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    verifyWithDuplicate(' (after partial)')();

    it('cancel some partials', function(done) {
        async.parallel([
            function(callback) {refmodel.cancelMatch(context, 'testallergies', '0.1', 0, callback);},
            function(callback) {refmodel.cancelMatch(context, 'testprocedures', '1.1', 0, callback);}
            ],
            function(err) {
                done(err);
            }
        );
    });

    verifyWithDuplicate(' (after cancel)')();

    it('accept some partials', function(done) {
        async.parallel([
            function(callback) {refmodel.acceptMatch(context, 'testprocedures', '0.1', 0, callback);},
            function(callback) {refmodel.acceptMatch(context, 'testprocedures', '1.2', 0, callback);}
            ],
            function(err) {
                done(err);
            }
        );
    });
    
    var verifyGetAllPartial = function(context, resultsById, type, recordIndex, index) {
        var key = refmodel.partialEntriesContextKey(type, recordIndex);
        var id = context[key][index].match_entry_id;
        var result = resultsById[id];

        expect(result).to.exist;
        expect(result.record_id._id.toString()).to.equal(context.storageIds[recordIndex].toString());
    };

    var verifyGetAllPartialNegative = function(context, resultsById, type, recordIndex, index) {
        var key = refmodel.partialEntriesContextKey(type, recordIndex);
        var id = context[key][index].match_entry_id;
        var result = resultsById[id];

        expect(result).to.not.exist;
    };

    it('getAll (after accept)', function(done) {
        callGetAll(function(err, resultsById) {
            if (err) {
                done(err);
            } else {
                verifyGetAll(context, resultsById.new, 'testallergies', '0.0', 0);
                verifyGetAllNegative(context, resultsById.duplicate, 'testallergies', '0.0', 0);
                verifyGetAll(context, resultsById.new, 'testallergies', '0.0', 1);
                verifyGetAll(context, resultsById.duplicate, 'testallergies', '0.0', 1);
                verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 0);
                verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 1);
                verifyGetAll(context, resultsById.new, 'testallergies', '2.0', 2);
                verifyGetAll(context, resultsById.new, 'testprocedures', '0.0', 0);
                verifyGetAll(context, resultsById.new, 'testprocedures', '0.0', 1);
                verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 0);
                verifyGetAll(context, resultsById.duplicate, 'testprocedures', '1.0', 0);
                verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 1);
                verifyGetAll(context, resultsById.new, 'testprocedures', '1.0', 2);
                verifyGetAllNegative(context, resultsById.new, 'testprocedures', '1.0', 3);
                verifyGetAllPartialNegative(context, resultsById.new, 'testallergies', '0.1', 0);
                verifyGetAllPartialNegative(context, resultsById.new, 'testprocedures', '1.1', 0);
                verifyGetAllPartial(context, resultsById.new, 'testprocedures', '0.1', 0);
                verifyGetAllPartial(context, resultsById.new, 'testprocedures', '1.2', 0);
                done();
            }
        });
    });

    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});