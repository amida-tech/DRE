"use strict";

var chai = require('chai');
var async = require('async');
var path = require('path');
var fs = require('fs');

var bb = require('blue-button');

var bbr = require('../../lib/recordjs');

var expect = chai.expect;
chai.config.includeStack = true;

xdescribe('API', function() {
	var ccd = null;
	var dbinfo = null;

	var sourceIds = null;
	var allergyIds = null;

    before(function(done) {
        var filepath  = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
        var xml = fs.readFileSync(filepath, 'utf-8');
        var result = bb.parseString(xml);
        ccd = result.data;
        done();
    });

    var dropCollections = function(done) {
    	var collections = Object.keys(dbinfo.connection.collections);
    	async.forEach(collections, function(collectionName, cb) {
      		var collection = dbinfo.connection.collections[collectionName]
      		collection.drop(function(err) {
        		if (err && err.message != 'ns not found') {
        			cb(err);
        		} else {
	        		cb(null);
	        	}
      		});
    	}, done);
    };

    it('connectDatabase', function(done) {
		bbr.connectDatabase('localhost', function(err, result) {
			if (err) {
				done(err);
			} else {
				dbinfo = result;
				expect(dbinfo).to.exist;
				dropCollections(done);
			}
		});
    });

    it('saveRecord', function(done) {
        var fileInfo = [
        	{name: 'ccd_0.xml', type: 'text/xml'},
        	{name: 'ccd_1.xml', type: 'text/xml'},
        	{name: 'ccd_2.xml', type: 'text/xml'},
        	{name: 'ccd_3.xml', type: 'text/xml'},
        	{name: 'ccd_4.xml', type: 'text/xml'},
        	{name: 'ccd_5.xml', type: 'text/xml'}
        ];
    	async.parallel([
    		function(cb) {bbr.saveRecord('pat0', 'content0', fileInfo[0], 'ccda', cb);},
    		function(cb) {bbr.saveRecord('pat0', 'content1', fileInfo[1], 'ccda', cb);},
    		function(cb) {bbr.saveRecord('pat0', 'content2', fileInfo[2], 'ccda', cb);},
    		function(cb) {bbr.saveRecord('pat1', 'content3', fileInfo[3], 'ccda', cb);},
    		function(cb) {bbr.saveRecord('pat2', 'content4', fileInfo[4], 'ccda', cb);},
    		function(cb) {bbr.saveRecord('pat3', 'content5', fileInfo[5], 'ccda', cb);}
    		],
    		function(err, results) {
    			if (err) {
    				done(err);
    			} else {
    				sourceIds = results.reduce(function(r, result) {
    					var v = result._id.toString();
    					r.push(v);
    					return r;
    				}, []);
    				expect(sourceIds).to.have.length(6);
    				sourceIds.forEach(function(sourceId) {
    					expect(sourceId).to.exist;
    				});
    				done();
    			}   			
    		}
    	);
    });

	it('getRecordList', function(done) {
		bbr.getRecordList('pat0', function(err, results) {
			if (err) {
				done(err);
			} else {
				var actual = results.map(function(result) {
					return result.file_id.toString();
				});
				actual.sort();
				var expected = sourceIds.slice(0, 3);
				expected.sort();;
				expect(actual).to.deep.equal(expected);
				done();
			}
		});
	});

	it('getRecord', function(done) {
		bbr.getRecord(sourceIds[0], function(err, filename, content) {
			if (err) {
				done(err);
			} else {
				expect(filename).to.equal('ccd_0.xml');
				expect(content).to.equal('content0');
				done();	
			}
		});
	});

	it('recordCount', function(done) {
		bbr.recordCount('pat0', function(err, result) {
			if (err) {
				done(err);
			} else {
				expect(result).to.equal(3);
				done();	
			}
		});
	});

	it('saveAllSections', function(done) {
		bbr.saveAllSections('pat0', ccd, sourceIds[0], function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}	
		});
	});

	it('getAllSections, cleanSection', function(done) {
		bbr.getAllSections('pat0', function(err, allSections) {
			if (err) {
				done(err);
			} else {
				Object.keys(allSections).forEach(function(secName) {
					var actual = bbr.cleanSection(allSections[secName]);
					var expected = ccd[secName];
					if (secName === 'demographics') {
						expected = [expected];
					}
                	expect(actual).to.deep.include.members(expected);
                	expect(expected).to.deep.include.members(actual);
				});
				done();
			}	
		});
	});

	it('saveSection', function(done) {
		bbr.saveSection('allergies', 'pat1', ccd.allergies, sourceIds[3], function(err, result) {
			if (err) {
				done(err);
			} else {
				allergyIds = result;
				done();
			}
		});
	});

	it('getSection, cleanSection', function(done) {
		bbr.getSection('allergies', 'pat1', function(err, result) {
			if (err) {	
				done(err);
			} else {
				var actual = bbr.cleanSection(result);
				expect(actual).to.deep.equal(ccd.allergies);
				done();
			}
		});
	});
});