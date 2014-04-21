"use strict";

//var diff = require("rus-diff").diff;

var lookups = require('./lookups.js');
var matchSections = require('./match/match-sections.js').matchSections;

//Matching Library.
//---------
//This takes the standardized data elements and flags probable duplicates values.


function Match(compare_function) {
    this.compare = compare_function;
    this.matchSections = matchSections;
    //var match = match;
    //Main method, compares new record against master health record and provides matches for all sections
}

Match.prototype.match = function match(new_record, master) {
    var result = { "match" : {}};

    for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        var new_section;
        var master_section = [];
        if (master.hasOwnProperty(name)) { master_section=master[name]; }

        if (new_record.hasOwnProperty(name)) {
            new_section = new_record[name];

            //console.log(new_section);
            //console.log(master_section);
            //console.log(matchSections(new_section, master_section, this.compare(name)));
            result["match"][name]=matchSections(new_section, master_section, this.compare(name));
        }
    }

    //console.log("full match");
    //console.log(JSON.stringify(result,4));
    return result;
};

//Exports as Constructor - http://bites.goodeggs.com/posts/export-this/#constructor
module.exports = Match;
