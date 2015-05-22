'use strict';

var _ = require("lodash");

//BB Matching library expects object for demographics.
function prepDemographics(baseObjectForParsing, newObjectForParsing) {
    if (baseObjectForParsing.demographics instanceof Array) {
        if (baseObjectForParsing.demographics.length > 0) {
            baseObjectForParsing.demographics = baseObjectForParsing.demographics[0];

            //remove PIM artifacts in demographics section
            delete baseObjectForParsing.demographics.pim;
        }
    }
    if (newObjectForParsing.demographics instanceof Array) {
        if (newObjectForParsing.demographics.length > 0) {
            newObjectForParsing.demographics = newObjectForParsing.demographics[0];

            //remove PIM artifacts in demographics section
            delete newObjectForParsing.demographics.pim;
        }
    }
}

function revertDemographics(newObjectForParsing) {
    if (_.isObject(newObjectForParsing.demographics) === true && _.isArray(newObjectForParsing.demographics) === false) {
        newObjectForParsing.demographics = new Array(newObjectForParsing.demographics);
    }
}

exports.prepDemographics = prepDemographics;
exports.revertDemographics = revertDemographics;