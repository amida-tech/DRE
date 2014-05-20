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

exports.saveMerge = function(dbinfo, mergeObject, callback) {
    var Model = dbinfo.mergeModels[mergeObject.entry_type];
    var saveMerge = new Model(mergeObject);

    saveMerge.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, saveResults);
        }
    });
};

exports.getMerges = function(dbinfo, type, typeFields, recordFields, callback) {
    var model = dbinfo.mergeModels[type];
    var allFields = typeFields + ' ' + recordFields;
    var query = model.find({entry_type: type}).populate('entry_id record_id', allFields);
    query.exec(function (err, mergeResults) {
        if (err) {
            callback(err);
        } else {
            callback(null, mergeResults);
        }
    });
};

exports.mergeCount = function(type, conditions, callback) {
    var model = dbinfo.mergeModels[type];
    model.count(conditions, function(err, count) {
        callback(err, count);
    });
};
