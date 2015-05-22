'use strict';

var _ = require("lodash");

function deDuplicateNew(match, matchObject) {
    _.map(match, function (value, key) {
        if (_.isArray(value)) {
            //Find all duplicate source entries.
            var duplicateArray = [];
            for (var deLoop in value) {
                if (value[deLoop].dest === 'src' && value[deLoop].match === 'duplicate') {
                    duplicateArray.push(value[deLoop]);
                }
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
        new_entries: matchObject
    };

    return returnObject;
}

exports.deDuplicateNew = deDuplicateNew;