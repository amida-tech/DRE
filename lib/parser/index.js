var express = require('express');
var app = module.exports = express();
var bb = require('blue-button');
var bbm = require('blue-button-meta');
var _ = require("underscore");
var npi = require('npi-js');

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

    console.log("record format: ", bbRecordType.type);

    //filter all unsupported sections
    var diff = _.difference(Object.keys(bbRecord.data), bbm.supported_sections);
    for (var sec in diff) {
        console.log("removing extra section: ", diff[sec]);
        delete bbRecord.data[diff[sec]];
    }

    npi.process.listOrganizations(bbRecord.data, function (err, orgData) {
        if (err) {
            console.log(err);
        }
        bbRecord.data.organizations = orgData;
        npi.process.listProviders(bbRecord.data, function (err, proData) {
            bbRecord.data.providers = proData;
            if (supported_formats.indexOf(bbRecordType.type) >= 0) {
                callback(null, bbRecordType.type, bbRecord.data);
            } else {
                callback(null);
            }
        });
    });
}

module.exports.extractRecord = extractRecord;
