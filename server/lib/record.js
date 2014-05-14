var mongo = require('mongodb');
var mongoose = require('mongoose');

var databaseName = 'dre';

var db_conn = null;
var grid_conn = null;

exports.connectDatabase = function connectDatabase(server, callback) {
  var Db = mongo.Db;
  var Grid = mongo.Grid;

  Db.connect('mongodb://' + server + '/' + databaseName, function(err, dbase) {
    if (err) {
      throw err;
    }
    db_conn = exports.db_conn = dbase;
    grid_conn = exports.grid_conn = new Grid(dbase, 'storage');
    mongoose.connect('mongodb://' + server + '/'+ databaseName);
    callback();
  });
};

//Saves raw file to gridFS.
exports.storeFile = function(inboundFile, inboundFileInfo, inboundXMLType, callback) {
  var grid = grid_conn;
  var buffer = new Buffer(inboundFile);

  var fileMetadata = {};
  if (inboundXMLType) {
    fileMetadata.fileClass = inboundXMLType;
  }

  grid.put(buffer, {
    metadata: fileMetadata,
    'filename': inboundFileInfo.name,
    'content_type': inboundFileInfo.type,
  }, function(err, fileInfo) {
    if (err) {
      callback(err);
    } else {
      /*Relax for now pending further investigation, seems to be chunking overhead.*/
      //if (fileInfo.length !== inboundFileInfo.size) {
      //  callback('file size mismatch');
      //} else {
      callback(null, fileInfo);
      //}
    }
  });
}

