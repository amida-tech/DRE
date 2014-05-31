/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var bbjs = require('blue-button');
var match = require("blue-button-match");

//var match = require('../lib/match.js');
//var compare = require('../lib/compare-partial.js').compare;
//var lookups = require('../lib/lookups.js');
//var equal = require('deep-equal');

var js, js2, js3, js4;

var lookup = [
    'allergies',
    'encounters',
    'immunizations',
    'results',
    'medications',
    'problems',
    'procedures',
    'vitals',
    'demographics',
    'socialHistory',
];


before(function(done) {
    /*
        01 - original record (with all sections populated)
        02 - duplicate
        03 - all sections updated (e.g. only dups (old) and new (new) matches triggered)
        04 - all sections updated with data that triggers partial matching (scenario: record comes from different doctor)
    */
    var xml = fs.readFileSync('test/artifacts/demo-r1.0/bluebutton-01-original.xml').toString();
    var xml2 = fs.readFileSync('test/artifacts/demo-r1.0/bluebutton-02-duplicate.xml').toString();
    var xml3 = fs.readFileSync('test/artifacts/demo-r1.0/bluebutton-03-updated.xml').toString();
    var xml4 = fs.readFileSync('test/artifacts/demo-r1.0/bluebutton-04-diff-source-partial-matches.xml').toString();

    js = bbjs.parseString(xml).data;
    js2 = bbjs.parseString(xml2).data;
    js3 = bbjs.parseString(xml3).data;
    js4 = bbjs.parseString(xml4).data;

    //save JSON into artifacts folder (just for reference and manual inspection)
    fs.writeFileSync('test/artifacts/demo-r1.0/json/bluebutton-01-original.json', JSON.stringify(js, null, 4));
    fs.writeFileSync('test/artifacts/demo-r1.0/json/bluebutton-02-duplicate.json', JSON.stringify(js2, null, 4));
    fs.writeFileSync('test/artifacts/demo-r1.0/json/bluebutton-03-updated.json', JSON.stringify(js3, null, 4));
    fs.writeFileSync('test/artifacts/demo-r1.0/json/bluebutton-04-diff-source-partial-matches.json', JSON.stringify(js4, null, 4));

    //bb4 = bbjs.parseString(xml4).data;

    //console.log(js);
    done();
});


describe('Verifying demo R1.0 sample xml files', function() {


    it('checking for all sections present in each demo file', function() {

        for (var section in lookup) {
            //console.log(lookup[section]);

            //console.log(" >js");
            expect(js[lookup[section]]).to.exist;
            //console.log(" >js2");
            expect(js2[lookup[section]]).to.exist;
            //console.log(" >js3");
            expect(js3[lookup[section]]).to.exist;
            //console.log(" >js4");
            expect(js4[lookup[section]]).to.exist;
        }

        /*
            var m = match.match(bb, bb);

            //console.log(JSON.stringify(m,null,4));

            expect(m).to.be.ok;
            expect(m).to.have.property("match");

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {

                    expect(m["match"]).to.have.property(name);

                    for (var item in m["match"][name]) {
                        expect(m["match"][name][item].match).to.equal("duplicate");
                        expect(m["match"][name][item]).to.have.property('src_id');
                        expect(m["match"][name][item]).to.have.property('dest_id');
                    }
                }
            }
            */

    });


    it('checking that JSON #1 agains empty master record', function() {
        //console.log(js);
        var m0 = match.match(js, {});

        //console.log(JSON.stringify(m,null,4));

        for (var section in lookup) {
            for (el in m0.match[lookup[section]]) {
                expect(m0.match[lookup[section]][el].match).to.equal("new");
            }
        }

    });


    it('checking that JSON #1 and #2 are duplicates', function() {
        //console.log(js);
        var m = match.match(js, js2);

        fs.writeFileSync('test/artifacts/demo-r1.0/matches/02-in-01.json', JSON.stringify(m, null, 4));

        //console.log(JSON.stringify(m,null,4));

        for (var section in lookup) {
            for (el in m.match[lookup[section]]) {
                expect(m.match[lookup[section]][el].match).to.equal("duplicate");
            }
        }

    });


    it('checking that matches between JSON #3 and #1 are just new or duplicates entries', function() {
        var m2 = match.match(js3, js);

        fs.writeFileSync('test/artifacts/demo-r1.0/matches/03-in-01.json', JSON.stringify(m2, null, 4));
        //console.log(JSON.stringify(m2,null,4));

        for (var section in lookup) {
            //console.log(lookup[section]);
            //console.log(m2.match[lookup[section]]);
            for (el in m2.match[lookup[section]]) {
                expect(m2.match[lookup[section]][el].match).to.not.equal("partial");
                assert.include(["duplicate", "new"], m2.match[lookup[section]][el].match);
            }
        }

    });

    it('checking that matches between JSON #4 and #3 has partial or diff entries', function() {
        var m3 = match.match(js4, js3);

        fs.writeFileSync('test/artifacts/demo-r1.0/matches/04-in-03.json', JSON.stringify(m3, null, 4));
        //console.log(JSON.stringify(m3,null,4));

        for (var section in lookup) {
            //console.log(lookup[section]);
            //console.log(m3.match[lookup[section]]);
            var count = 0;
            for (var el in m3.match[lookup[section]]) {
                var mmm = m3.match[lookup[section]][el].match;

                if (mmm === "partial" || mmm === "diff") {
                    count = count + 1;
                }
                //assert.include(["duplicate", "new", "diff", "partial"],m3.match[lookup[section]][el].match);
                expect(count > 0).to.be.true;
            }
        }

    });


});
