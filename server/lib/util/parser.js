var bb = require('blue-button');


function extractRecord(inputRecord, callback) {

	var bbRecord;
	var bbRecordType;

	try {
		bbRecord = bb.parseString(inputRecord);
		bbRecordType = bb.senseString(inputRecord);

	} catch (parseError) {
		callback(parseError);
	}

	if (bbRecordType.type = 'ccda') {
		callback(null, 'ccda', bbRecord.data);
	} else {
		callback(null);
	}

}
module.exports.extractRecord = extractRecord;

