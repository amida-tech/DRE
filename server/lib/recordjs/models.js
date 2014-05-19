/*=======================================================================
Copyright 2014 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var mongoose = require('mongoose');
var bb = require('blue-button');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var typeToSection = exports.typeToSection = {
    allergy: 'allergies',
    procedure: 'procedures',
    medication: 'medications',
    encounter: 'encounters',
    vital: 'vitals',
    result: 'results',
    social: 'socialHistory',
    immunization: 'immunizations',
    demographics: 'demographics',
    problem: 'problems'
};

var mergeColName = function(type) {
    return type + 'merges';
}

var storageColName = 'storage.files';

var privateMergeModel = (function() {
    var mergeModels = {};
   
    return function(type, updateClinical) {
        var model = mergeModels[type];
        if (model) {
            return model;
        } else {
            if (updateClinical) {
                var cr = privateClinicalModel(type, false);
                if (! cr) return null;
            }
            var name = typeToSection[type];
            if (! name) {
                return null;
            }
            var schema = new Schema({
                entry_type: String,
                entry_id: {type: ObjectId, ref: collName},
                record_id: {type: ObjectId, ref: storageColName},
                merged: Date,
                merge_reason: String
            });
            var model = mongoose.model(mergeColName(), schema);
            mergeModels[type] = model;
            return model;
        }
    };
})();

var privateClinicalModel = (function() {
    var bbToMongoose = function(description) {
        if (! description) return null;
        if (Array.isArray(description)) {
            var elem = bbToMongoose(description[0]);
            if (! elem) return null;
            return [elem];
        } else if (typeof description === "object") {
            var result = {};
            Object.keys(description).forEach(function(key) {
                var elem = bbToMongoose(description[key]);
                if (! elem) return null;
                result[key] = elem;
            });
            return result;
        } else {
            if (description === 'string') {
                return String;
            } else if (description === 'datetime') {
                return Date;
            } else {
                return null;
            }
        }
    };

    var modelDescription = function(type, callback) {
        var name = typeToSection[type];
        if (name) {
            bb.generateSchema(name, function(err, bbd) {
                if (err) {
                    callback(err);
                } else {
                    bbd = (name === 'demographics') ? bbd : bbd[0];
                    var d = bbToMongoose(bbd);
                    if (! d) {
                        callback(new Error('unsupported bluebutton schema description'));
                    } else {
                        callback(null, d);
                    }
                }
            });
        } else {
            callback(new Error("unrecognized type " + type));
        }
    };

    var models = {};

    return function(type, updateMerge) {
        var model = models[type];
        if (model) {
            return model;
        } else {
            if (updateMerge) {
                var mr = privateMergeModel(type, false);
                if (! mr) return null;
            }
            var name = typeToSection[type];
            if (! name) {
                return null;
            }
            modelDescription('ccda_' + name, function(err, desc) {  // this is actually synch.  need to change in blue-button
                if (err) return null;
                desc.patKey = String;
                desc.metadata =  {attribution: [{type: ObjectId, ref: mergeColName()}]};
                var schema = new Schema(desc);
                model = mongoose.model(name, schema);
                models[type] = model;
                return model;
            });
        }
    };
})();


exports.clinicalModel = function(type) {
    return privateClinicalModel(type, true);
};

exports.mergeModel = function(type) {
    return privateMergeModel(type, true);
};

exports.storageModel = function(connection) {
    if (! connection) connection = mongoose;
    //GridFS will automatically make this, but a schema is needed for population/refs.
    var schema = new Schema({
        patKey: String,
        metadata: {
            class: String
        },
        md5: String,
        uploadDate: Date,
        chunkSize: Number,
        length: Number,
        contentType: String,
        filename: String,
    });

    var model = connection.model(storageColName, schema);
    return model;
};
