var express = require('express');
var app = module.exports = express();
var Match = require('./match.js');
var compare = require('./match/compare-partial.js').compare;
var record = require('../recordjs');
var bbMatch = require("blue-button-match");

//If an object is a duplicate; remove the newRecord and log disposal as duplicate
function removeMatchDuplicates(newObject, baseObject, matchResults, newSourceID, callback) {

    function removeMatches(srcMatches, srcArray, section, callback) {

        var returnArray = [];

        function updateDuplicate(iter, update_id, callback) {
            var mergeInfo = {
                record_id: newSourceID,
                merge_reason: 'duplicate'
            };
            record.addAllergyMergeEntry(update_id, mergeInfo, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, iter);
                }
            });
        }

        function checkLoopComplete(iteration, length) {
            if (iteration === length) {
                //console.log(returnArray);
                callback(null, section, returnArray);
            }
        }

        for (var i = 0; i < srcMatches.length; i++) {
            if (srcMatches[i].match === 'duplicate') {
                /*updateDuplicate(i, baseArray.allergies[allergyMatches[i].dest_id]._id, function(err, resIter) {
                    if (err) {
                        console.error(err);
                    } else {
                        checkLoopComplete(resIter, (srcMatches.length - 1));
                    }
                });*/
            } else if (srcMatches[i].match === 'new') {
                returnArray.push(srcArray[srcMatches[i].src_id]);
                checkLoopComplete(i, (srcMatches.length - 1));
            }
        }

    }


    //Establish Loop Limits.
    var sectionIter = 0;
    var sectionTotal = 0;
    for (var iSecCnt in newObject) {
        sectionTotal++;
    }

    function checkSectionLoopComplete(iteration, totalSections) {
        if (iteration === (totalSections - 1)) {
            callback(null, newObject);
        }
    }

    for (var iSec in newObject) {
        var currentMatchResult = matchResults.match[iSec];

        if (currentMatchResult !== undefined) {
            if (currentMatchResult.length > 0) {

                removeMatches(currentMatchResult, newObject[iSec], iSec, function(err, returnSection, newEntries) {


                    newObject[returnSection] = newEntries;
                    sectionIter++;
                    checkSectionLoopComplete(sectionIter, sectionTotal);
                });

            } else {
                sectionIter++;
                checkSectionLoopComplete(sectionIter, sectionTotal);
            }
        } else {
            sectionIter++;
            checkSectionLoopComplete(sectionIter, sectionTotal);
        }
    }

/*
    if (matchResults.match.allergies.length > 0) {
        removeMatches(matchResults.match.allergies, newObject.allergies, function(err, newEntries) {
            newObject.allergies = newEntries;
            //console.log(newArray);
            callback(null, newObject);
        });
    } else {
        callback(null, newObject);
    }*/
}


//Main function, performs match and dedupes.
function reconcile(newObject, baseObject, newSourceID, callback) {

    newObjectForParsing = newObject;

    var baseObjectForParsing = {};
    for (var iObj in baseObject) {
        baseObjectForParsing[iObj] = {};
        baseObjectForParsing[iObj] = record.cleanSectionEntries(baseObject[iObj]);
    }

    var match = new Match(compare);
    var matchResult = match.match(newObjectForParsing, baseObjectForParsing);

    //console.log(matchResult);

    removeMatchDuplicates(newObjectForParsing, baseObject, matchResult, newSourceID, function(err, newObjectPostMatch) {
        //console.log(newObjectPostMatch);
        callback(null, newObjectPostMatch);
    });
}

module.exports.reconcile = reconcile;