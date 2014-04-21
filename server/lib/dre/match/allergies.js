"use strict";

var equal = require('deep-equal');

var lookups = require('../lookups.js');


//TODO: Not done yet!

//Full comparison of two allergies JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a,b)) {
        return {"match": "duplicate"};
    }
    else {
        //console.log("allergy specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same allergen +50%
        if (a.code === b.code  && a.code_system_name === b.code_system_name) {
            pct = pct + 50;

            // same reaction +10%
            if (a.reaction.code === b.reaction.code  && a.reaction.code_system_name === b.reaction.code_system_name) {
                pct = pct + 10;
            }

            // same severity +10%
            if (a.severity === b.severity) {
                pct = pct + 10;
            }
        }

        //console.log({"match": "partial", "percent" : pct});
        if (pct === 0)
            return {"match": "new"};

        return {"match": "partial", "percent" : pct};
    }

    return {"match": "new"};
};

