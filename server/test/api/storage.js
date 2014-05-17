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
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var databaseLocation = 'mongodb://' + 'localhost' + '/' + 'dre';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');

if (process.cwd().indexOf('test') > -1) {
  var cwd = process.cwd().substring(0, (process.cwd().indexOf('test') - 1));
} else {
  var cwd = process.cwd();
}

function loadSampleRecord(callback) {
<<<<<<< HEAD
  fs.readFile(cwd + '/test/artifacts/standard/CCD_demo1.xml', 'utf8', function(err, data) {
    if (err) {
      callback(err);
    }
    callback(null, data);
  });
=======
    var filepath = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
    fs.readFile(filepath, 'utf8', function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
>>>>>>> afsin
}


describe('Storage API', function() {
  var sampleFile = '';

  before(function(done) {
    loadSampleRecord(function(err, file) {
      if (err) {
        done(err);
      } else {
          sampleFile = file;
          done();
      }
    });
  });

  it('File Endpoint PUT', function(done) {
    var filepath = path.join(__dirname, '../artifacts/standard/CCD_demo1.xml');
    api.put('/api/v1/storage')
<<<<<<< HEAD
      .attach('file', cwd + '/test/artifacts/standard/CCD_demo1.xml')
=======
      .attach('file', filepath)
>>>>>>> afsin
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

});

describe('Storage API Get list', function() {

  it('File Endpoint GET', function(done) {
    api.get('/api/v1/storage')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        } else {
          done();
        }
      });
  });

  it('Download File GET', function(done) {
    api.get('/api/v1/storage')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        } else {
          api.get('/api/v1/storage/record/' + res.body.storage[0].file_id)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            } else {
              done();
            }
          });
        }
      });
  });

});