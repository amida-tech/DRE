var express = require('express');
var app = module.exports = express();
//var Match = require('./match.js');
//var compare = require('./match/compare-partial.js').compare;
var record = require('../recordjs');
var bbMatch = require("blue-button-match");
var _ = require("underscore");


//If an object is a duplicate; remove the newRecord and log disposal as duplicate
function removeMatchDuplicates(newObject, baseObject, matchResults, newSourceID, callback) {

    function removeMatches(srcMatches, srcArray, baseArray, section, callback) {


        var returnArray = [];

        function updateDuplicate(iter, section, update_id, callback) {

            var mergeInfo = {
                record_id: newSourceID,
                merge_reason: 'duplicate'
            };
            record["add" + record.capitalize(record.sectionToType[section]) + "MergeEntry"](update_id, mergeInfo, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, iter);
                }
            });
        }

        function checkLoopComplete(iteration, length) {

            if (iteration === length) {
                callback(null, section, returnArray);
            }
        }

        for (var i = 0; i < srcMatches.length; i++) {
            if (srcMatches[i].match === 'duplicate') {
                //If duplicate, don't push to save array and make duplicate entry in log.
                //Need section, db id of match, return iter for loop check.
                updateDuplicate(i, section, baseArray[srcMatches[i].dest_id]._id, function(err, resIter) {
                    if (err) {
                        console.error(err);
                    } else {
                        //console.log(resIter);
                        checkLoopComplete(resIter, (srcMatches.length - 1));
                    }
                });
            } else if (srcMatches[i].match === 'new') {
                //If new, push the object to the return.
                returnArray.push(srcArray[srcMatches[i].src_id]);
                checkLoopComplete(i, (srcMatches.length - 1));
            } else if (srcMatches[i].match === 'diff') {
                //If diff, need to save source record for diff.
                returnArray.push(srcArray[0]);
                checkLoopComplete(i, (srcMatches.length - 1));
            } else if (srcMatches[i].match === 'partial') {
                //If partial, save partial.
                //TODO:  Inject partial save.
                returnArray.push(srcArray[srcMatches[i].src_id]);
                checkLoopComplete(i, (srcMatches.length - 1));
            }
        }

    }

    //Loop all sections.
    var sectionIter = 0;
    var sectionTotal = 0;
    for (var iSecCnt in newObject) {
        sectionTotal++;
        
    }

    function checkSectionLoopComplete(iteration, totalSections) {
        if (iteration === (sectionTotal - 1)) {
            callback(null, newObject);
        }
    }

    for (var iSec in newObject) {

        var currentMatchResult = matchResults.match[iSec];

            if (currentMatchResult.length > 0) {
                removeMatches(currentMatchResult, newObject[iSec], baseObject[iSec], iSec, function(err, returnSection, newEntries) {
                    newObject[returnSection] = newEntries;
                    sectionIter++;
                    checkSectionLoopComplete(sectionIter, sectionTotal);
                });
            } else {
            sectionIter++;
            checkSectionLoopComplete(sectionIter, sectionTotal);
        }
    }
}



//Main function, performs match and dedupes.
function reconcile(newObject, baseObject, newSourceID, callback) {

    newObjectForParsing = newObject;

    var baseObjectForParsing = {};
    for (var iObj in baseObject) {
        baseObjectForParsing[iObj] = {};
        baseObjectForParsing[iObj] = record.cleanSectionEntries(baseObject[iObj]);
    }

    baseObjectForParsing.data = baseObjectForParsing;
    newObjectForParsing.data = newObjectForParsing;

    //console.log(JSON.stringify(newObjectForParsing, null, 10));
    //console.log(JSON.stringify(baseObjectForParsing, null, 10));
    var matchResult = bbMatch.match(newObjectForParsing, baseObjectForParsing);
    console.log(JSON.stringify(matchResult, null, 10));

    delete baseObjectForParsing.data;
    delete newObjectForParsing.data;


    removeMatchDuplicates(newObjectForParsing, baseObject, matchResult, newSourceID, function(err, newObjectPostMatch) {
        //console.log(newObjectPostMatch);
        callback(null, newObjectPostMatch);
    });
}

module.exports.reconcile = reconcile;