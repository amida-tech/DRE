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
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var path = require('path');

describe('Immunizations API', function() {

  before(function(done) {
    var filepath = path.join(__dirname, '../../artifacts/standard/CCD_demo1.xml');
    api.put('/api/v1/storage')
      .attach('file', filepath)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Immunizations test', function(done) {
    api.get('/api/v1/record/immunizations')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        console.log(res.body);
        done();
      });
  });

});
