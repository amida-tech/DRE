"use strict";

//var diff = require("rus-diff").diff;

var equal = require('deep-equal');

var lookups = require('./lookups.js');

var allergies = require('./match/allergies.js');


//Matching Library.
//---------
//This takes the standardized data elements and flags probable duplicates values.


//Basic comparison of two JSON elements for equality
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
        return {"match": "new"};
    }
};



// if (el in setObj.elements) ...
var createSet = function() {
  var set = Object.create(null);

  return {
    elements: function() {
      return set;
    },
    add: function(el) {
      set[el]=true;
    },
    delete: function(el) {
        delete set[el];
    }
  };
};

//Support method similar to Python's range
function range(len) {
    var rangeSet = createSet();
    for (var i=0; i<len; i++) {
        rangeSet.add(i);
    }

    return rangeSet;
}

//Generic match of two arrays of entries, using generic compare method
exports.matchSections = function matchSections(new_record, master) {
    //console.log(new_record);
    //console.log(master);

    var result = [];

    var new_entries = range(new_record.length);
    var master_entries = range(master.length);

    //console.log("all new entries");
    //console.log(new_entries.elements());

    //console.log("all master entries");
    //console.log(master_entries.elements());

    for (var i in new_entries.elements()) {
        for (var j in master_entries.elements()) {

            //console.log(i);
            //console.log(j);

            //console.log(new_record[i]);
            //console.log(master[j]);

            //console.log(i+" - "+j);
            var c = this.compare(new_record[i], master[j]);
            //console.log(c.match);
            if (c.match === "duplicate") {
                //assume that new record as well as master record doesn't have duplicates (in itself)
                new_entries.delete(i);
                master_entries.delete(j);
                result.push({"match" : "duplicate", "src_id": i, "dest_id" : j });
                break;

            }
        }

    }

    //console.log("result");
    //console.log(result);

    for (var k in new_entries.elements()) {
        result.push({"match" : "new", "src_id": k});
    }


    //console.log("new entries");
    //console.log(new_entries.elements());

    //console.log("dup master entries");
    //console.log(master_entries.elements());

    //console.log("result");
    //console.log(result);


    return result;
};



//Main method, compares new record against master health record and provides matches for all sections
exports.match = function match(new_record, master) {
    var result = { "match" : {}};

    for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        var new_section;
        var master_section = [];
        if (master.hasOwnProperty(name)) { master_section=master[name]; }

        if (new_record.hasOwnProperty(name)) {
            new_section = new_record[name];

            //console.log(this.matchSections(new_section, master_section));
            result["match"][name]=this.matchSections(new_section, master_section);
        }
    }

    //console.log("full match");
    //console.log(JSON.stringify(result,4));
    return result;
};
