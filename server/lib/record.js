var mongo = require('mongodb');
var mongoose = require('mongoose');

var databaseName = 'dre';

exports.connectDatabase = function connectDatabase(server, callback) {
  var Db = mongo.Db;
  var Grid = mongo.Grid;

  Db.connect('mongodb://' + server + '/' + databaseName, function(err, dbase) {
    if (err) {
      throw err;
    }
    exports.db_conn = dbase;
    exports.grid_conn = new Grid(dbase, 'storage');
    mongoose.connect('mongodb://' + server + '/'+ databaseName);
    callback();
  });
}

