"use strict";

var equal = require('deep-equal');

var lookups = require('../lookups.js');


//TODO: Not done yet!

//Full comparison of two allergies JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //console.log("a "+a);
    //console.log("b "+b);
    //console.log(a);
    //console.log(b);
    //console.log(equal(a,b));

    //excellent code here
    if (equal(a,b)) {
        return {"match": "duplicate"};
    }
    else {
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same allergen +50%
        if (a.allergen.code === b.allergen.code  && a.allergen.code_system_name === b.allergen.code_system_name) {
            pct = pct + 50;

            // same reaction type +10%
            if (a.reaction_type.code === b.reaction_type.code  && a.reaction_type.code_system_name === b.reaction_type.code_system_name) {
                pct = pct + 10;
            }

            // same reaction +10%
            if (a.reaction.code === b.reaction.code  && a.reaction.code_system_name === b.reaction.code_system_name) {
                pct = pct + 10;
            }

            // same severity +10%
            if (a.severity === b.severity) {
                pct = pct + 10;
            }
        }


        return {"match": "partial", "percent" : pct};
    }

    return {"match": "new"};
};

