"use strict";
/*jshint -W117 */


var chai = require('chai');
var util = require('util');
var path = require('path');

var db = require('../../lib/recordjs/db');
var storage = require('../../lib/recordjs/storage');

var expect = chai.expect;

describe('storage.js methods', function() {
    this.timeout(5000);
    var dbinfo = null;
    var ids = [];

    var sizes = [5, 250000, 10, 15, 20, 25];
    var types = ['xml', 'bin', 'bin', 'xml', 'xml', 'bin'];
    var pats = ['pat1', 'pat1', 'pat1', 'pat2', 'pat2', 'pat3'];
    var classes = ['ccda', undefined, 'ccda', null, 'ccda', undefined];
    var contents = [];

    var getContentType = function(index) {
        if (types[index] === 'xml') {
            return 'text/xml';
        } else {
            return 'binary/octet-stream';
        }
    };

    var getFileName = function(index) {
        return 'c' + index + '.' + types[index];
    };

    var createFileContent = function(index) {
        var content = "<root\n";
        for (var i = 0; i < sizes[index]; ++i) {
            var line = util.format('a%s=d%s\n', i, i);
            content += line;
        }
        content += '/>\n';
        return content;
    };

    before(function(done) {
        for (var i = 0; i < 6; ++i) {
            contents[i] = createFileContent(i);
        }
        var options = {
            dbName: 'storagetest',
            sectionToType: {},
            typeToSchemaDesc: {}
        };
        db.connect('localhost', options, function(err, result) {
            if (err) {
                done(err);
            } else {
                dbinfo = result;
                done();
            }
        });
    });

    it('check connection and models', function(done) {
        expect(dbinfo).to.exist;
        expect(dbinfo.db).to.exist;
        expect(dbinfo.grid).to.exist;
        expect(dbinfo.storageModel).to.exist;
        done();
    });

    it('saveRecord', function(done) {
        var f = function(fullCount, index, callback) {
            var fileinfo = {
                name: getFileName(index),
                type: getContentType(index)
            };
            storage.saveRecord(dbinfo, pats[index], contents[index], fileinfo, classes[index], function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    ids[index] = result._id;
                    var count = 0;
                    for (var j = 0; j < fullCount; ++j) {
                        if (ids[j]) {
                            ++count;
                        }
                    }
                    if (count === fullCount) {
                        callback();
                    }
                }
            });
        };

        var e=function(err){done(err);};

        for (var i = 0; i < 6; ++i) {
            f(6, i, e);
        }
    });

    it('getRecordList', function(done) {
        var count = 0;
        var f = function(start, end) {
            storage.getRecordList(dbinfo, pats[start], function(err, result) {
                var n = result.length;
                expect(n).to.equal(end - start);
                for (var i = start; i < end; ++i) {
                    var r = result[i - start];
                    var index = -1;
                    for (var j = 0; j < 6; ++j) {
                        if (ids[j].equals(r.file_id)) {
                            index = j;
                            break;
                        }
                    }
                    expect(index).to.not.equal(-1);
                    expect(r).to.exist;
                    expect(r.file_name).to.equal(getFileName(index));
                    expect(r.file_mime_type).to.equal(getContentType(index));
                    expect(r.patient_key).to.equal(pats[index]);
                    if (classes[index]) {
                        expect(r.file_class).to.equal(classes[index]);
                    } else {
                        expect(r.file_class).to.not.exist;
                    }
                }
                ++count;
                if (count === 3) {
                    done();
                }
            });
        };
        f(0, 3);
        f(3, 5);
        f(5, 6);
    });

    it('getRecord', function(done) {
        var count = 0;
        var f = function(index) {
            storage.getRecord(dbinfo, ids[index].toString(), function(err, filename, content) {
                if (err) {
                    done(err);
                } else {
                    expect(filename).to.equal(getFileName(index));
                    var expectedContent = contents[index];
                    expect(content).to.equal(expectedContent);
                    ++count;
                    if (count === 6) {
                        done();
                    }
                }
            });
        };
        for (var i = 0; i < 6; ++i) {
            f(i);
        }
    });

    it('recordCount', function(done) {
        var count = 0;
        var doneIf3 = function() {
            ++count;
            if (count === 4) {
                done();
            }
        };
        var f = function(pat, expected) {
            storage.recordCount(dbinfo, pat, function(err, num) {
                if (err) {
                    done(err);
                } else {
                    expect(num).to.equal(expected);
                    doneIf3();
                }
            });
        };
        f('pat1', 3);
        f('pat2', 2);
        f('pat3', 1);
        f('patnone', 0);
    });

    after(function(done) {
        dbinfo.db.dropDatabase();
        done();
    });
});
