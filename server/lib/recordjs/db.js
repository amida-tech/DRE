var mongo = require('mongodb');
var mongoose = require('mongoose');

var models = require('./models');

exports.connect = function connectDatabase(server, options, callback) {
    var dbName = options.dbName;
    mongo.Db.connect('mongodb://' + server + '/' + dbName, function(err, dbase) {
        if (err) {
            callback(err);
        } else {
            var dbinfo = {};
            dbinfo.db = dbase;
            dbinfo.grid = new mongo.Grid(dbase, 'storage');
            var c = mongoose.createConnection('mongodb://' + server + '/'+ dbName);
            dbinfo.storageModel = models.storageModel(c);
            
            var r = models.models(c, options.typeToSection, options.typeToSchemaDesc);
            if (! r) {
                callback(new Error('models cannot be generated'));
            } else {
                dbinfo.models = r.clinical;
                dbinfo.mergeModels = r.merge;
                dbinfo.matchModels = r.match;
            
                callback(null, dbinfo);
            }
        }
    });
};
