var express = require('express');
var app = module.exports = express();
var Match = require('./match.js');
var compare = require('./match/compare-partial.js').compare;
var record = require('../recordjs');

//If an object is a duplicate; remove the newRecord and log disposal as duplicate
function removeMatchDuplicates(newArray, baseArray, matchResults, newSourceID, callback) {
    function removeAllergyMatches(allergyMatches, srcAllergyArray, callback) {
        //This is all types of broken. 
        function updateDuplicateAllergies(iter, update_id, callback) {
            var mergeInfo = {record_id: newSourceID, merge_reason: 'duplicate'};
            record.addAllergyMergeEntry(update_id, mergeInfo, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, iter);
                }
            });
        }

        var returnArray = [];

        function checkLoopComplete(iteration, length) {
            if (iteration === length) {
                //console.log(returnArray);
                //console.log(srcAllergyArray);
                callback(null, returnArray);
            }
        }

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

    var cleanedArray = newArray.allergies;

    newObjectForParsing.allergies = cleanedArray;

    //shim to strip attribution from basearray for matching.
    //console.log(baseArray);
    //stip id, v, metadata.

    var baseObjectForParsing = {};
    baseObjectForParsing.allergies = {};
    baseObjectForParsing.allergies = record.cleanSectionEntries(baseArray.allergies);

    var match = new Match(compare);
    var matchResult = match.match(newObjectForParsing, baseObjectForParsing);

    removeMatchDuplicates(newObjectForParsing, baseArray, matchResult, newSourceID, function(err, newObjectPostMatch) {
        callback(null, newObjectPostMatch);
    });
}

module.exports.reconcile = reconcile;