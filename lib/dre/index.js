var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var bbMatch = require("blue-button-match");
var _ = require("lodash");
var async = require("async");

//refactored reconciliation functions
var demographics = require('./demographics');
var dedup_new = require('./dedup_new');
var remove_dups = require('./remove_dups');

//Main function, performs match and dedupes.

function reconcile(username, newObject, baseObject, newRecordID, callback) {
    //HACKETY HACK, skipping reconciliation for now
    //callback(null, null, null);

    var newObjectForParsing = newObject;

    var baseObjectForParsing = {};
    for (var iObj in baseObject) {
        baseObjectForParsing[iObj] = {};
        baseObjectForParsing[iObj] = record.cleanSection(baseObject[iObj]);

        if (baseObjectForParsing[iObj] === undefined) {
            delete baseObjectForParsing[iObj];
        }
    }

    demographics.prepDemographics(baseObjectForParsing, newObjectForParsing);

    baseObjectForParsing = {}.data = baseObjectForParsing;
    newObjectForParsing = {}.data = newObjectForParsing;

    //console.log(JSON.stringify(newObjectForParsing.social_history, null, 10));
    //console.log('------------------');
    //console.log(JSON.stringify(baseObjectForParsing.social_history, null, 10));
    var matchResult = bbMatch.match(newObjectForParsing, baseObjectForParsing);
    //console.log(JSON.stringify(matchResult.match.social_history, null, 10));

    delete baseObjectForParsing.data;
    delete newObjectForParsing.data;

    function removeSourceMatches(match) {

        var returnMatch = {};

        _.map(match, function (value, matchKey) {

            if (matchKey !== 'demographics') {
                var nonSourceMatch = _.filter(match[matchKey], function (object, objectIndex) {
                    if (object.dest === 'src') {
                        return false;
                    } else {
                        return true;
                    }
                });
                returnMatch[matchKey] = nonSourceMatch;
            } else {
                //No need to filter atomic items.
                returnMatch[matchKey] = value;
            }

        });

        var returnObject = {
            match: returnMatch
        };

        return returnObject;

    }

    //duplicate matches must be purges from queue as well as entries!!!!

    function splitNewPartialEntries(match, newObjectArray, originalNewObjectArray, baseObjectArray) {

        var outputPartialObjectArray = {};
        var outputNewObjectArray = {};

        //console.log(match);

        _.map(match, function (value, matchKey) {

            outputPartialObjectArray[matchKey] = [];
            outputNewObjectArray[matchKey] = [];

            //Need to make sure all entries per src_id are only new.
            var newCheckArray = _.where(value, {
                dest: 'dest'
            });

            if (matchKey === 'demographics') {

                if (match[matchKey].match === 'new') {
                    outputNewObjectArray[matchKey] = newObjectArray[matchKey];
                } else if (match[matchKey].match === 'partial') {

                    //console.log(baseObjectArray)

                    var partialOutput = {
                        partial_entry: newObjectArray[matchKey][0],
                        partial_match: match[matchKey],
                        match_entry_id: baseObjectArray[matchKey][0]._id
                    };

                    var multiPartialOutput = {
                        partial_entry: newObjectArray[matchKey][0],
                        partial_matches: [{
                            match_entry: baseObjectArray[matchKey][0]._id,
                            match_object: match[matchKey]
                        }]
                    };

                    //console.log(JSON.stringify(multiPartialOutput, null, 10));

                    //outputPartialObjectArray[matchKey].push(partialOutput);
                    outputPartialObjectArray[matchKey].push(multiPartialOutput);
                }

            } else {

                //If there are no dest records, everything is new.
                if (newCheckArray.length === 0) {

                    if (newObjectArray[matchKey] === undefined) {
                        outputNewObjectArray[matchKey] = [];
                    } else {
                        outputNewObjectArray[matchKey] = newObjectArray[matchKey];
                    }
                }

                var groupCheckedArray = _.groupBy(newCheckArray, 'src_id');

                //if (matchKey === 'social_history') {
                //    console.log(groupCheckedArray);    
                //}

                _.each(groupCheckedArray, function (element, index) {
                    var newElementArray = _.filter(element, function (elementItem, elementItemIndex) {
                        if (elementItem.match === 'new') {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    //Only valid entries (src_id) will have equal lengths
                    //Everything else is a partial match as that is all that remains.

                    //console.log(newElementArray.length);
                    //console.log(element.length);

                    if (newElementArray.length !== element.length) {
                        //console.log(newObjectArray[matchKey]);
                        if (newObjectArray[matchKey] !== undefined) {
                            var partialEntry = newObjectArray[matchKey][index];

                            //Need to pare down element object to just partial match entries.
                            //For each partial, grab the associated target entry and source entry.
                            //Return a big list of all matches.
                            //This will result in too many partial source entries being persisted.
                            //Must modify save logic to account for this.

                            //console.log(element);

                            var partialElementArray = _.filter(element, function (elementItem, elementItemIndex) {
                                if (elementItem.match === 'partial') {
                                    return true;
                                } else {
                                    return false;
                                }
                            });

                            //console.log(matchKey);

                            if (matchKey === 'procedures') {
                                //console.log(partialElementArray);
                            }

                            var multiPartialOutput = {
                                partial_entry: partialEntry,
                                partial_matches: []
                            };

                            //console.log(partialElementArray.length);

                            _.each(partialElementArray, function (partialElement, partialIndex) {

                                if (matchKey === 'social_history') {
                                    //console.log(partialElementArray);
                                }

                                //---Dying between lines.
                                var partialOutput = {
                                    partial_entry: partialEntry,
                                    partial_match: partialElement,
                                    match_entry_id: baseObjectArray[matchKey][partialElement.dest_id]._id
                                };
                                //outputPartialObjectArray[matchKey].push(partialOutput);
                                //---

                                var multiPartialMatch = {
                                    match_entry: baseObjectArray[matchKey][partialElement.dest_id]._id,
                                    match_object: partialElement
                                };

                                multiPartialOutput.partial_matches.push(multiPartialMatch);

                            });

                            //console.log(JSON.stringify(multiPartialOutput, null, 10));
                            outputPartialObjectArray[matchKey].push(multiPartialOutput);

                        }
                    } else {
                        if (newObjectArray[matchKey] !== undefined) {

                            var outputNewEntry = originalNewObjectArray[matchKey][element[0].src_id];
                            outputNewObjectArray[matchKey].push(outputNewEntry);
                        }
                    }

                });

            }

        });

        var returnObject = {
            newEntries: outputNewObjectArray,
            partialEntries: outputPartialObjectArray
        };

        return returnObject;

    }

    demographics.revertDemographics(newObjectForParsing);

    //Remove Overlapping Source Matches.
    var deDuplicatedSourceRecords = dedup_new.deDuplicateNew(matchResult.match, newObject);

    //Remove All 'src' matches.  Currently not required.
    var nonSourceMatches = removeSourceMatches(deDuplicatedSourceRecords.match);

    //Remove Duplicates from save, update Record Entry.

    var deDuplicatedNewRecord = remove_dups.removeDuplicates(username, nonSourceMatches.match, deDuplicatedSourceRecords.new_entries, baseObject, newRecordID);

    //Split incoming entries into new/partial.
    var splitIncomingEntries = splitNewPartialEntries(deDuplicatedNewRecord.new_match, deDuplicatedNewRecord.new_record, deDuplicatedSourceRecords.new_entries, baseObject);

    callback(null, splitIncomingEntries.newEntries, splitIncomingEntries.partialEntries);

}

module.exports.reconcile = reconcile;