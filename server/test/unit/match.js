"use strict";

var chai = require('chai');
var async = require('async');

var match = require('../../lib/recordjs/match');
var modelutil = require('../../lib/recordjs/modelutil');

var refmodel = require('./refmodel')

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

    var verifyMatchCount = function(addlMessage, expected) {
        return function() {
            it('count' + addlMessage, function(done) {
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
                            results.forEach(function(result, index) {
                                expect(result).to.equal(expected[index]);
                            });
                            done();
                        }
                    }
                );
            });
        }
    };

    verifyMatchCount(' (empty db)', [0, 0, 0, 0, 0, 0])();

    it('getAll (empty db)', function(done) {
        async.parallel([
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat0', 'name severity', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat0', 'name proc_type', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat1', 'name severity', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name severity', callback);},
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

    verifyMatchCount(' (db sections no partial sections)', [0, 0, 0, 0, 0, 0])();

    it('getAll (db sections no partial sections)', function(done) {
        async.parallel([
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat1', 'name severity', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name proc_type', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat2', 'name severity', callback);},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat2', 'name severity', callback);},
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

    verifyMatchCount(' (added partial sections)', [3, 1, 0, 4, 1, 0])();

    var verifyContent = function(resultsById, recordIndex, index, destRecordIndex, destIndex, type, diffType) {
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
        expect(result).to.deep.equal(diffExpect);
    };

    var callGetAll = function(callback) {
        async.parallel([
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat0', 'name severity', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testallergies', 'pat2', 'name severity', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat0', 'name proc_type', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat1', 'name proc_type', callback)},
            function(callback) {match.getAll(context.dbinfo, 'testprocedures', 'pat2', 'name proc_type', callback)}
            ],   
            function(err, results) {
                if (err) {
                    callback(err);
                } else {
                    var allResults = results[0].concat(results[1]).concat(results[2]).concat(results[3]).concat(results[4]);
                    var resultsById = allResults.reduce(function(r, result) {
                        r[result._id] = result;
                        return r;
                    }, {});
                    callback(null, allResults.length, resultsById);
                }
            }
        );                
    }; 

    it('getAll (added partial sections)', function(done) {
        callGetAll(function(err, totalCount, resultsById) {
            if (err) {
                done(err);
            } else {
                expect(totalCount).to.equal(9);

                verifyContent(resultsById, '0.1', 0, '0.0', 4, 'testallergies', 'diff');
                verifyContent(resultsById, '0.1', 1, '0.0', 0, 'testallergies', 'partial');
                verifyContent(resultsById, '0.1', 2, '0.0', 2, 'testallergies', 'diffsub');
                verifyContent(resultsById, '2.1', 0, '2.0', 1, 'testallergies', 'diffsub');

                verifyContent(resultsById, '0.1', 0, '0.0', 2, 'testprocedures', 'partialsub');
                verifyContent(resultsById, '1.1', 0, '1.0', 1, 'testprocedures', 'partial');
                verifyContent(resultsById, '1.1', 1, '1.0', 3, 'testprocedures', 'diff');
                verifyContent(resultsById, '1.2', 0, '1.0', 2, 'testprocedures', 'partialsub');
                verifyContent(resultsById, '1.2', 1, '1.0', 4, 'testprocedures', 'diffsub');

                done();
            }
        });
    });

    it('count (conditional)', function(done) {
        async.parallel([
            function(callback) {match.count(context.dbinfo, 'testallergies', 'pat0', {match: 'diff'}, callback);},
            function(callback) {match.count(context.dbinfo, 'testprocedures', 'pat1', {match: 'partial'}, callback);}
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    expect(results[0]).to.equal(2);
                    expect(results[1]).to.equal(2);
                    done();
                }
            }
        );
    });

    var cancelMatch = function(context, secName, recordKey, index, callback) {
        var key = refmodel.partialEntriesContextKey(secName, recordKey);
        var id = context[key][index]._id;
        match.cancel(context.dbinfo, secName, id, 'cancel_' + recordKey + '.' + index, callback);
    }

    it('cancel', function(done) {
        async.parallel([
            function(callback) {cancelMatch(context, 'testallergies', '0.1', 2, callback);},
            function(callback) {cancelMatch(context, 'testprocedures', '1.1', 0, callback);}
            ],
            function(err) {
                done(err);
            }
        );
    });

    verifyMatchCount(' (some canceled)', [2, 1, 0, 3, 1, 0])();

    var verifyDropped = function(resultsById, recordIndex, index, type) {
        var key = refmodel.partialEntriesContextKey(type, recordIndex);
        var id = context[key][index]._id;
        var result = resultsById[id];
        expect(result).to.not.exist;
    };

    it('getAll (some canceled)', function(done) {
        callGetAll(function(err, totalCount, resultsById) {
            if (err) {
                done(err);
            } else {
                expect(totalCount).to.equal(7);

                verifyContent(resultsById, '0.1', 0, '0.0', 4, 'testallergies', 'diff');
                verifyContent(resultsById, '0.1', 1, '0.0', 0, 'testallergies', 'partial');
                verifyDropped(resultsById, '0.1', 2, 'testallergies');
                verifyContent(resultsById, '2.1', 0, '2.0', 1, 'testallergies', 'diffsub');

                verifyContent(resultsById, '0.1', 0, '0.0', 2, 'testprocedures', 'partialsub');
                verifyDropped(resultsById, '1.1', 0, 'testprocedures');
                verifyContent(resultsById, '1.1', 1, '1.0', 3, 'testprocedures', 'diff');
                verifyContent(resultsById, '1.2', 0, '1.0', 2, 'testprocedures', 'partialsub');
                verifyContent(resultsById, '1.2', 1, '1.0', 4, 'testprocedures', 'diffsub');

                done();
            }
        });
    });

    var acceptMatch = function(context, secName, recordKey, index, callback) {
        var key = refmodel.partialEntriesContextKey(secName, recordKey);
        var id = context[key][index]._id;
        match.accept(context.dbinfo, secName, id, 'accept_' + recordKey + '.' + index, callback);
    }

    it('accept', function(done) {
        async.parallel([
            function(callback) {acceptMatch(context, 'testallergies', '2.1', 0, callback);},
            function(callback) {acceptMatch(context, 'testprocedures', '1.2', 1, callback);}
            ],
            function(err) {
                done(err);
            }
        );
    });

    verifyMatchCount(' (some accepted)', [2, 1, 0, 2, 0, 0])();

    it('getAll (some accepted)', function(done) {
        callGetAll(function(err, totalCount, resultsById) {
            if (err) {
                done(err);
            } else {
                expect(totalCount).to.equal(5);

                verifyContent(resultsById, '0.1', 0, '0.0', 4, 'testallergies', 'diff');
                verifyContent(resultsById, '0.1', 1, '0.0', 0, 'testallergies', 'partial');
                verifyDropped(resultsById, '0.1', 2, 'testallergies');
                verifyDropped(resultsById, '2.1', 0, 'testallergies');

                verifyContent(resultsById, '0.1', 0, '0.0', 2, 'testprocedures', 'partialsub');
                verifyDropped(resultsById, '1.1', 0, 'testprocedures');
                verifyContent(resultsById, '1.1', 1, '1.0', 3, 'testprocedures', 'diff');
                verifyContent(resultsById, '1.2', 0, '1.0', 2, 'testprocedures', 'partialsub');
                verifyDropped(resultsById, '1.2', 1, 'testprocedures');

                done();
            }
        });
    });

    var callGet = function(type, recordIndex, index, callback) {
        var key = refmodel.partialEntriesContextKey(type, recordIndex);
        var id = context[key][index]._id;
        match.get(context.dbinfo, type, id, callback);
    };

    var verifyGetContent = function(result, recordIndex, index, destRecordIndex, destIndex, type, diffType, reason) {
        expect(result).to.exist;
    
        var suffix = '_' + recordIndex + '.' + index;
        var entry = refmodel.testObjectInstance[type](suffix);
        var resultEntry = modelutil.mongooseToBBModelDocument(result.match_entry_id);
        delete resultEntry.__v;
        delete resultEntry.reviewed;
        delete resultEntry.archived;
        expect(resultEntry).to.deep.equal(entry);

        var destSuffix = '_' + destRecordIndex + '.' + destIndex;
        var destEntry = refmodel.testObjectInstance[type](destSuffix);
        var destResultEntry = modelutil.mongooseToBBModelDocument(result.entry_id);
        delete destResultEntry.__v;
        delete destResultEntry.reviewed;
        delete resultEntry.archived;        
        expect(destResultEntry).to.deep.equal(destEntry);

        if (reason) {
            expect(result.determination).to.equal(reason + suffix);
        } else {
            expect(result.determination).to.not.exist;
        }

        ['_id', '__v', 'entry_type', 'entry_id', 'match_entry_id', 'patKey', 'determination'].forEach(function(p) {
            delete result[p];
        });
        
        var diffSuffix = '_' + recordIndex + '.' + destIndex;
        var diffExpect = refmodel.matchObjectInstance[diffType](diffSuffix, destIndex);
        expect(result).to.deep.equal(diffExpect);
    };

    it('get', function(done) {
        async.parallel([
            function(callback) {callGet('testallergies', '0.1', 0, callback);},
            function(callback) {callGet('testallergies', '0.1', 1, callback);},
            function(callback) {callGet('testallergies', '0.1', 2, callback);},
            function(callback) {callGet('testallergies', '2.1', 0, callback);},
            function(callback) {callGet('testprocedures', '0.1', 0, callback);},
            function(callback) {callGet('testprocedures', '1.1', 0, callback);},
            function(callback) {callGet('testprocedures', '1.1', 1, callback);},
            function(callback) {callGet('testprocedures', '1.2', 0, callback);},
            function(callback) {callGet('testprocedures', '1.2', 1, callback);},
            ], 
            function(err, results) {
                if (err) {
                    done(err);
                } else {
                    verifyGetContent(results[0], '0.1', 0, '0.0', 4, 'testallergies', 'diff');
                    verifyGetContent(results[1], '0.1', 1, '0.0', 0, 'testallergies', 'partial');
                    verifyGetContent(results[2], '0.1', 2, '0.0', 2, 'testallergies', 'diffsub', 'cancel');
                    verifyGetContent(results[3], '2.1', 0, '2.0', 1, 'testallergies', 'diffsub', 'accept');
                    verifyGetContent(results[4], '0.1', 0, '0.0', 2, 'testprocedures', 'partialsub');
                    verifyGetContent(results[5], '1.1', 0, '1.0', 1, 'testprocedures', 'partial', 'cancel');
                    verifyGetContent(results[6], '1.1', 1, '1.0', 3, 'testprocedures', 'diff');
                    verifyGetContent(results[7], '1.2', 0, '1.0', 2, 'testprocedures', 'partialsub');
                    verifyGetContent(results[8], '1.2', 1, '1.0', 4, 'testprocedures', 'diffsub', 'accept');
                    
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
