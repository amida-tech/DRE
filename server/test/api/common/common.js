"use strict";

var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var mongo = require('mongodb');
var Db = mongo.Db;

function removeCollection(inputCollection, callback) {

    var db;
    Db.connect(databaseLocation, function(err, dbase) {
        if (err) {
            throw err;
        }
        db = dbase;
        db.collection(inputCollection, function(err, coll) {
            if (err) {
                throw err;
            }
            coll.remove(function(err, results) {
                if (err) {
                    throw err;
                }
                db.close();
                callback();
            });
        });
    });

}

function removeDatabase(callback) {

    Db.connect(databaseLocation, function(err, dbase) {
        if (err) {
            throw err;
        }
        dbase.dropDatabase(function(err, res) {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
        });
    });

}



module.exports.removeDatabase = removeDatabase;
module.exports.removeCollection = removeCollection;
