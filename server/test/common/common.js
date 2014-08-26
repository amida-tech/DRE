
var database = require('mongodb').Db;
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var path = require('path');
var async = require('async');
var _ = require('underscore');


function loadTestRecord(api, fileName, callback) {
    var filepath = path.join(__dirname, '../artifacts/test-r1.0/' + fileName);
    api.put('/api/v1/storage')
        .attach('file', filepath)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                callback(err);
            }
            callback(null);
        });
}

module.exports.loadTestRecord = loadTestRecord;

function removeCollection(inputCollection, callback) {
    var db;
    database.connect(databaseLocation, function (err, dbase) {
        if (err) {
            throw err;
        }
        db = dbase;
        db.collection(inputCollection, function (err, coll) {
            if (err) {
                throw err;
            }
            coll.remove({}, function (err, results) {
                if (err) {
                    throw err;
                }
                db.close();
                callback();
            });
        });
    });
}

function removeAllCollections (callback) {

	var sections = ['allergies', 'encounters'];

    async.each(sections, function (entry, callback) {
        removeCollection(entry, function (err) {
            if (err) {
                callback(err);
            }
            removeCollection(entry + 'merges', function (err) {
                if (err) {
                    callback(err);
                }
                removeCollection(entry + 'matches', function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            });
        });

    }, function(err) {
    	if (err) {
    		callback(err);
    	}
    });

    callback();

}


function removeAll(callback) {


                removeCollection('storage.files', function (err) {
                    if (err) {
                        callback(err);
                    }
                    removeCollection('storage.chunks', function (err) {
                        if (err) {
                            callback(err);
                        }
                        removeAllCollections(function (err) {
                        	if (err) {
                        		callback(err);
                        	} else {
                        		callback();
                        	}
                        })
                    });
                });

}

module.exports.removeAll = removeAll;