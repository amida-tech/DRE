var mongo = require('mongodb');
var mongoose = require('mongoose');
var _ = require('underscore');

var models = require('./models');

var sectionToType = exports.sectionToType = {
    allergies: 'allergy',
    procedures: 'procedure',
    medications: 'medication',
    encounters: 'encounter',
    vitals: 'vital',
    results: 'result',
    socialHistory: 'social',
    immunizations: 'immunization',
    demographics: 'demographic',
    problems: 'problem'
};

var fillOptions = function(options) {
    if (! options.dbName) {
        options.dbName = 'dre';
    }

    if (! options.sectionToType) {
        options.sectionToType = sectionToType;
    }

   if (! options.schemas) {
        options.schemas = {};
        Object.keys(sectionToType).forEach(function(secName) {
        var desc = models.modelDescription('ccda_' + secName);
            if (!desc) {throw new Error('cannot get schema for ' + 'ccda_' + secName);}
            options.schemas[secName] = desc;
        });
    }
};

exports.connect = function connectDatabase(server, inputOptions, callback) {
    var options = _.clone(inputOptions);
    fillOptions(options);

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
            
            var r = models.models(c, options.sectionToType, options.schemas);
            if (! r) {
                callback(new Error('models cannot be generated'));
            } else {
                dbinfo.models = r.clinical;
                dbinfo.mergeModels = r.merge;
                dbinfo.matchModels = r.match;
                dbinfo.sectionToType = options.sectionToType;

                dbinfo.sectionNames = function() {
                    return Object.keys(dbinfo.sectionToType);
                };
            
                callback(null, dbinfo);
            }
        }
    });
};
