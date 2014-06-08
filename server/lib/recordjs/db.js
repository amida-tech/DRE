var mongo = require('mongodb');
var mongoose = require('mongoose');
var _ = require('underscore');

var models = require('./models');

var typeToSection = exports.typeToSection = {
    allergy: 'allergies',
    procedure: 'procedures',
    medication: 'medications',
    encounter: 'encounters',
    vital: 'vitals',
    result: 'results',
    social: 'socialHistory',
    immunization: 'immunizations',
    demographic: 'demographics',
    problem: 'problems'
};

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

    if (! options.typeToSection) {
        options.typeToSection = typeToSection;
    }

   if (! options.typeToSchemaDesc) {
        options.typeToSchemaDesc = {};
        Object.keys(typeToSection).forEach(function(type) {
        var desc = models.modelDescription('ccda_' + typeToSection[type]);
            if (!desc) {throw new Error('cannot get schema for ' + 'ccda_' + typeToSection[type]);}
            options.typeToSchemaDesc[type] = desc;
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
            
            var r = models.models(c, options.typeToSection, options.typeToSchemaDesc);
            if (! r) {
                callback(new Error('models cannot be generated'));
            } else {
                dbinfo.models = r.clinical;
                dbinfo.mergeModels = r.merge;
                dbinfo.matchModels = r.match;
                dbinfo.typeToSection = options.typeToSection;
                dbinfo.sectionToType = sectionToType;
            
                callback(null, dbinfo);
            }
        }
    });
};
