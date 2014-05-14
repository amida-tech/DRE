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

function createAllergyObjectMetaData(allergyInputObject, sourceID) {

  allergyInputObject.metadata = {};
  allergyInputObject.metadata.attribution = [];

  var allergyAttribution = {};

  if (sourceID) {
    allergyAttribution = {
      record_id: sourceID,
      attributed: new Date(),
      attribution: 'new'
    }
  }

  allergyInputObject.metadata.attribution.push(allergyAttribution);

  return allergyInputObject;

}


function createAllergyObject(allergyInputObject) {

  //console.log(allergyInputObject);

  var allergySaveObject = {};

  //allergySaveObject.metadata = {};
  //allergySaveObject.metadata.attribution = [];

  //var allergyAttribution = {};

  //if (sourceID) {
  //  allergyAttribution = {
  //    record_id: sourceID,
  //    attributed: new Date(),
  //    attribution: 'new'
  //  }
  //}

  //allergySaveObject.metadata.attribution.push(allergyAttribution);

  //Really need to do much better validation all in here.

  if (allergyInputObject.date_range) {
    allergySaveObject.date_range = {};
    allergySaveObject.date_range.start = allergyInputObject.date_range.start;
    allergySaveObject.date_range.end = allergyInputObject.date_range.end;
  }

  if (allergyInputObject.name) {
    allergySaveObject.name = allergyInputObject.name;
  }

  if (allergyInputObject.code) {
    allergySaveObject.code = allergyInputObject.code;
  }

  if (allergyInputObject.code_system) {
    allergySaveObject.code_system = allergyInputObject.code_system;
  }

  if (allergyInputObject.code_system_name) {
    allergySaveObject.code_system_name = allergyInputObject.code_system_name;
  }

  if (allergyInputObject.status) {
    allergySaveObject.status = allergyInputObject.status;
  }

  if (allergyInputObject.severity) {
    allergySaveObject.severity = allergyInputObject.severity;
  }

  if (allergyInputObject.reaction) {
    allergySaveObject.reaction = {};
    allergySaveObject.reaction.name = allergyInputObject.reaction.name;
    allergySaveObject.reaction.code = allergyInputObject.reaction.code;
    allergySaveObject.reaction.code_system = allergyInputObject.reaction.code_system;
  }

  return allergySaveObject;
}

module.exports.createAllergyObject = createAllergyObject;

//Get all allergies API.
app.get('/api/v1/record/allergies', function(req, res) {
    record.getAllergies(function(err, allergyList) {
        if (err) {
            res.send(400, err);
        } else {
            var allergyJSON = {};
            allergyJSON.allergies = allergyList;
            //console.log(allergyJSON.allergies[0].metadata.attribution);
            res.send(allergyJSON);
        }
    });
});
