var express = require('express');
var app = module.exports = express();
var bb = require('../bluebutton/bluebutton.js');

function checkRecordType(inputRecord, callback) {

	var bbRes;

	try {
		bbRes = bb(inputRecord);
	} catch (parseError) {
		callback('error parsing file');
	}

	if (bbRes.data.document = 'ccda') {
		callback(null, bbRes.data.document)
	} else {
		callback(null);
	}

}

module.exports.checkRecordType = checkRecordType;