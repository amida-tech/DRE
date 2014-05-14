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
var mongo = require('mongodb');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
var app = module.exports = express();
var Db = mongo.Db;
var Grid = mongo.Grid;
var parser = require('../parser/index.js');
var allergy = require('../../models/allergies');
var allergyFunctions = require('../record/allergies');
var dre = require('../dre/index.js');

var extractRecord = parser.extractRecord;
var record = require('../record');

function validateFileMessage(requestObject, callback) {
  //Placeholder validation function.
  callback(null);
}

//Wrapper function to save all components of an incoming object.
function saveComponents(masterObject, sourceID, callback) {

  //console.log(masterObject);
  if (masterObject.allergies.length > 0) {
    allergyFunctions.saveAllergies(masterObject.allergies, sourceID, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  } else {
    callback(null);
    //Need to have a final check.
  }
}

function getSavedComponents(callback) {

  var savedObject = {};

  allergyFunctions.getAllergies(function(err, savedAllergies) {
    savedObject.allergies = savedAllergies;
    callback(null, savedObject);
  });
}

function attemptParse(recordType, recordData, callback) {
  //console.log(recordType);
  if (recordType === 'application/xml' || recordType === 'text/xml') {
    extractRecord(recordData, function(err, xmlType, parsedRecord) {
      if (err) {
        callback(err);
      } else {
        if (xmlType === 'ccda') {
          callback(null, xmlType, parsedRecord);
        } else {
          callback(null, null);
        }
      }
    });
  } else {
    callback(null, null);
  }
}

//Master wrapper function.
function processUpload(recordUpload, callback) {
  if (!recordUpload) {
    callback('Wrong object name');
  } else {
    validateFileMessage(recordUpload, function(err) {
      if (err) {
        callback(err);
      } else {
        fs.readFile(recordUpload.path, 'utf8', function(err, fileData) {
          if (err) {
            callback(err);
          } else {
            attemptParse(recordUpload.type, fileData, function(err, recType, recParsed) {
              if (err) {
                callback(err);
              } else if (!recType) {
                record.storeFile(fileData, recordUpload, null, function(err, fileInfo) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null);
                  }
                });
              } else {
                record.storeFile(fileData, recordUpload, recType, function(err, fileInfo) {
                  if (err) {
                    callback(err);
                  } else {
                    getSavedComponents(function(err, recSaved) {
                      if (err) {
                        callback(err);
                      } else {
                        dre.reconcile(recParsed, recSaved, fileInfo._id, function(err, recMatchResults) {
                          //console.log(recMatchResults);
                          saveComponents(recMatchResults, fileInfo._id, function(err, res) {
                            if (err) {
                              callback(err);
                            } else {
                              callback(null);
                            }
                          });
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
}


app.get('/api/v1/storage/record/:identifier', function(req, res) {
  db = record.db_conn;
  grid = record.grid_conn;

  //Removed owner validation for demo purposes.
  db.collection('storage.files', function(err, coll) {
    if (err) {
      throw err;
    }
    var objectID = new ObjectId(req.params.identifier);
    coll.findOne({
      "_id": objectID
    }, function(err, results) {
      if (err) {
        throw err;
      }
      if (results) {
        grid.get(objectID, function(err, data) {
          if (err) {
            throw err;
          }
          var returnFile = data.toString();
          //res.attachment();
          res.setHeader('Content-disposition', 'attachment; filename=' + results.filename);
          res.send(returnFile);
        });
      }
    });
  });
});

function getRecordList(callback) {
  var db = record.db_conn;
  var grid = record.grid_conn;


  var responseJSON = {};
  var responseArray = [];

  db.collection('storage.files', function(err, recordCollection) {

    if (err) {
      callback(err);
    } else {
      recordCollection.find(function(err, findResults) {
        findResults.toArray(function(err, recordArray) {

          var recordResponseArray = [];

          for (var i = 0; i < recordArray.length; i++) {

            var recordJSON = {};

            recordJSON.file_id = recordArray[i]._id;
            recordJSON.file_name = recordArray[i].filename;
            recordJSON.file_size = recordArray[i].length;
            recordJSON.file_mime_type = recordArray[i].contentType;
            recordJSON.file_upload_date = recordArray[i].uploadDate;

            if (recordArray[i].metadata.fileClass) {
              recordJSON.file_class = recordArray[i].metadata.fileClass;
            }

            recordResponseArray.push(recordJSON);
          }

          callback(null, recordResponseArray);
        });

      });
    }
  });

}

//Routes.

//Returns list of records in storage.
app.get('/api/v1/storage', function(req, res) {

  getRecordList(function(err, recordList) {
    var recordResponse = {};
    recordResponse.storage = recordList;
    res.send(recordResponse);
  });

});

//Uploads a file into storage.
app.put('/api/v1/storage', function(req, res) {

  //console.log(req.files.file);

  processUpload(req.files.file, function(err) {
    if (err) {
      console.error(err);
      res.send(400, err);
    } else {
      res.send(200);
    }
  });

});
