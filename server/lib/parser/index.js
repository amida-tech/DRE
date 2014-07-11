var express = require('express');
var app = module.exports = express();
var bb = require('blue-button');


function extractRecord(inputRecord, callback) {

    console.log('parser logic running');
	var bbRecord;
	var bbRecordType;

	try {
		bbRecordType = bb.senseString(inputRecord);
        console.log('testing the record type!' + JSON.stringify(bbRecordType, null, 4));
        if(bbRecordType.type === 'cms'){
            bbRecord = bb.parseText(inputRecord);
        }
        else{
            bbRecord = bb.parseString(inputRecord);
        }


	} catch (parseError) {
		callback(parseError);
	}
    console.log(JSON.stringify(bbRecordType, null, 4));
	if (bbRecordType.type === 'ccda') {
		callback(null, 'ccda', bbRecord.data);
    }
    if (bbRecordType.type === 'cms'){
        callback(null, 'cms', bbRecord.data);
	} else {
		callback(null);
	}

}

module.exports.extractRecord = extractRecord;
