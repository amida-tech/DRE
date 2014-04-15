var express = require('express');
var app = module.exports = express();
var allergyFunctions = require('../record/allergies');


//If an object is a duplicate; remove the newRecord and log disposal as duplicate
function removeMatchDuplicates(newArray, baseArray, matchResults, callback) {

	function removeAllergyMatches(allergyMatches, srcAllergyArray, callback) {

		//This is all types of broken.
		function updateDuplicateAllergies(iter, update_id, callback) {
			allergyFunctions.getAllergy(update_id, function(err, currentAllergy) {
				//Update Current allergy here.
				allergyFunctions.updateAllergy(currentAllergy, function(err, savedObject) {
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
				callback(null, srcAllergyArray);
			}
		}

		for (var i = 0; i < allergyMatches.length; i++) {

			if (allergyMatches[i].match === 'duplicate') {
				//Update New Array.
				srcAllergyArray.splice(allergyMatches[i].src_id, 1);

				//Update Matched Allergy.
				updateDuplicateAllergies(i, baseArray.allergies[allergyMatches[i].dest_id]._id, function(err, resIter) {
					if (err) {
						console.error(err);
					} else {
						checkLoopComplete(resIter, (allergyMatches.length - 1));
					}
				});
			}

		}

	}

	removeAllergyMatches(matchResults.match.allergies, newArray.allergies, function(err, newAllergies) {
		newArray.allergies = newAllergies;
		callback(null, newArray);
	});

}

function reconcile(newArray, baseArray, callback) {


//Win inject Dmitry's match library here.
var stubResult = {
    "match":
    {
        "allergies" : [
            { "src_id" : 0, "dest_id" : 0, "match":"duplicate" }
            //{ "src_id" : 1, "dest_id" : 1, "match":"duplicate" },
            //{ "src_id" : 2, "dest_id" : 2, "match":"not" }
        ]
    }
}

removeMatchDuplicates(newArray, baseArray, stubResult, function(err, newObjectPostMatch) {
	callback(null, newObjectPostMatch);
});



}




module.exports.reconcile = reconcile;