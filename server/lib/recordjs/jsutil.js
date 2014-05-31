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
};

exports.deepDeleteEmpty = function deepDeleteEmpty(obj) {
    if (_.isObject(obj)) {
        Object.keys(obj).forEach(function(key) {
            if (_.isObject(obj[key])) {
                deepDeleteEmpty(obj[key]);
                if (Object.keys(obj[key]).length < 1) {
                     if (! (obj[key] instanceof Date)) {
                        delete obj[key];
                    }
                } 
            }
        });
    }
};


