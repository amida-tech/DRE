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

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// This will come from a blue-button method based on models there.  Hard code as example
var getDescription = function(entryType) {
    if (entryType === 'allergy') {
        return {
            date_range: {
                start: "datetime",
                end: "datetime"
            },
            name: "string",
            code: "string",
            code_system: "string",
            code_system_name: "string",
            status: "string",
            severity: "string",
            reaction: {
                name: "string",
                code: "string",
                code_system: "string"
            }
        };
    } else {
        return null;
    }
};

var convertToSchema = function(description) {
    if (Array.isArray(description)) {
        var elem = convertToSchema(description[0]); 
        return [elem];
    } else if (typeof description === "object") {
        var result = {};
        Object.keys(description).forEach(function(key) {
            var elem = convertToSchema(description[key]);
            result[key] = elem;
        });
        return result;
    } else {
        if (description === 'string') {
            return String;
        } else if (description === 'datetime') {
            return Date;
        } else {
            return null; // crash for now
        }
    }
};

var models = {};

var collectionNames = {
    allergy: 'allergies'
};

var mergeModels = {};

var getMergeModel = exports.getMergeModel = function(type, noUpdate) {
    var model = mergeModels[type];
    if (model) {
        return model;
    } else {
        if ((! noUpdate) && ! models[type]) {
            getModel(type, true);
        }
        var Schema = mongoose.Schema;
        var ObjectId = Schema.ObjectId;
        var collName = collectionNames[type];
        var schema = new Schema({
            entry_type: String,
            entry_id: {type: ObjectId, ref: collName},
            record_id: {type: ObjectId, ref: 'storage.files'},
            merged: Date,
            merge_reason: String
        });
        var model = mongoose.model(type + 'merges', schema);
        mergeModels[type] = model;
        return model;
    }
};

var getModel = exports.getModel = function(entryType, noUpdate) {
    var model = models[entryType];
    if (model) {
        return model;
    } else {
        if ((! noUpdate) && ! mergeModels[entryType]) {
            getMergeModel(entryType, true);
        }
        var collectionName = collectionNames[entryType];
        var description = getDescription(entryType);
        var mongooseDescription = convertToSchema(description);
        mongooseDescription.patKey = String;
        //console.log(mongooseDescription);
        mongooseDescription.metadata =  {attribution: [{type: ObjectId, ref: entryType + 'merges'}]};
        var schema = new Schema(mongooseDescription);
        model = mongoose.model(collectionName, schema);
        models[entryType] = model;
        return model;
    }
};

exports.storageModel = (function() {
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

    var model = mongoose.model('storage.files', schema);

    return function() {
        return model;
    };
}());
