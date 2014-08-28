var express = require('express');
var app = module.exports = express();
var bb = require('blue-button');


function extractRecord(inputRecord, callback) {

	var bbRecord;
	var bbRecordType;

	try {
		bbRecordType = bb.senseString(inputRecord);
        if(bbRecordType.type === 'cms'){
            bbRecord = bb.parseText(inputRecord);
            //console.log(JSON.stringify(bbRecord, null, 4));
        }
        else{
            bbRecord = bb.parseString(inputRecord);
        }

        console.log(bbRecord.meta);

	} catch (parseError) {
		callback(parseError);
	}
	if (bbRecordType.type === 'ccda') {
		callback(null, 'ccda', bbRecord.data);
    }
    else if (bbRecordType.type === 'cms'){
        callback(null, 'cms', bbRecord.data);
	} else {
		callback(null);
	}

}

module.exports.extractRecord = extractRecord;
