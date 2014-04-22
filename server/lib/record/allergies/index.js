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
var allergy = require('../../../models/allergies');
var mergeFunctions = require('../../merge');
//Need to refactor to respect merge functions.
var merge = require('../../../models/merges');
var Storage_files = require('../../../models/storage_files');

//Get all allergies.
function getAllergies(callback) {

 allergy.find()
  .lean()
  .populate('metadata.attribution', 'record_id merge_reason merged')
  .exec(function(err, allergyResults) {
    if (err) {
      callback(err);
    } else {
      Storage_files.populate(allergyResults, {path: 'metadata.attribution.record_id', select: 'filename'}, function(err, docs) {
        if (err) {
          callback(err);
        } else {
          //May be part of model?
          var serverityReference = {
            "Mild": 1,
            "Mild to Moderate": 2,
            "Moderate": 3,
            "Moderate to Severe": 4,
            "Severe": 5,
            "Fatal": 6
          };

          for (var i=0;i<docs.length;i++) {
            for (severity in serverityReference) {
              if (severity.toUpperCase() === docs[i].severity.toUpperCase()) {
                docs[i].severity_weight = serverityReference[severity];
              }
            }
          }
          
          callback(null, docs);
        }
      });
      
    }
  });

}

//Gets a single allergy based on id.
function getAllergy(input_id, callback) {
  allergy.findOne({
    _id: input_id
  }, function(err, allergyEntry) {
    if (err) {
      callback(err);
    } else {
      callback(null, allergyEntry);
    }
  });
}

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

module.exports.getAllergy = getAllergy;
//module.exports.updateAllergy = updateAllergy;

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

//Saves an array of incoming allergies.
function saveAllergies(inputArray, sourceID, callback) {

  function saveAllergyObject(allergySaveObject, allergyObjectNumber, inputSourceID, callback) {

    var tempAllergy = new allergy(allergySaveObject);

    tempAllergy.save(function(err, saveResults) {
      if (err) {
        callback(err);
      } else {


        var tmpMergeEntry = {
          entry_type: 'allergy',
          allergy_id: saveResults._id,
          record_id: inputSourceID,
          merged: new Date(),
          merge_reason: 'new'
        }

        mergeFunctions.saveMerge(tmpMergeEntry, function(err, mergeResults) {
          if (err) {
            callback(err);
          } else {
            console.log('hit');
            tempAllergy.metadata.attribution.push(mergeResults._id);
            tempAllergy.save(function(err, saveResults) {
              if (err) {
                callback(err);
              } else {
                callback(null, allergyObjectNumber);
              }
            });

            
          }
        });
      }
    });

  }

  for (var i = 0; i < inputArray.length; i++) {
    var allergyObject = inputArray[i];
    saveAllergyObject(allergyObject, i, sourceID, function(err, savedObjectNumber) {
      if (savedObjectNumber === (inputArray.length - 1)) {
        callback(null);
      }
    });
  }

}

//Get all allergies API.
app.get('/api/v1/record/allergies', function(req, res) {

  getAllergies(function(err, allergyList) {
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


module.exports.getAllergies = getAllergies;
module.exports.saveAllergies = saveAllergies;