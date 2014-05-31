var chai = require('chai');
var util = require('util')
var path = require('path');
var async = require('async');

var db = require('../../lib/recordjs/db');
var merge = require('../../lib/recordjs/merge');
var section = require('../../lib/recordjs/section');
var storage = require('../../lib/recordjs/storage');

var expect = chai.expect;
var assert = chai.assert;

describe('merges', function() {
    var dbinfo = null;
    var storageIds = {};
    var newMergeIds = {};

    var createStorage = function(pat, filename, index, callback) {
        storage.saveRecord(dbinfo, pat, 'content', {type: 'text/xml', name: filename}, 'ccda', function(err, result) {
            if (err) {
                callback(err);
            } else {
                assert.notOk(err, 'storage error');
                assert.ok(result, 'result error');
                assert.ok(result._id, 'result._id error');
                storageIds[index] = result._id;
                callback();
            }
        });
    };
    
    var createAllergies = function(patKey, recordIndex, count, callback) {
        var data = [];
        for (var i=0; i<count; ++i) {
            var suffix = '_' + recordIndex + '.' + i;
            data[i] = {
                name: 'name' + suffix,
                severity: 'severity' + suffix,
                value: {code: 'code' + suffix, display: 'display' + suffix}
            }    
        };
        section.saveNewEntries(dbinfo, 'testallergy', patKey, data, storageIds[recordIndex], callback);
    };
    
    var createProcedures = function(patKey, recordIndex, count, callback) {
        var data = [];
        for (var i=0; i<count; ++i) {
            var suffix = '_' + recordIndex + '.' + i;
            data[i] = {
                name: 'name' + suffix,
                proc_type: 'proc_type' + suffix,
                proc_value: {code: 'code' + suffix, display: 'display' + suffix}
            }    
        };
        section.saveNewEntries(dbinfo, 'testprocedure', patKey, data, storageIds[recordIndex], callback);
    };
    
    var updateDuplicate = function(patKey, type, recordIndex, callback) {
        section.getSection(dbinfo, type, patKey, function(err, docs) {
            var fs = [];
            var rid = storageIds[recordIndex];
            docs.forEach(function(doc) {
                var f = function(cb) {section.addEntryMergeEntry(dbinfo, type, doc._id, {record_id: rid, merge_reason: 'duplicate'}, cb)};
                fs.push(f);
            });
            async.parallel(fs, function(err) {callback(err);});
        });
    };
    
    before(function(done) {
        var options = {
            dbName: 'mergestest',
            typeToSection: {},
            typeToSchemaDesc: {}
        };
        
        var typeToSection = {};
        typeToSection.testallergy = 'testallergies';
        typeToSection.testprocedure = 'testprocedures';
        options.typeToSection = typeToSection;
        
        var typeToSchemaDesc = {}
        typeToSchemaDesc.testallergy = {
            name: String,
            severity: String,
            value: {code: String, display: String}
        }
        typeToSchemaDesc.testprocedure = {
            name: String,
            proc_type: String,
            proc_value: {code: String, display: String}
        }
        options.typeToSchemaDesc = typeToSchemaDesc;
        
        db.connect('localhost', options, function(err, result) {
            if (err) {
                done(err);
            } else {
                dbinfo = result;
                done();
            }
        });
    });

    it('dbinfo check', function(done) {
        assert.ok(dbinfo, 'no dbinfo');
        assert.ok(dbinfo.db, 'no dbinfo.db');
        assert.ok(dbinfo.grid, 'no dbinfo');
        assert.ok(dbinfo.models, 'no dbinfo.models');
        assert.ok(dbinfo.mergeModels, 'no dbinfo.mergeModels');
        assert.ok(dbinfo.storageModel, 'no dbinfo.storageModel');
        assert.ok(dbinfo.models.testallergy, 'no dbinfo.models.testallergy');
        assert.ok(dbinfo.mergeModels.testallergy, 'no dbinfo.mergeModels.testallergy');
        assert.ok(dbinfo.models.testprocedure, 'no dbinfo.models.testprocedure');
        assert.ok(dbinfo.mergeModels.testprocedure, 'no dbinfo.mergeModels.testprocedure');
        done();
    });
    
    it('count empty testallergy', function(done) {
        merge.count(dbinfo, 'testallergy', {}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(count).to.equal(0);
                done();
            }
        });
     });
    
    it('count empty testprocedure', function(done) {
        merge.count(dbinfo, 'testprocedure', {}, function(err, count) {
            if (err) {
                done(err);
            } else {
                expect(count).to.equal(0);
                done();
            }
        });
     });
    
    it('storage creation', function(done) {
        async.parallel([
            function(callback) {createStorage('pat0', 'c00.xml', '0.0', callback);},
            function(callback) {createStorage('pat0', 'c01.xml', '0.1', callback);},
            function(callback) {createStorage('pat0', 'c02.xml', '0.2', callback);},
            function(callback) {createStorage('pat1', 'c10.xml', '1.0', callback);},
            function(callback) {createStorage('pat1', 'c11.xml', '1.1', callback);},
            function(callback) {createStorage('pat2', 'c20.xml', '2.0', callback);}
            ], 
            function(err) {done(err);}
        );
    });
    
    it('allergy/procedure add new', function(done) {
        async.parallel([
            function(callback) {createAllergies('pat0', '0.0', 2, callback);},
            function(callback) {createAllergies('pat2', '2.0', 3, callback);},
            function(callback) {createProcedures('pat0', '0.0', 2, callback);},
            function(callback) {createProcedures('pat1', '1.0', 3, callback);},
            ], 
            function(err) {done(err);}
        );
    });
    
    it ('merge.getMerges (new)', function(done) {
        async.parallel([
            function(callback) {merge.getMerges(dbinfo, 'pat0', 'testallergy', 'name severity', 'filename', callback);},
            function(callback) {merge.getMerges(dbinfo, 'pat1', 'testallergy', 'name', 'filename', callback);},
            function(callback) {merge.getMerges(dbinfo, 'pat2', 'testallergy', 'name value.code',  'filename metadata.fileClass', callback);},
            function(callback) {merge.getMerges(dbinfo, 'pat0', 'testprocedure', 'name proc_type', 'filename', callback);},
            function(callback) {merge.getMerges(dbinfo, 'pat1', 'testprocedure', 'name proc_value.display', 'filename', callback);},
            function(callback) {merge.getMerges(dbinfo, 'pat2', 'testprocedure', 'name', 'filename', callback);},
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
            function(callback) {updateDuplicate('pat0', 'testallergy', '0.1', callback);},
            function(callback) {updateDuplicate('pat0', 'testprocedure', '0.1', callback);},
            ], 
            function(err) {done(err);}
        );
    });
    
    it ('merge.getMerges (duplicate)', function(done) {
        async.parallel([
            function(callback) {merge.getMerges(dbinfo, 'pat0', 'testallergy', 'name', 'filename', callback);},
            function(callback) {merge.getMerges(dbinfo, 'pat0', 'testprocedure', 'name', 'filename', callback);},
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
        dbinfo.db.dropDatabase();
        done();
    });
});