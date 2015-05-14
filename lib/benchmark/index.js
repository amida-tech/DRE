var fs = require("fs");

var jsdom = require("jsdom");
var libxmljs = require("libxmljs");

var xmldom = require("xmldom");
var bb = require("blue-button");
var bbxml = require("blue-button-xml");
var bbcms = require("blue-button-cms");
var bbg = require("blue-button-generate");
var bbfhir = require("blue-button-fhir");
var bbu = require("blue-button-util");

// from http://ejohn.org/blog/javascript-benchmark-quality/
function runTest(name, test, next) {
    var runs = [],
        r = 0;

    setTimeout(function () {
        var start = (new Date).getTime(),
            diff = 0;

        for (var n = 0; diff < 1000; n++) {
            test();
            diff = (new Date).getTime() - start;
        }

        runs.push(n);

        if (r++ < 4) {
            setTimeout(arguments.callee, 0);
        } else {
            done(name, runs);
            if (next) {
                setTimeout(next, 0);
            }
        }
    }, 0);
}

function done(name, runs) {
    var timestamp = new Date();
    var res = {
        time: timestamp,
        test: name,
        runs: runs
    };
    fs.appendFile('lib/benchmark/benchmark.json', JSON.stringify(res) + ", ", function (err) {
        if (err) {
            throw err;
        }
    });
}

// from libxmljs
var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<root>' +
    '<child foo="bar">' +
    '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
    '</child>' +
    '<sibling>with content!</sibling>' +
    '</root>';

var xml = fs.readFileSync('test/artifacts/benchmark/ccd.xml', 'utf-8');

var cms = fs.readFileSync("test/artifacts/benchmark/cms.txt").toString();

var doc = bb.parse(xml);

// for FHIR test
// compile FHIR bundle
var cases_a = require('../../test/artifacts/fhir/unit/allergyIntolerance');
var cases_c = require('../../test/artifacts/fhir/unit/condition');
var cases_ma = require('../../test/artifacts/fhir/unit/medicationAdministration');
var cases_mp = require('../../test/artifacts/fhir/unit/medicationPrescription');
var cases_ors = require('../../test/artifacts/fhir/unit/observation-result-single');
var cases_or = require('../../test/artifacts/fhir/unit/observation-result');
var cases_ov = require('../../test/artifacts/fhir/unit/observation-vital');
var cases_p = require('../../test/artifacts/fhir/unit/patient');

var arrayset = bbu.arrayset;
var resources = [];
var sections = [
    'allergies',
    'problems',
    'medications',
    'medications',
    'results',
    'results',
    'vitals'
];
[cases_a, cases_c, cases_ma, cases_mp, cases_ors, cases_or, cases_ov].forEach(function (cmodule, index) {
    var sectionName = sections[index];
    cmodule.forEach(function (c) {
        arrayset.append(resources, c.resources);
    });
});
arrayset.append(resources, cases_p[0].resources);
var bundle = {
    resourceType: 'Bundle',
    entry: resources
};
var actual = bbfhir.toModel(bundle);

function test1() {
    var doc1 = libxmljs.parseXml(xml);
}

function test2() {
    var doc2 = jsdom.jsdom(xml);
}

function test3() {
    var doc3 = new xmldom.DOMParser().parseFromString(xml, 'text/xml');
}

function bbtest() {
    var doc4 = bb.parse(xml);
}

function bbxmltest() {
    var doc5 = bbxml.xmlUtil.parse(xml);
}

function bbcmstest() {
    var doc6 = bbcms.parseText(cms);
}

function bbgtest() {
    var doc7 = bbg.generateCCD(doc);
}

function bbfhirtest() {
    var doc8 = bbfhir.toModel(bundle);
}

try {
    fs.truncateSync('lib/benchmark/benchmark.json', 0);
} catch (ex) {}

runTest("jsdom", test2);

runTest("libxmljs", test1);

runTest("xmldom", test3);

runTest("bb", bbtest);

runTest("bbxml", bbxmltest);

runTest("bbcms", bbcmstest);

runTest("bbg", bbgtest);

runTest("bbfhir", bbfhirtest);
