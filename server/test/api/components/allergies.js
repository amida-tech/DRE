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

var expect = require('chai').expect;
var supertest = require('supertest');
var deploymentLocation = 'http://' + 'localhost' + ':' + '3000';
var api = supertest.agent(deploymentLocation);
var fs = require('fs');
var common = require('../common/common.js');
var path = require('path');

describe('Allergies API', function() {

  before(function(done) {
    var filepath = path.join(__dirname, '/../../artifacts/standard/CCD_demo1.xml');
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

  //Note:  Ignoring metadata and patKey for now.
  it('Test - Sample File One', function(done) {
    api.get('/api/v1/record/allergies')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        //Meta Test.
        expect(res.body).to.exist;
        expect(res.body.allergies).to.exist;

        //Test object 1.
        var object_one = res.body.allergies[0];
        expect(object_one.code).to.equal('314422');
        expect(object_one.code_system_name).to.equal('RXNORM');
        expect(object_one.date).to.be.an('array');
        expect(object_one.date[0].date).to.equal('2007-05-01T00:00:00.000Z');
        expect(object_one.date[0].precision).to.equal('day');
        expect(object_one.identifiers).to.be.an('array');
        expect(object_one.identifiers[0].identifier).to.equal('4adc1020-7b14-11db-9fe1-0800200c9a66');
        expect(object_one.name).to.equal('ALLERGENIC EXTRACT, PENICILLIN');
        expect(object_one.reaction).to.be.an('array');
        expect(object_one.reaction[0].severity).to.equal('Mild');
        expect(object_one.reaction[0].name).to.equal('Nausea');
        expect(object_one.reaction[0].code).to.equal('422587007');
        expect(object_one.reaction[0].code_system_name).to.equal('SNOMED CT');
        expect(object_one.severity).to.equal('Moderate to severe');
        expect(object_one.status).to.equal('Inactive');
        expect(object_one._id).to.be.a('string');
        expect(object_one._id.length).to.equal(24);

        //Test object 2.
        var object_two = res.body.allergies[1];
        expect(object_two.code).to.equal('2670');
        expect(object_two.code_system_name).to.equal('RXNORM');
        expect(object_two.date).to.be.an('array');
        expect(object_two.date[0].date).to.equal('2006-05-01T00:00:00.000Z');
        expect(object_two.date[0].precision).to.equal('day');
        expect(object_two.identifiers).to.be.an('array');
        expect(object_two.identifiers[0].identifier).to.equal('4adc1020-7b14-11db-9fe1-0800200c9a66');
        expect(object_two.name).to.equal('Codeine');
        expect(object_two.reaction).to.be.an('array');
        expect(object_two.reaction[0].severity).to.equal('Mild');
        expect(object_two.reaction[0].name).to.equal('Wheezing');
        expect(object_two.reaction[0].code).to.equal('56018004');
        expect(object_two.reaction[0].code_system_name).to.equal('SNOMED CT');
        expect(object_two.severity).to.equal('Moderate');
        expect(object_two.status).to.equal('Active');
        expect(object_two._id).to.be.a('string');
        expect(object_two._id.length).to.equal(24);

        //Test object 3.
        var object_three = res.body.allergies[2];
        expect(object_three.code).to.equal('1191');
        expect(object_three.code_system_name).to.equal('RXNORM');
        expect(object_three.date).to.be.an('array');
        expect(object_three.date[0].date).to.equal('2008-05-01T00:00:00.000Z');
        expect(object_three.date[0].precision).to.equal('day');
        expect(object_three.identifiers).to.be.an('array');
        expect(object_three.identifiers[0].identifier).to.equal('4adc1020-7b14-11db-9fe1-0800200c9a66');
        expect(object_three.name).to.equal('Aspirin');
        expect(object_three.reaction).to.be.an('array');
        expect(object_three.reaction[0].severity).to.equal('Mild to moderate');
        expect(object_three.reaction[0].name).to.equal('Hives');
        expect(object_three.reaction[0].code).to.equal('247472004');
        expect(object_three.reaction[0].code_system_name).to.equal('SNOMED CT');
        expect(object_three.severity).to.equal('Mild to moderate');
        expect(object_three.status).to.equal('Active');
        expect(object_three._id).to.be.a('string');
        expect(object_three._id.length).to.equal(24);

        done();
      });
  });

  after(function(done) {
      common.removeDatabase(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

});