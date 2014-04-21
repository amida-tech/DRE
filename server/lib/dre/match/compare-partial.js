"use strict";

var compareSimple = require('./compare.js').compare;

var allergies = require('./allergies.js');

//return different compare functions for different sections
exports.compare = function comparePartial(section) {
    if (arguments.length != 1) {
      throw "one argument is required for compare function";
    }

    switch (section) {
        case "allergies":
            return allergies.compare;
        default:
            return compareSimple;
    }

};

