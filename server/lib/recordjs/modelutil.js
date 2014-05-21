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

var jsutil = require('./jsutil');

var mongooseCleanDocument = exports.mongooseCleanDocument = function(doc) {
    ['__index', '__v', '_id', 'patKey', 'metadata'].forEach(function(prop) {
        delete doc[prop];
    });
    jsutil.deepDelete(doc, '_id');
    jsutil.deepEmptyArrayDelete(doc);
    jsutil.deepDeleteEmpty(doc);
}

exports.mongooseCleanFullRecord = function(record) {
    Object.keys(record).forEach(function(sectionKey) {
        var section = record[sectionKey]
        if (Array.isArray(section)) { // all but demographics
            var n = section.length;
            for (var i=0; i<n; ++i) {
                var entry = section[i];
                mongooseCleanDocument(entry);
            }
        } else {
            mongooseCleanDocument(section);
        }
    });
};
