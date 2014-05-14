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

var express = require('express');
var app = module.exports = express();
var mergeFunctions = require('../../merge');
//Need to refactor to respect merge functions.
var merge = require('../../../models/merges');
var record = require('../../record');

function updateAllergyAndMerge (input_allergy, sourceID, callback) {
    var tmpMergeEntry = {
            entry_type: 'allergy',
            allergy_id: input_allergy._id,
            record_id: sourceID,
            merged: new Date(),
            merge_reason: 'duplicate'
    }

    mergeFunctions.saveMerge(tmpMergeEntry, function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            input_allergy.metadata.attribution.push(saveResults._id);
            updateAllergy(input_allergy, function(err, saveObject) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    })
}

module.exports.updateAllergyAndMerge = updateAllergyAndMerge;

function updateAllergy(input_allergy, callback) {

  input_allergy.save(function(err, saveObject) {
    if (err) {
      callback(err);
    } else {
      callback(null, saveObject);
    }
  });
}

app.get('/api/v1/record/allergies', function(req, res) {
    record.getAllergies(function(err, allergyList) {
        if (err) {
            res.send(400, err);
        } else {
            var allergyJSON = {};
            allergyJSON.allergies = allergyList;
            res.send(allergyJSON);
        }
    });
});
