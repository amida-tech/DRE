var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var bbMatch = require("blue-button-match");
var _ = require("underscore");
var async = require("async");

//Main function, performs match and dedupes.

function reconcile(newObject, baseObject, newRecordID, callback) {

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

    //console.log(JSON.stringify(newObjectForParsing, null, 10));
    //console.log('------------------');
    //console.log(JSON.stringify(baseObjectForParsing, null, 10));
    var matchResult = bbMatch.match(newObjectForParsing, baseObjectForParsing);
    //console.log(JSON.stringify(matchResult, null, 10));

    delete baseObjectForParsing.data;
    delete newObjectForParsing.data;

    function revertDemographics() {
        if (_.isObject(newObjectForParsing.demographics) === true && _.isArray(newObjectForParsing.demographics) === false) {
            newObjectForParsing.demographics = new Array(newObjectForParsing.demographics);
        }
    }

    function deDuplicateNew(match, matchObject) {
        _.map(match, function (value, key) {
            if (_.isArray(value)) {
                //Find all duplicate source entries.
                var duplicateArray = [];
                for (var deLoop in value) {
                    if (value[deLoop].dest === 'src' && value[deLoop].match === 'duplicate') {
                        duplicateArray.push(value[deLoop]);
                    };
                }

                //Find intersection and drop one.
                for (var srcLoop in duplicateArray) {
                    for (var destLoop in duplicateArray) {

                        if (duplicateArray[srcLoop].src_id === duplicateArray[destLoop].dest_id) {
                            if (duplicateArray[srcLoop].dest_id === duplicateArray[destLoop].src_id) {
                                duplicateArray.splice(destLoop, 1);
                                matchObject[key].splice(destLoop, 1);
                            }
                        }
                    }
                }

                //Remove remaining entries from source.
                for (var iSrc in value) {
                    for (var iDest in duplicateArray) {
                        if (_.isEqual(value[iSrc], duplicateArray[iDest])) {
                            value.splice(iSrc, 1);
                        }
                    }
                }

            }

        });

        var returnObject = {
                match: match,
                matchObject: matchObject

        }

        return returnObject;
    }

    //Splice duplicate entries from input array.
    //Add source attribution to matched entries.
    function removeDuplicates(match, newRecord, baseRecord, recordID) {
        var duplicateArray = [];
        _.map(match, function (value, matchKey) {
            if (_.isArray(value)) {
                duplicateArray = _.where(value, {
                    dest: 'dest',
                    match: 'duplicate'
                });

                duplicateNewIndexArray = _.uniq(_.pluck(duplicateArray, 'src_id'));
                duplicateBaseIndexArray = _.uniq(_.pluck(duplicateArray, 'dest_id'));

                var attributionRecord = _.filter(baseRecord[matchKey], function (object, objectIndex) {
                    if (_.contains(duplicateBaseIndexArray, objectIndex.toString())) {
                        return true;
                    } else {
                        return false;
                    }
                });

                function attributeBaseRecord(section, newRecordID) {
                    record.duplicateEntry(section, 'test', update_id, newRecordID, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }

                async.each(attributionRecord, function (attribution, callback) {
                    record.duplicateEntry(matchKey, 'test', attribution._id, recordID, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    })
                }, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });

                var returnRecord = _.filter(newRecord[matchKey], function (object, objectIndex) {
                    if (_.contains(duplicateNewIndexArray, objectIndex.toString())) {
                        return false;
                    } else {
                        return true;
                    }
                });

                newRecord[matchKey] = returnRecord;
            } else {
                if (value.match === 'duplicate' && matchKey === 'demographics') {

                    //TODO:  Update demographics here.
                    delete newRecord[matchKey];
                }
            }
        });

        _.map(newRecord, function (value, field) {
            if (_.isArray(value)) {
                if (value.length === 0) {
                    delete newRecord[field];
                }
            }
        });

        return newRecord;
    }


    function buildNewEntryArray (match, newObjectArray) {


        _.map(match, function (value, matchKey) {
            
            //Need to make sure all entries per src_id are only new.
            newCheckArray = _.where(value, {
                    dest: 'dest'
                });

                 var groupCheckedArray = _.groupBy(newCheckArray, 'src_id');

                 //console.log(groupCheckedArray);
                
                //If filtered new length equals total length.
                 _.each(groupCheckedArray, function(element, index) {
                    var newElementArray = _.filter(element, function(elementItem, elementItemIndex) {
                        if (elementItem.match === 'new') {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    //console.log(element);

                    if (newElementArray.length === element.length) {
                        //console.log('asdf');
                    }

                 });


        });

        //console.log(match);    

        //console.log(newObjectArray);


    }


    revertDemographics();
    var deDuplicatedSourceRecords = deDuplicateNew(matchResult.match, newObject);
    var deDuplicatedNewRecord = removeDuplicates(deDuplicatedSourceRecords.match, deDuplicatedSourceRecords.matchObject, baseObject, newRecordID);

    //console.log(deDuplicatedNewRecord);



    //console.log(match);



    buildNewEntryArray(deDuplicatedSourceRecords.match, deDuplicatedNewRecord);

    //console.log(deDuplicatedNewRecord);

    callback(null, deDuplicatedNewRecord, deDuplicatedNewRecord);

    //console.log(match);

    //removeMatchDuplicates(newObjectForParsing, baseObject, matchResult, newSourceID, function(err, newObjectPostMatch, newPartialObjectPostMatch) {
    //console.log(JSON.stringify(newObjectPostMatch, null, 10));
    //    callback(null, newObjectPostMatch, newPartialObjectPostMatch);
    // });

    /*
    function removeMatchDuplicates(newObject, baseObject, matchResults, newSourceID, callback) {

    function removeMatches(srcMatches, srcArray, baseArray, section, callback) {

        var returnArray = [];
        var returnPartialArray = [];

        function updateDuplicate(section, update_id, callback) {
            record.duplicateEntry(section, 'test', update_id, newSourceID, function (err) {
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
                updateDuplicate(section, baseArray[matchIndex]._id, function (err, resIter) {
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
                    partial_entry: srcArray[0],
                    partial_match: matchObjForDb,
                    match_entry_id: tmpMatchRecId
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
                    partial_entry: srcArray[srcMatches[i].src_id],
                    partial_match: matchObjForDb,
                    match_entry_id: baseArray[srcMatches[i].dest_id]._id
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
            removeMatches(currentMatchResult, newObject[iSec], baseObject[iSec], iSec, function (err, returnSection, newEntries, newPartialEntries) {
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
*/


}

module.exports.reconcile = reconcile;
