var fs = require("fs");

var jsdom = require("jsdom");
var libxmljs = require("libxmljs");

var xmldom = require("xmldom");
var bb = require("blue-button");
var bbxml = require("blue-button-xml");
var bbcms = require("blue-button-cms");
var bbg = require("blue-button-generate");


// from http://ejohn.org/blog/javascript-benchmark-quality/
function runTest(name, test, next) {
    var runs = [],
        r = 0;

    setTimeout(function() {
        var start = (new Date).getTime(),
            diff = 0;

        for (var n = 0; diff < 1000; n++) {
            test();
            diff = (new Date).getTime() - start;
        }

        runs.push(n);

        if (r++ < 4)
            setTimeout(arguments.callee, 0);
        else {
            done(name, runs);
            if (next)
                setTimeout(next, 0);
        }
    }, 0);
}


// from libxmljs
var xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<root>' +
    '<child foo="bar">' +
    '<grandchild baz="fizbuzz">grandchild content</grandchild>' +
    '</child>' +
    '<sibling>with content!</sibling>' +
    '</root>';

var xml = fs.readFileSync('test/artifacts/standard/CCD_demo1.xml', 'utf-8');

var cms = fs.readFileSync("test/artifacts/cms/sample.txt").toString();

var doc = bb.parse(xml);


function test1() {
    var doc1 = libxmljs.parseXml(xml);
}

function test2() {
    var doc2 = jsdom.jsdom(xml, jsdom.level(1, "core"));
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

function done(name, runs) {
    var timestamp = new Date();
    var printString = {
        "time": timestamp,
        "test": name,
        "runs": runs
    };
    console.log(printString);
}

runTest("jsdom", test2);
runTest("libxmljs", test1);
runTest("xmldom", test3);

runTest("bb", bbtest);
runTest("bbxml", bbxmltest);
runTest("bbcms", bbcmstest);
runTest("bbg", bbgtest);


/*

Sample output:

libxmljs: 8ms
jsdom: 664ms
xmldom: 86ms

test: jsdom, runs: 11,12,12,12,12
test: libxmljs, runs: 578,585,603,603,603
test: xmldom, runs: 80,96,109,108,114

*/
