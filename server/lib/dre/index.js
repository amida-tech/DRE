var express = require('express');
var app = module.exports = express();
var allergyFunctions = require('../record/allergies');
var Match = require('./match.js');
var compare = require('./match/compare-partial.js').compare;

//If an object is a duplicate; remove the newRecord and log disposal as duplicate
function removeMatchDuplicates(newArray, baseArray, matchResults, newSourceID, callback) {

	function removeAllergyMatches(allergyMatches, srcAllergyArray, callback) {

		//This is all types of broken.
		function updateDuplicateAllergies(iter, update_id, callback) {
			allergyFunctions.getAllergy(update_id, function(err, currentAllergy) {
				//console.log(currentAllergy);
				//Needs to get added to, but held out of match for now.
				//currentAllergy.metadata.attribution.push({
				//	record_id: newSourceID,
				//	attributed: new Date(),
				//	attribution: 'duplicate'
				//});

				allergyFunctions.updateAllergyAndMerge(currentAllergy, newSourceID, function(err) {
					if (err) {
						callback(err);
					} else {
						callback(null, iter);
					}
				});


			});
		}

		function checkLoopComplete(iteration, length) {
			if (iteration === length) {
				//console.log(returnArray);
				//console.log(srcAllergyArray);
				callback(null, returnArray);
			}
		}

		var returnArray = [];

		for (var i = 0; i < allergyMatches.length; i++) {

			if (allergyMatches[i].match === 'duplicate') {
				//Update New Array.
				//console.log(allergyMatches[i].src_id);
				//srcAllergyArray.splice(allergyMatches[i].src_id, 1);
				//console.log(srcAllergyArray);

				//Update Matched Allergy.

				updateDuplicateAllergies(i, baseArray.allergies[allergyMatches[i].dest_id]._id, function(err, resIter) {
					if (err) {
						console.error(err);
					} else {
						checkLoopComplete(resIter, (allergyMatches.length - 1));
					}
				});
			} else if (allergyMatches[i].match === 'new') {

				returnArray.push(srcAllergyArray[allergyMatches[i].src_id]);

				checkLoopComplete(i, (allergyMatches.length-1));
			}
		}

	}

	if (matchResults.match.allergies.length > 0) {
		//console.log(matchResults.match.allergies);
	removeAllergyMatches(matchResults.match.allergies, newArray.allergies, function(err, newAllergies) {
		newArray.allergies = newAllergies;
		//console.log(newArray);
		callback(null, newArray);
	});
	} else {
		callback(null, newArray);
	}

}

function reconcile(newArray, baseArray, newSourceID, callback) {

//shim:  reconciles bb.js output into better format.

var newObjectForParsing = {};
newObjectForParsing.allergies = {};

var cleanedArray = [];

for (var i=0;i<newArray.allergies.length;i++) {
	var cleanedAllergy = allergyFunctions.createAllergyObject(newArray.allergies[i]);
	cleanedArray.push(cleanedAllergy);
}

newObjectForParsing.allergies = cleanedArray;


//shim to strip attribution from basearray for matching.
//console.log(baseArray);
//stip id, v, metadata.

var baseObjectForParsing = {};
baseObjectForParsing.allergies = {};

var cleanedBaseArray = [];

for (var i=0;i<baseArray.allergies.length;i++) {
	var newBaseAllergy = {};
	newBaseAllergy.date_range = {};
	newBaseAllergy.date_range.start = baseArray.allergies[i].date_range.start;
	newBaseAllergy.date_range.end = baseArray.allergies[i].date_range.end;
	newBaseAllergy.name = baseArray.allergies[i].name;
	newBaseAllergy.code = baseArray.allergies[i].code;
	newBaseAllergy.code_system = baseArray.allergies[i].code_system;
	newBaseAllergy.code_system_name = baseArray.allergies[i].code_system_name;
	newBaseAllergy.status = baseArray.allergies[i].status;
	newBaseAllergy.severity = baseArray.allergies[i].severity;
	newBaseAllergy.reaction = {};
	newBaseAllergy.reaction.name = baseArray.allergies[i].reaction.name;
	newBaseAllergy.reaction.code = baseArray.allergies[i].reaction.code;
	newBaseAllergy.reaction.code_system = baseArray.allergies[i].reaction.code_system;

	cleanedBaseArray.push(newBaseAllergy);

}

baseObjectForParsing.allergies = cleanedBaseArray;

//console.log(baseObjectForParsing.allergies);
//console.log(newObjectForParsing.allergies);


//Win inject Dmitry's match library here.
var stubResult = {
    "match":
    {
        "allergies" : [
            { "src_id" : 0, "dest_id" : 0, "match":"duplicate" },
            { "src_id" : 1, "dest_id" : 1, "match":"duplicate" },
            { "src_id" : 2, "dest_id" : 2, "match":"not" }
        ]
    }
}

//console.log(newArray.allergies);
//console.log(baseArray.allergies);
var match = new Match(compare);
var matchResult = match.match(newObjectForParsing,baseObjectForParsing);


//var matchResult = match.match(newObjectForParsing, baseObjectForParsing);

//console.log(JSON.stringify(matchResult, undefined, 4));



removeMatchDuplicates(newObjectForParsing, baseArray, matchResult, newSourceID, function(err, newObjectPostMatch) {
	callback(null, newObjectPostMatch);
});



}




module.exports.reconcile = reconcile;