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

        var returnArray = [];
        var returnPartialArray = [];

        function updateDuplicate(section, update_id, callback) {
            record.duplicateEntry(section, update_id, newSourceID, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });

        }

        var loopCount = 0;
        var loopTotal = srcMatches.length;

        function checkLoopComplete() {

            if (loopCount === loopTotal) {
                callback(null, section, returnArray, returnPartialArray);
            }
        }

        for (var i = 0; i < srcMatches.length; i++) {

            if (srcMatches[i].match === 'duplicate') {

                //If duplicate, don't push to save array and make duplicate entry in log.
                var matchIndex = srcMatches[i].dest_id || 0;
                updateDuplicate(section, baseArray[matchIndex]._id, function(err, resIter) {
                    if (err) {
                        console.error(err);
                    } else {
                        loopCount++;
                        checkLoopComplete();
                    }
                });

            } else if (srcMatches[i].match === 'new') {

                //If new, push the object to the return.
                var tmpSrcIndex = 0;
                if (srcMatches[i].src_id === undefined) {} else {
                    tmpSrcIndex = srcMatches[i].src_id;
                }

                returnArray.push(srcArray[tmpSrcIndex]);

                loopCount++;
                checkLoopComplete();

            } else if (srcMatches[i].match === 'diff') {

                //SHIM:  Holder for 'New' Demographics fix.
                var tmpMatchRecId;
                if (baseArray.length === 0) {
                    tmpMatchRecId = null;
                } else {
                    tmpMatchRecId = baseArray[0]._id;
                }

                var matchObject = srcMatches[i];
                var matchObjForDb = {};
                matchObjForDb.diff = matchObject.diff;
                if (matchObject.subelements) {
                    matchObjForDb.subelements = matchObject.subelements;
                }

                //Diffs always zero, can take only array object.
                returnPartialArray.push({
                    partial_array: srcArray[0],
                    partial_match: matchObjForDb,
                    match_record_id: tmpMatchRecId
                });

                loopCount++;
                checkLoopComplete();

            } else if (srcMatches[i].match === 'partial') {

                var matchObject = srcMatches[i];
                var matchObjForDb = {};
                matchObjForDb.diff = matchObject.diff;
                matchObjForDb.percent = matchObject.percent;                
                if (matchObject.subelements) {
                    matchObjForDb.subelements = matchObject.subelements;
                }

                returnPartialArray.push({
                    partial_array: srcArray[srcMatches[i].src_id],
                    partial_match: matchObjForDb,
                    match_record_id: baseArray[srcMatches[i].dest_id]._id
                });

                loopCount++;
                checkLoopComplete();
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
        baseObjectForParsing[iObj] = record.cleanSection(baseObject[iObj]);

        if (baseObjectForParsing[iObj] === undefined) {
            delete baseObjectForParsing[iObj];
        }
    }


    //BB Matching library expects object for demographics.

    function prepDemographics() {
        if (baseObjectForParsing.demographics instanceof Array) {
            if (baseObjectForParsing.demographics.length > 0) {
                baseObjectForParsing.demographics = baseObjectForParsing.demographics[0];
            }
        }
        if (newObjectForParsing.demographics instanceof Array) {
            if (newObjectForParsing.demographics.length > 0) {
                newObjectForParsing.demographics = newObjectForParsing.demographics[0];
            }
        }
    }
    prepDemographics();

    baseObjectForParsing = {}.data = baseObjectForParsing;
    newObjectForParsing = {}.data = newObjectForParsing;

    //console.log(JSON.stringify(newObjectForParsing.demographics, null, 10));
    //console.log(JSON.stringify(baseObjectForParsing.demographics, null, 10));
    var matchResult = bbMatch.match(newObjectForParsing, baseObjectForParsing);
    //console.log(JSON.stringify(matchResult, null, 10));

    delete baseObjectForParsing.data;
    delete newObjectForParsing.data;

    function revertDemographics() {
        if (_.isObject(newObjectForParsing.demographics) === true && _.isArray(newObjectForParsing.demographics) === false) {
            newObjectForParsing.demographics = new Array(newObjectForParsing.demographics);
        }
        if (_.isObject(baseObjectForParsing.demographics) === true && _.isArray(baseObjectForParsing.demographics) === false) {
            baseObjectForParsing.demographics = new Array(baseObjectForParsing.demographics);
        }
    }
    revertDemographics();

    removeMatchDuplicates(newObjectForParsing, baseObject, matchResult, newSourceID, function(err, newObjectPostMatch, newPartialObjectPostMatch) {
        //console.log(JSON.stringify(newObjectPostMatch, null, 10));
        callback(null, newObjectPostMatch, newPartialObjectPostMatch);
    });
}

module.exports.reconcile = reconcile;
