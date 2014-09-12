var express = require('express');
var app = module.exports = express();
var bb = require('blue-button');


function extractRecord(inputRecord, callback) {
    // now supports following formats:
    // ccda, c32, cda, cms, blue-button.js

    var bbRecord;
    var bbRecordType;

    var supported_formats = ["ccda", "c32", "cda", "cms", "blue-button.js"];

    try {
        bbRecordType = bb.senseString(inputRecord);
        if (bbRecordType.type === 'cms') {
            bbRecord = bb.parseText(inputRecord);
            //console.log(JSON.stringify(bbRecord, null, 4));
        } else if (bbRecordType.type === 'ccda' || bbRecordType.type === 'c32' || bbRecordType.type === 'cda') {
            bbRecord = bb.parseString(inputRecord);
        } else if (bbRecordType.type === 'blue-button.js') {
            bbRecord = {
                "type": "blue-button.js",
                "data": JSON.parse(inputRecord).data
            };
        }

        console.log(bbRecord.meta);

    } catch (parseError) {
        callback(parseError);
    }

    console.log(">>>>");
    console.log("record format: ", bbRecordType.type);

    if (supported_formats.indexOf(bbRecordType.type) >= 0) {
        callback(null, bbRecordType.type, bbRecord.data);
    } else {
        callback(null);
    }

}

module.exports.extractRecord = extractRecord;
