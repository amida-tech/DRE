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

describe('merges', function() {
    var context = {};

    var newMergeIds = {};

    var updateDuplicate = function(patKey, type, recordIndex, callback) {
        section.get(context.dbinfo, type, patKey, function(err, docs) {
            var fs = [];
            var rid = context.storageIds[recordIndex];
            docs.forEach(function(doc) {
                var f = function(cb) {entry.duplicate(context.dbinfo, type, doc._id, rid, cb)};
                fs.push(f);
            });
            async.parallel(fs, function(err) {callback(err);});
        });
    };
    
    refmodel.prepareConnection('mergetest', context)();

    it('connection match models', function(done) {
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
    
    it('add new storage', function(done) {
        refmodel.addRecordsPerPatient(context, [3, 2, 1], done);
    });
    
    it('add allergies and procedures', function(done) {
        async.parallel([
            function(callback) {refmodel.saveNewTestSection(context, 'testallergies', 'pat0', '0.0', 2, callback);},
            function(callback) {refmodel.saveNewTestSection(context, 'testallergies', 'pat2', '2.0', 3, callback);},
            function(callback) {refmodel.saveNewTestSection(context, 'testprocedures', 'pat0', '0.0', 2, callback);},
            function(callback) {refmodel.saveNewTestSection(context, 'testprocedures', 'pat1', '1.0', 3, callback);},
            ], 
            function(err) {done(err);}
        );
    });
    
    it('merge.getAll (new)', function(done) {
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
                        newMergeIds[r0[i]._id] = true;
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
                        newMergeIds[r2[i]._id] = true;
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
                        newMergeIds[r3[i]._id] = true;
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
                        newMergeIds[r4[i]._id] = true;
                    }

                    expect(results[5]).to.have.length(0);

                    done();
                }
            }
        );
    });
    
    it('allergy/procedure add duplicates', function(done) {
        async.parallel([
            function(callback) {updateDuplicate('pat0', 'testallergies', '0.1', callback);},
            function(callback) {updateDuplicate('pat0', 'testprocedures', '0.1', callback);},
            ], 
            function(err) {done(err);}
        );
    });
    
    it ('merge.getAll (duplicate)', function(done) {
        async.parallel([
            function(callback) {merge.getAll(context.dbinfo, 'testallergies', 'pat0', 'name', 'filename', callback);},
            function(callback) {merge.getAll(context.dbinfo, 'testprocedures', 'pat0', 'name', 'filename', callback);},
            ],
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    var f = function(r, type) {
                        expect(r).to.have.length(4);
                        expect(['name_0.0.0', 'name_0.0.1']).to.include.members([r[0].entry_id.name, r[1].entry_id.name, r[2].entry_id.name, r[3].entry_id.name]);
                        for (var i=0; i<4; ++i) {
                            if (newMergeIds[r[i]._id]) {
                                expect(r[i].record_id.filename).to.equal('c00.xml');
                                expect(r[i].merge_reason).to.equal('new');
                            } else {
                                expect(r[i].record_id.filename).to.equal('c01.xml');
                                expect(r[i].merge_reason).to.equal('duplicate');
                        
                            }
                            expect(r[i].patKey).to.equal('pat0');
                            expect(r[i].entry_type).to.equal(type);
                        }
                    };
                    f(results[0], 'testallergy');
                    f(results[1], 'testprocedure');
                    done();
                }
            }
        );
    });
    
    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});