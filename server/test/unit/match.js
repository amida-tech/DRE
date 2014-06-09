"use strict";

var chai = require('chai');
var async = require('async');

var match = require('../../lib/recordjs/match');

var refmodel = require('./refModel')

var expect = chai.expect;
chai.config.includeStack = true;

describe('match.js methods', function() {
	var context = {}; // populated by refmodel common methods

    refmodel.prepareConnection('matchtest', context)();

    it('check match models', function(done) {
        expect(context.dbinfo.matchModels).to.exist;
        expect(context.dbinfo.matchModels.testallergies).to.exist;
        expect(context.dbinfo.matchModels.testprocedures).to.exist;
        done();
    });

    it('count (empty db)', function(done) {
        async.parallel([
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat0', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat0', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat1', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat1', {}, callback);},
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    results.forEach(function(result) {
                        expect(result).to.equal(0);
                    });
                    done();
                }
            }
        );
    });

    it('getAll (empty db)', function(done) {
        async.parallel([
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat0', 'name severity', 'filename', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat0', 'name proc_type', 'filename', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat1', 'name severity', 'filename', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name severity', 'filename', callback);},
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    results.forEach(function(result) {
                        expect(result).to.have.length(0);
                    });
                    done();
                }
            }
        );
    });

    it('add records', function(done) {
        refmodel.addRecordsPerPatient(context, [3, 3, 2, 2], done);
    });
    
    it('add sections', function(done) {
        async.parallel([
            function(callback) {refmodel.saveSection(context, 'testallergies', 'pat0', '0.0', 5, callback);},
            function(callback) {refmodel.saveSection(context, 'testallergies', 'pat2', '2.0', 3, callback);},
            function(callback) {refmodel.saveSection(context, 'testprocedures', 'pat0', '0.0', 3, callback);},
            function(callback) {refmodel.saveSection(context, 'testprocedures', 'pat1', '1.0', 5, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    it('count (db sections no partial sections)', function(done) {
        async.parallel([
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat1', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat1', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat2', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat2', {}, callback);},
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    results.forEach(function(result) {
                        expect(result).to.equal(0);
                    });
                    done();
                }
            }
        );
    });

    it('getAll (db sections no partial sections)', function(done) {
        async.parallel([
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat1', 'name severity', 'filename', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name proc_type', 'filename', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat2', 'name severity', 'filename', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat2', 'name severity', 'filename', callback);},
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    results.forEach(function(result) {
                        expect(result).to.have.length(0);
                    });
                    done();
                }
            }
        );
    });

    it('add partial sections', function(done) {
        var matchInfo0 = refmodel.createMatchInformation('0.1', [4, 0, 2], ['diff', 'partial', 'diffsub']);
        var matchInfo1 = refmodel.createMatchInformation('2.1', [1], ['diffsub']);
        var matchInfo2 = refmodel.createMatchInformation('0.1', [2], ['partialsub']);
        var matchInfo3 = refmodel.createMatchInformation('1.1', [1, 3], ['partial', 'diff']);
        var matchInfo4 = refmodel.createMatchInformation('1.2', [2, 4], ['partialsub', 'diffsub']);

        async.parallel([
            function(callback) {refmodel.saveNewPartialSection(context, 'testallergies', 'pat0', '0.1', '0.0', matchInfo0, callback);},
            function(callback) {refmodel.saveNewPartialSection(context, 'testallergies', 'pat2', '2.1', '2.0', matchInfo1, callback);},
            function(callback) {refmodel.saveNewPartialSection(context, 'testprocedures', 'pat0', '0.1', '0.0', matchInfo2, callback);},
            function(callback) {refmodel.saveNewPartialSection(context, 'testprocedures', 'pat1', '1.1', '1.0', matchInfo3, callback);},
            function(callback) {refmodel.saveNewPartialSection(context, 'testprocedures', 'pat1', '1.2', '1.0', matchInfo4, callback);},
            ], 
            function(err) {done(err);}
        );
    });

    it('count', function(done) {
        async.parallel([
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat0', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat0', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat1', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat1', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat2', {}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat2', {}, callback);},
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    var expected = [3, 1, 0, 4, 1, 0]
                    results.forEach(function(result, index) {
                        expect(result).to.equal(expected[index]);
                    });
                    done();
                }
            }
        );
    });

    it('getAll', function(done) {
        function verify(resultsById, recordIndex, index, destRecordIndex, destIndex, type, diffType) {
            var key = refmodel.partialEntriesContextKey(type, recordIndex);
            var id = context[key][index]._id;
            var result = resultsById[id];
            expect(result).to.exist;
        
            var suffix = '_' + recordIndex + '.' + index;
            expect(result.match_entry_id.name).to.equal('name' + suffix);
            var destSuffix = '_' + destRecordIndex + '.' + destIndex;
            expect(result.entry_id.name).to.equal('name' + destSuffix);
            expect(result.entry_type).to.equal(refmodel.sectionToType[type]);

            ['_id', '__v', 'entry_type', 'entry_id', 'match_entry_id', 'patKey'].forEach(function(p) {
                delete result[p];
            });
            
            var diffSuffix = '_' + recordIndex + '.' + destIndex;
            var diffExpect = refmodel.matchObjectInstance[diffType](diffSuffix, destIndex);
            delete diffExpect.match;
            expect(result).to.deep.equal(diffExpect);
        };

        async.parallel([
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat0', 'name severity', 'filename', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat2', 'name severity', 'filename', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat0', 'name proc_type', 'filename', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name proc_type', 'filename', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat2', 'name proc_type', 'filename', callback)}
            ],   
            function(err, results) {
                if (! err) {
                    var allResults = results[0].concat(results[1]).concat(results[2]).concat(results[3]).concat(results[4]);
                    expect(allResults).to.have.length(9);
                    var resultsById = allResults.reduce(function(r, result) {
                        r[result._id] = result;
                        return r;
                    }, {});
                    verify(resultsById, '0.1', 0, '0.0', 4, 'testallergies', 'diff');
                    verify(resultsById, '0.1', 1, '0.0', 0, 'testallergies', 'partial');
                    verify(resultsById, '0.1', 2, '0.0', 2, 'testallergies', 'diffsub');
                    verify(resultsById, '2.1', 0, '2.0', 1, 'testallergies', 'diffsub');

                    verify(resultsById, '0.1', 0, '0.0', 2, 'testprocedures', 'partialsub');
                    verify(resultsById, '1.1', 0, '1.0', 1, 'testprocedures', 'partial');
                    verify(resultsById, '1.1', 1, '1.0', 3, 'testprocedures', 'diff');
                    verify(resultsById, '1.2', 0, '1.0', 2, 'testprocedures', 'partialsub');
                    verify(resultsById, '1.2', 1, '1.0', 4, 'testprocedures', 'diffsub');
                }
                done(err);
            }
        );    
    });

    after(function(done) {
        context.dbinfo.db.dropDatabase();
        done();
    });
});
