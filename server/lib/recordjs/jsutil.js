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
var _ = require('underscore');


exports.deepDelete = function deepDelete(obj, prop) {
    if (obj && _.isObject(obj)) {
        delete obj[prop];
        Object.keys(obj).forEach(function(key) {
            deepDelete(obj[key], prop);
        });
    }
};

exports.deepEmptyArrayDelete = function deepEmptyArrayDelete(obj) {
    if (_.isObject(obj)) {
        Object.keys(obj).forEach(function(key) {
            if (obj[key] && Array.isArray(obj[key]) && obj[key].length === 0) {
                delete obj[key];
            } else {
                deepEmptyArrayDelete(obj[key]);
            }
        });
    }
}

exports.deepDeleteEmpty = function deepDeleteEmpty(obj) {
    if (_.isObject(obj)) {
        Object.keys(obj).forEach(function(key) {
            if (_.isObject(obj[key])) {
                if (Object.keys(obj[key]).length < 1) {
                    if (! (obj[key] instanceof Date)) {
                        delete obj[key];
                    }
                } else {
                    deepDeleteEmpty(obj[key]);
                }
            }
        });
    }
}

