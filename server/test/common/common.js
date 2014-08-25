
var database = require('mongodb').Db;
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var path = require('path');


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

function removeAll(callback) {

    removeCollection('allergies', function (err) {
        if (err) {
            callback(err);
        }
        removeCollection('allergiesmerges', function (err) {
            if (err) {
                callback(err);
            }
            removeCollection('allergiesmatches', function (err) {
                if (err) {
                    callback(err);
                }
                removeCollection('storage.files', function (err) {
                    if (err) {
                        callback(err);
                    }
                    removeCollection('storage.chunks', function (err) {
                        if (err) {
                            callback(err);
                        }
                        callback();
                    });
                });
            });
        });
    });

}

module.exports.removeAll = removeAll;