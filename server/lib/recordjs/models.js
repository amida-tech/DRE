var mongoose = require('mongoose');
var bb = require('blue-button');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var bbToMongoose = function(description) {
    if (!description) {
        return null;
    }
    if (Array.isArray(description)) {
        var elem = bbToMongoose(description[0]);
        if (!elem) {
            throw new Error('unknown description in array: ' + description);
        }
        return [elem];
    } else if (typeof description === "object") {
        var result = {};
        Object.keys(description).forEach(function(key) {
            var elem = bbToMongoose(description[key]);
            if (!elem) {
                throw new Error('unknown description in object: ' + description);
            }
            result[key] = elem;
        });
        return result;
    } else {
        if (description === 'string') {
            return {
                type: String
            };
        } else if (description === 'datetime') {
            return {
                type: Date
            };
        } else if (description === 'number') {
            return {
                type: Number
            };
        } else if (description === 'boolean') {
            return {
                type: Boolean
            };
        } else {
            throw new Error('unknown description: ' + description);
        }
    }
};

exports.modelDescription = function(name) {
    var bbd = bb.generateSchema(name);
    var bbdc = (name === 'ccda_demographics') ? bbd : bbd[0];
    var d = bbToMongoose(bbdc);
    return d;
};

var storageColName = 'storage.files';

exports.models = function(connection, sectionToType, schemas, matchFields) {
    if (!connection) {
        connection = mongoose;
    }

    var result = {
        merge: {},
        clinical: {},
        match: {}
    };
    Object.keys(sectionToType).forEach(function(secName) {
        var type = sectionToType[secName];

        var mergeColName = type + 'merges';
        var mergeSchema = new Schema({
            entry_type: String,
            patKey: String,
            entry_id: {
                type: ObjectId,
                ref: secName
            },
            record_id: {
                type: ObjectId,
                ref: storageColName
            },
            merged: Date,
            merge_reason: String,
            archived: Boolean
        });
        result.merge[secName] = connection.model(mergeColName, mergeSchema);

        var matchColName = type + 'matches';
        var matchSchemaDesc = {
            entry_type: String,
            patKey: String,
            entry_id: {
                type: ObjectId,
                ref: secName
            },
            match_entry_id: {
                type: ObjectId,
                ref: secName
            },
            determination: String //Can be 1) Merged, 2) Added, 3) Ignored.
        };
        Object.keys(matchFields).forEach(function(matchFieldKey) {
            var matchFieldType = matchFields[matchFieldKey];
            if (matchFieldType) {
                if (matchFieldType === 'number') {
                    matchSchemaDesc[matchFieldKey] = Number;
                } else if (matchFieldType === 'string') {
                    matchSchemaDesc[matchFieldKey] = String;
                }
            } else {
                matchSchemaDesc[matchFieldKey] = {};
            }
        });
        var matchSchema = new Schema(matchSchemaDesc);
        result.match[secName] = connection.model(matchColName, matchSchema);

        var desc = schemas[secName];
        desc.patKey = String;
        desc.metadata = {
            attribution: [{
                type: ObjectId,
                ref: mergeColName
            }]
        };
        desc.reviewed = Boolean;
        desc.archived = Boolean;
        var schema = new Schema(desc);

        result.clinical[secName] = connection.model(secName, schema);
    });
    return result;
};

exports.storageModel = function(connection) {
    if (!connection) {
        connection = mongoose;
    }
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
