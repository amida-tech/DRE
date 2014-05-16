/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var should = require('chai').should;
var fs = require('fs');
var storage = require('../../lib/parser/index.js');
var path = require('path');

function loadSampleRecord(callback) {
  var filepath = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
  fs.readFile(filepath, 'utf8', function(err, data) {
    if (err) {
      callback(err);
    }
    callback(null, data);
  });
}


describe('Storage API', function() {
  var sampleFile = '';

  before(function(done) {
    loadSampleRecord(function(err, file) {
      if (err) {
        done(err);
      }
      sampleFile = file;
      done();
    });
  });

  it('Test 1', function(done) {
    storage.extractRecord(sampleFile, function(err, results) {
          done();
    });
  });

});