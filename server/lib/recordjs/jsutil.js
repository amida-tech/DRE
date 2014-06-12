"use strict";

var _ = require('underscore');

exports.deepDelete = function deepDelete(obj, prop) {
    if (obj && _.isObject(obj)) {
        delete obj[prop];
        Object.keys(obj).forEach(function(key) {
            deepDelete(obj[key], prop);
        });
    }
};

exports.deepDeleteEmpty = function deepDeleteEmpty(obj) {
    if (_.isObject(obj)) {
        Object.keys(obj).forEach(function(key) {
            if (_.isObject(obj[key])) {
                deepDeleteEmpty(obj[key]);
                if (_.isEmpty(obj[key])) {
                    if (! (obj[key] instanceof Date)) {
                        delete obj[key];
                    }
                } else if (_.isArray(obj[key])) {
                    var reduced = obj[key].reduce(function(r, v) {
                        if (v !== undefined) {
                            r.push(v);
                        }
                        return r;
                    }, []);
                    if (reduced.length !== obj[key].length) {
                        if (reduced.length > 0) {
                            obj[key] = reduced;
                        } else {
                            delete obj[key];
                        }
                    }
                }
            }
        });
    }
};
