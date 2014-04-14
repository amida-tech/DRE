var express = require('express');
var app = module.exports = express();


function reconcileAllergyRecords(newArray, baseArray, callback) {

//Import get saved allergies from storage.

	var placeholderRes = {
		matchResults: [{
			inputRecord: 0,
			matchRecord: 0,
			matchRank: 10
		}, {
			inputRecord: 1,
			matchRecord: 0,
			matchRank: 0
		}, {
			inputRecord: 2,
			matchRecord: 0,
			matchRank: 6
		}, {
			inputRecord: 0,
			matchRecord: 1,
			matchRank: 6
		}, {
			inputRecord: 1,
			matchRecord: 1,
			matchRank: 0
		}, {
			inputRecord: 2,
			matchRecord: 1,
			matchRank: 10
		}]
	};

callback(null, placeholderRes);

}


module.exports.reconcileAllergyRecords = reconcileAllergyRecords;