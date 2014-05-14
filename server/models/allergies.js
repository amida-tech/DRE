/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

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

//This is data model used purely for portal user authentication purposes
var Allergies = new Schema({
    patKey: String,
    metadata: {
        attribution: [{type: ObjectId, ref: 'Merges'}]
    },
    date_range: {
        start: Date,
        end: Date
    },
    name: String,
    code: String,
    code_system: String,
    code_system_name: String,
    status: String,
    severity: String,
    reaction: {
        name: String,
        code: String,
        code_system: String
    }
});

module.exports = mongoose.model('Allergies', Allergies);