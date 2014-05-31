"use strict";

var record = require('../../lib/recordjs');

describe('Storage API', function() {

    it('Test 1', function(done) {
        record.connectDatabase('localhost', function(err) {
            record.getRecordList('test', function(err, res) {
                done();
            });
        });
    });

});
