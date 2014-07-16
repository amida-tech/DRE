var record = require('blue-button-record');
var bbMatch = require("blue-button-match");
var _ = require("underscore");
var Promise = require('bluebird');


//If an object is a duplicate; remove the newRecord and log disposal as duplicate

//If an object is a partial match or diff, it needs to be saved as a record in source form.
//This record should have a flag on it to mark it as non-visible.
//A new object needs to be created containing the diff/partial (either percent of diff)
//This new object should have a reviewed flag on it.
//On review, a flag toggle needs to be set up to enable one view or disable the other.

function removeMatchDuplicates(newObject, baseObject, matchResults, newSourceID, callback) {
    var newPartialObject = {};

    Promise.map(Object.keys(newObject), function(iSec) {
        return new Promise(function (resolve) {
            var currentMatchResult = matchResults.match[iSec];
            if (currentMatchResult.length > 0) {
                removeMatches(currentMatchResult, newObject[iSec], baseObject[iSec], iSec, newSourceID, function(err, returnSection, newEntries, newPartialEntries) {
                    newObject[returnSection] = newEntries;
                    if (newPartialEntries.length > 0) {
                        newPartialObject[returnSection] = {};
                        newPartialObject[returnSection] = newPartialEntries;
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }).then(function(){
        callback(null, newObject, newPartialObject);
    });
}

function removeMatches(srcMatches, srcArray, baseArray, section, newSourceID, callback) {

    var returnArray = [];
    var returnPartialArray = [];

    return Promise.each(srcMatches, function(srcMatch) {
        return new Promise(function (resolve) {
            if (srcMatch.match === 'duplicate') {
                var matchIndex = srcMatch.dest_id || 0;
                record.duplicateEntry(section, baseArray[matchIndex]._id, newSourceID, resolve);
            } else if (srcMatch.match === 'new') {
                var tmpSrcIndex = 0;
                if (srcMatch.src_id !== undefined) {
                    tmpSrcIndex = srcMatch.src_id;
                } 
                returnArray.push(srcArray[tmpSrcIndex]);
                resolve();
            } else if (srcMatch.match === 'diff') {
                var tmpMatchRecId;
                if (baseArray.length === 0) {
                    tmpMatchRecId = null;
                } else {
                    tmpMatchRecId = baseArray[0]._id;
                }
                var matchObject = srcMatch;
                var matchObjForDb = {};
                matchObjForDb.diff = matchObject.diff;
                if (matchObject.subelements) {
                    matchObjForDb.subelements = matchObject.subelements;
                }
                returnPartialArray.push({
                    partial_array: srcArray[0],
                    partial_match: matchObjForDb,
                    match_record_id: tmpMatchRecId
                });
                resolve();

            } else if (srcMatch.match === 'partial') {
                var matchObject = srcMatch;
                var matchObjForDb = {};
                matchObjForDb.diff = matchObject.diff;
                matchObjForDb.percent = matchObject.percent;                
                if (matchObject.subelements) {
                    matchObjForDb.subelements = matchObject.subelements;
                }
                returnPartialArray.push({
                    partial_array: srcArray[srcMatch.src_id],
                    partial_match: matchObjForDb,
                    match_record_id: baseArray[srcMatch.dest_id]._id
                });
                resolve();
            } else {
                resolve();
            }
        })
    }).then(function() {
        callback(null, section, returnArray, returnPartialArray);
    });
}


//Main function, performs match and dedupes.
function reconcile(newObject, baseObject, newSourceID, callback) {

    newObjectForParsing = newObject;

    var baseObjectForParsing = {};
    Promise.each(Object.keys(baseObject), function(iObj) {
        baseObjectForParsing[iObj] = record.cleanSection(baseObject[iObj]);
    });

    //BB Matching library expects object for demographics.
    if (_.isArray(baseObjectForParsing.demographics) && baseObjectForParsing.demographics.length > 0) {
        baseObjectForParsing.demographics = baseObjectForParsing.demographics[0];
    }
    if (_.isArray(newObjectForParsing.demographics) && newObjectForParsing.demographics.length > 0) {
        newObjectForParsing.demographics = newObjectForParsing.demographics[0];
    }

    if (_.isArray(baseObjectForParsing.social_history) && baseObjectForParsing.social_history.length > 0) {
        baseObjectForParsing.social_history = baseObjectForParsing.social_history[0];
    }
    if (_.isArray(newObjectForParsing.social_history) && newObjectForParsing.social_history.length > 0) {
        newObjectForParsing.social_history = newObjectForParsing.social_history[0];
    }

    baseObjectForParsing = {}.data = baseObjectForParsing;
    newObjectForParsing = {}.data = newObjectForParsing;

    var matchResult = bbMatch.match(newObjectForParsing, baseObjectForParsing);

    delete baseObjectForParsing.data;
    delete newObjectForParsing.data;

    if (_.isObject(newObjectForParsing.demographics)  && !_.isArray(newObjectForParsing.demographics)) {
        newObjectForParsing.demographics = new Array(newObjectForParsing.demographics);
    }

    if (_.isObject(newObjectForParsing.social_history) && !_.isArray(newObjectForParsing.social_history)) {
        newObjectForParsing.social_history = new Array(newObjectForParsing.social_history);
    }

    removeMatchDuplicates(newObjectForParsing, baseObject, matchResult, newSourceID, function(err, newObjectPostMatch, newPartialObjectPostMatch) {
        callback(null, newObjectPostMatch, newPartialObjectPostMatch);
    });
}
module.exports.reconcile = reconcile;