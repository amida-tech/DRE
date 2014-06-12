"use strict";

var chai = require('chai');
var _ = require('underscore');

var jsutil = require('../../lib/recordjs/jsutil');

var expect = chai.expect;
var assert = chai.assert;

chai.config.includeStack = true;

describe('underscore sanity checks', function() {
    it('isEmpty', function(done) {
        assert.ok(_.isEmpty({}), "{}");
        assert.notOk(_.isEmpty({x: 1}), "{x: 1}");
        assert.notOk(_.isEmpty({x: false}), "{x: false}");
        assert.ok(_.isEmpty([]), "[]");
        assert.notOk(_.isEmpty([{}, [], {}]), "[{}, [], {}]");
        assert.notOk(_.isEmpty([undefined, undefined, undefined]), "[undefined, undefined, undefined]");
        assert.notOk(_.isEmpty(['a']), "['a']");
        assert.ok(_.isEmpty(new Date()), "new Date()"); // since date has no enumerable property
        
        var a = [0, 1, 2];
        for (var i=0; i<3; ++i) {
            delete a[i];
        }
        assert.notOk(_.isEmpty(a), "array all deleted");
    
        done();
   });

    it('isObject', function(done) {
        assert.ok(_.isObject({}), "{}");
        assert.ok(_.isObject({x: 1}), "{x: 1}");
        assert.ok(_.isObject({x: false}), "{x: false}");
        assert.ok(_.isObject([]), "[]");
        assert.ok(_.isObject(['a']), "['a']");
        assert.ok(_.isObject(new Date()), "new Date()");
        assert.notOk(_.isObject(1), "1");
        assert.notOk(_.isObject('a'), "'a'");
        assert.notOk(_.isObject(false), "false");
        done();
   });
});

describe('chai sanity checks', function() {
    it('shufled array deep equal', function() {
        function f(r, index) {
            var v = {
                a: index,
                b: {
                    c: index + 1
                }
            };
            r.push(v);
            return r;
        }
        var a0 = [0, 1, 2, 3].reduce(f, []);     
        var a1 = [2, 0, 1, 3].reduce(f, []);
        expect(a0).to.deep.include.members(a1);
        expect(a1).to.deep.include.members(a0);
        a0[2].b.c = -1;
        expect(a0).to.not.deep.include.members(a1);
        a1[0].b.c = -1;
        expect(a0).to.deep.include.members(a1);
   });
});

describe('deep delete named property', function() {
    it('level 1', function(done) {
        var input = {
            rem: true,
            re: true,
            remark: true
        };
        expect(input.rem).to.exist;
        expect(input.re).to.equal(true);
        expect(input.remark).to.equal(true);
        jsutil.deepDelete(input, 'rem');
        expect(input.rem).to.not.exist;
        expect(input.re).to.equal(true);
        expect(input.remark).to.equal(true);
        done();
   });

    it('level 2, 3', function(done) {
        var input = {
            rem: true,
            re: {
                rem: true,
                re1: {
                    rem: true,
                    re2: true
                }
            },
            remark: {
                remark1: true,
                rem: true
            },
            rema: {
                rema10: true,
                rema11: {
                    rema2: true,
                    rem: true
                }
            }
        };
        expect(input.rem).to.exist;
        expect(input.re.rem).to.exist;
        expect(input.re.re1.rem).to.exist;
        expect(input.re.re1.re2).to.exist;
        expect(input.remark.remark1).to.exist;
        expect(input.remark.rem).to.exist;
        expect(input.rema.rema10).to.exist;
        expect(input.rema.rema11.rema2).to.exist;
        expect(input.rema.rema11.rem).to.exist;
        jsutil.deepDelete(input, 'rem');
        expect(input.rem).to.not.exist;
        expect(input.re.rem).to.not.exist;
        expect(input.re.re1.rem).to.not.exist;
        expect(input.re.re1.re2).to.exist;
        expect(input.remark.remark1).to.exist;
        expect(input.remark.rem).to.notexist;
        expect(input.rema.rema10).to.exist;
        expect(input.rema.rema11.rema2).to.exist;
        expect(input.rema.rema11.rem).to.not.exist;
        done();
   });
});

describe('deep clean empty', function() {
    it('object/objects/arrays', function(done) {
        var input = [{
            "remain": "remain",
            "remove": {
                "key0": {
                    "arr": []
                },
                "key1": {
                    "arr": []
                }
            }
        }];
        expect(input[0].remove).to.exist;
        jsutil.deepDeleteEmpty(input);
        expect(input[0].remove).to.not.exist;
        expect(input[0].remain).to.exist;
        done();
    });

    it('array/objects/arrays', function(done) {
        var input = [{
            "remain": "remain",
            "remove": [{
                "key0": {
                    "arr": []
                },
                "key1": {
                    "arr": []
                }
            }]
        }];
        expect(input[0].remove).to.exist;
        jsutil.deepDeleteEmpty(input);
        expect(input[0].remove).to.not.exist;
        expect(input[0].remain).to.exist;
       done();
    });


    it('array/objects/objects', function(done) {
        var input = [{
            "remain": "remain",
            "remove": [{
                "key0": {
                    "obj": {},                    
                },
                "key1": {
                    "obj": {}
                }
            }]
        }];
        expect(input[0].remove).to.exist;
        jsutil.deepDeleteEmpty(input);
        expect(input[0].remove).to.not.exist;
        expect(input[0].remain).to.exist;
       done();
    });


    it('array/objects/mixed', function(done) {
        var input = [{
            "remain": "remain",
            "remove": [{
                "key0": {
                    "obj": {},                    
                },
                "key1": {
                    "arr": []
                },
                "key2": {
                    "arr": [],
                    "obj": {}
                }
            }]
        }];
        expect(input[0].remove).to.exist;
        jsutil.deepDeleteEmpty(input);
        expect(input[0].remove).to.not.exist;
        expect(input[0].remain).to.exist;
        done();
    });

    it('array/array/mixed partial', function(done) {
        var input = [{
            "remain": "remain",
            "partial": [
                {
                    "obj": {},                    
                },
                {
                    "v": true
                },
                {
                    "arr": [],
                    "obj": {}
                }
            ]
        }];
        expect(input[0].partial).to.exist;
        jsutil.deepDeleteEmpty(input);
        expect(input[0].partial).to.exist;
        expect(input[0].partial).to.have.length(1);
        expect(input[0].partial[0].v).to.equal(true);
        done();
    });
});
