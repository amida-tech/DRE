var express = require('express');
var app = module.exports = express();
var record = require('../recordjs');
var bbMatch = require("blue-button-match");
var _ = require("underscore");


//If an object is a duplicate; remove the newRecord and log disposal as duplicate

//If an object is a partial match or diff, it needs to be saved as a record in source form.
//This record should have a flag on it to mark it as non-visible.
//A new object needs to be created containing the diff/partial (either percent of diff)
//This new object should have a reviewed flag on it.
//On review, a flag toggle needs to be set up to enable one view or disable the other.



function removeMatchDuplicates(newObject, baseObject, matchResults, newSourceID, callback) {


    function removeMatches(srcMatches, srcArray, baseArray, section, callback) {

        //console.log(srcArray);

        var returnArray = [];
        var returnPartialArray = [];

        function updateDuplicate(iter, section, update_id, callback) {

            //console.log(section);
            //console.log(iter);

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
                callback(null, section, returnArray, returnPartialArray);
            }
        }

        for (var i = 0; i < srcMatches.length; i++) {
            //console.log(section);
            //console.log(srcMatches[i]);
            if (srcMatches[i].match === 'duplicate') {
                //If duplicate, don't push to save array and make duplicate entry in log.
                var matchIndex = srcMatches[i].dest_id || 0;
                updateDuplicate(i, section, baseArray[matchIndex]._id, function(err, resIter) {
                    if (err) {
                        console.error(err);
                    } else {
                        checkLoopComplete(resIter, (srcMatches.length - 1));
                    }
                });
            } else if (srcMatches[i].match === 'new') {
                //If new, push the object to the return.
                var tmpSrcIndex = 0;
                if (srcMatches[i].src_id === undefined) {
                } else {
                    tmpSrcIndex = srcMatches[i].src_id;
                }

                returnArray.push(srcArray[tmpSrcIndex]);
                checkLoopComplete(i, (srcMatches.length - 1));
            } else if (srcMatches[i].match === 'diff') {

                //If diff, need to save source record for diff.
                //Added conditional logic to override only 'diff' return.

                //SHIM:  Holder for 'New' Demographics fix.

                var tmpMatchRecId
                if (baseArray.length === 0) {
                    tmpMatchRecId = null;
                } else {
                    tmpMatchRecId = baseArray[0]._id;
                }
                //console.log(srcArray);
                //Diffs always zero, can take only array object.
                returnPartialArray.push({
                    partial_array: srcArray[0],
                    partial_match: srcMatches[i],
                    match_record_id: tmpMatchRecId
                });
                
                checkLoopComplete(i, (srcMatches.length - 1));

                


            } else if (srcMatches[i].match === 'partial') {
                //If partial, save partial.
                //TODO:  Inject partial save.


                returnPartialArray.push({
                    partial_array: srcArray[srcMatches[i].src_id],
                    partial_match: srcMatches[i],
                    match_record_id: baseArray[srcMatches[i].dest_id]._id
                });
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

    var newPartialObject = {};

    function checkSectionLoopComplete(iteration, totalSections) {
        if (iteration === (sectionTotal)) {
            //console.log('newObject');
            //console.log(newObject);
            callback(null, newObject, newPartialObject);
        }
    }

    for (var iSec in newObject) {

        //console.log(JSON.stringify(newObject[iSec], null, 10));

        var currentMatchResult = matchResults.match[iSec];
        if (currentMatchResult.length > 0) {
            removeMatches(currentMatchResult, newObject[iSec], baseObject[iSec], iSec, function(err, returnSection, newEntries, newPartialEntries) {
                //New entries is fine...
                //console.log('newEntries');
                //console.log(newEntries);
                newObject[returnSection] = newEntries;
                if (newPartialEntries.length > 0) {
                    newPartialObject[returnSection] = {};
                    newPartialObject[returnSection] = newPartialEntries;
                }
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

        if (baseObjectForParsing[iObj] === undefined) {
            delete baseObjectForParsing[iObj];
        }
    }

    baseObjectForParsing = {}.data = baseObjectForParsing;
    newObjectForParsing = {}.data = newObjectForParsing;

    //console.log(JSON.stringify(newObjectForParsing, null, 10));
    //console.log(JSON.stringify(baseObjectForParsing, null, 10));
    var matchResult = bbMatch.match(newObjectForParsing, baseObjectForParsing);
    //console.log(JSON.stringify(matchResult, null, 10));

    delete baseObjectForParsing.data;
    delete newObjectForParsing.data;


    removeMatchDuplicates(newObjectForParsing, baseObject, matchResult, newSourceID, function(err, newObjectPostMatch, newPartialObjectPostMatch) {
        //console.log(JSON.stringify(newObjectPostMatch, null, 10));
        callback(null, newObjectPostMatch, newPartialObjectPostMatch);
    });
}

module.exports.reconcile = reconcile;