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

var extractRecord = parser.extractRecord;

function storeFile(inboundFile, inboundFileName, inboundFileType, inboundFileSize, inboundXMLType, callback) {
  var db = app.get("db_conn");
  var grid = app.get("grid_conn");
  var buffer = new Buffer(inboundFile);

  var fileMetadata = {};
  if (inboundXMLType) {
    fileMetadata.fileClass = inboundXMLType;
  }

  grid.put(buffer, {
    metadata: fileMetadata,
    'filename': inboundFileName,
    'content_type': inboundFileType,
  }, function(err, fileInfo) {
    if (err) {
      callback(err);
    } else {
      if (fileInfo.length !== inboundFileSize) {
        callback('file size mismatch');
      } else {
        callback(null, fileInfo);
      }
    }
  });
}

function validateFileMessage(requestObject, callback) {
  //Placeholder validation function.
  callback(null);
}

function saveComponents (masterObject, callback) { 

  saveAllergies(masterObject.allergies, function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });

  //Need to have a final check.

}

function saveAllergies(inputArray, callback) {

  function createAllergyObject(allergyInputObject) {

    var allergySaveObject = {};

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

  function saveAllergyObject (allergySaveObject, allergyObjectNumber, callback) {

    var tempAllergy = new allergy(allergySaveObject);

    tempAllergy.save(function(err, saveResults) {
      if (err) {
        callback(err);
      } else {
        callback(null, allergyObjectNumber, saveResults);
      }
    });


  }

  for (var i = 0; i < inputArray.length; i++) {
    var allergyObject = createAllergyObject(inputArray[i]);
    saveAllergyObject(allergyObject, i, function(err, savedObjectNumber, results) {
      if (savedObjectNumber === (inputArray.length - 1)) {
        callback(null);
      }
    });
  }

}

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
            if (recordUpload.type === 'application/xml') {
              extractRecord(fileData, function(err, xmlType, parsedRecord) {
                storeFile(fileData, recordUpload.name, recordUpload.type, recordUpload.size, xmlType, function(err, fileInfo) {
                  if (err) {
                    callback(err);
                  } else {
                    saveComponents(parsedRecord, function(err, res) {
                      if (err) {
                        callback(err);
                      } else {
                        callback(null);
                      }
                    });
                  }
                });

              });
            } else {

              storeFile(fileData, recordUpload.name, recordUpload.type, recordUpload.size, null, function(err, fileInfo) {
                if (err) {
                  callback(err);
                } else {
                  callback(null);
                }
              });
            }
          }
        });
      }
    });
  }
}
//Routes.
app.put('/api/v1/storage', function(req, res) {

  processUpload(req.files.recordUpload, function(err) {
    if (err) {
      res.send(400, err);
    } else {
      res.send(200);
    }
  });

});

function getRecordList (callback) {
  var db = app.get("db_conn");
  var grid = app.get("grid_conn");


  var responseJSON = {};
  var responseArray = [];

  db.collection('storage.files', function(err, recordCollection) {

    if (err) {
      callback(err);
    } else {
      recordCollection.find( function(err, findResults) {
        findResults.toArray(function(err, recordArray) {

          var recordResponseArray = [];

          for (var i=0; i<recordArray.length; i++) {

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

//Get user record list.
app.get('/api/v1/storage', function(req, res) {

  getRecordList(function(err, recordList) {
    var recordResponse = {};
    recordResponse.storage = recordList;
    res.send(recordResponse);  
  });
  
});






/*
//Post raw record to storage.
app.put('/storage', function(req, res) {



  var source = '';
  var details = '';

  if (req.body.source) {
    source = req.body.source;
  }
  if (req.body.details) {
    details = req.body.details;
  }

  console.log("Storage PUT call");
  //console.log(req.body);

  if (req.body.filename === undefined || req.body.filename.length < 1 || req.body.filename === null) {
    res.statusCode = 400;
    res.end();
    return;
  }

  if (req.body.file === undefined || req.body.file.length < 1 || req.body.file === null) {
    res.statusCode = 400;
    res.end();
    return;
  }

  var fileType = 'binary/octet-stream';
  if (req.body.filename && req.body.filename.length > 3) {
    var extension = req.body.filename.substring(req.body.filename.lastIndexOf(".") + 1, req.body.filename.length);
    if (extension.toLowerCase() === 'xml') {
      fileType = 'text/xml';
    }
  }

  //console.log("---");
  //console.log(req.body.file);
  //console.log("---");

  try {
    var bb = blueButton(req.body.file);

    var bbMeta = bb.document();

    if (bbMeta.type === 'ccda') {
      fileType = "CCDA";
    }
  } catch (e) {
    //do nothing, keep original fileType
    console.log(e);
  }

  //TODO:  Fix once auth is implemented.
  var buffer = new Buffer(req.body.file);
  grid.put(buffer, {
    metadata: {
      source: source,
      details: details,
      owner: req.user.username,
      parsedFlag: false
    },
    'filename': req.body.filename,
    'content_type': fileType
  }, function(err, fileInfo) {
    if (err) {
      throw err;
    }
    var recordId = fileInfo._id;
    //console.log("Record Stored in Gridfs: " + recordId);
    //console.log(fileInfo);
    res.send({
      fileName: fileInfo.filename,
      identifier: fileInfo._id
    });
    return;
  });
});



/*
// expects identifier in body
app.get('/storage/record', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  var userName = req.user.username;
  var responseJSON = {};

  db.collection('storage.files', function(err, coll) {
    if (err) {
      throw err;
    }
    var objectID = new ObjectId(req.body.identifier);
    coll.findOne({
      "_id": objectID,
      "metadata.owner": req.user.username
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
          responseJSON.file = returnFile;
          //db.close();
          //grid.close();
          res.send(responseJSON);
        });
      }
    });
  });
});

app.get('/storage/record/:identifier', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  var userName = req.user.username;
  var responseJSON = {};

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
          //db.close();
          //grid.close();
          res.setHeader('Content-disposition', 'attachment; filename=' + results.filename);
          res.send(returnFile);
        });
      }
    });
  });
});


//Post raw record to storage.
app.put('/storage', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  var user = req.user.username;
  console.log("adding record to store for user: " + user);

  // source - Inbox/Outbox/Upload
  // details - Some details about the file (doctor name (sender )for Inbox, user comments for Upload, doctor name (to whom it was sent) for Outbox)
  var source = '';
  var details = '';

  if (req.body.source) {
    source = req.body.source;
  }
  if (req.body.details) {
    details = req.body.details;
  }

  console.log("Storage PUT call");
  //console.log(req.body);

  if (req.body.filename === undefined || req.body.filename.length < 1 || req.body.filename === null) {
    res.statusCode = 400;
    res.end();
    return;
  }

  if (req.body.file === undefined || req.body.file.length < 1 || req.body.file === null) {
    res.statusCode = 400;
    res.end();
    return;
  }

  var fileType = 'binary/octet-stream';
  if (req.body.filename && req.body.filename.length > 3) {
    var extension = req.body.filename.substring(req.body.filename.lastIndexOf(".") + 1, req.body.filename.length);
    if (extension.toLowerCase() === 'xml') {
      fileType = 'text/xml';
    }
  }

  //console.log("---");
  //console.log(req.body.file);
  //console.log("---");

  try {
    var bb = blueButton(req.body.file);

    var bbMeta = bb.document();

    if (bbMeta.type === 'ccda') {
      fileType = "CCDA";
    }
  } catch (e) {
    //do nothing, keep original fileType
    console.log(e);
  }

  //TODO:  Fix once auth is implemented.
  var buffer = new Buffer(req.body.file);
  grid.put(buffer, {
    metadata: {
      source: source,
      details: details,
      owner: req.user.username,
      parsedFlag: false
    },
    'filename': req.body.filename,
    'content_type': fileType
  }, function(err, fileInfo) {
    if (err) {
      throw err;
    }
    var recordId = fileInfo._id;
    //console.log("Record Stored in Gridfs: " + recordId);
    //console.log(fileInfo);
    res.send({
      fileName: fileInfo.filename,
      identifier: fileInfo._id
    });
    return;
  });
});


//Refactored out so can use internally.
function storeFile(fileRequest, username, callback) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  // source - Inbox/Outbox/Upload
  // details - Some details about the file (doctor name (sender )for Inbox, user comments for Upload, doctor name (to whom it was sent) for Outbox)
  var source = '';
  var details = '';

  if (fileRequest.source) {
    source = fileRequest.source;
  }
  if (fileRequest.details) {
    details = fileRequest.details;
  }

  console.log("Storage PUT call");
  //console.log(fileRequest);

  if (fileRequest.filename === undefined || fileRequest.filename.length < 1 || fileRequest.filename === null) {
    callback('Error, filname bad.');
  }

  if (fileRequest.file === undefined || fileRequest.file.length < 1 || fileRequest.file === null) {
    callback('Error, file bad.');
  }

  var fileType = 'binary/octet-stream';
  if (fileRequest.filename && fileRequest.filename.length > 3) {
    var extension = fileRequest.filename.substring(fileRequest.filename.lastIndexOf(".") + 1, fileRequest.filename.length);
    if (extension.toLowerCase() === 'xml') {
      fileType = 'text/xml';
    }
  }

  //console.log("---");
  //console.log(fileRequest.file);
  //console.log("---");

  try {
    var bb = blueButton(fileRequest.file);

    var bbMeta = bb.document();

    if (bbMeta.type === 'ccda') {
      fileType = "CCDA";
    }
  } catch (e) {
    //do nothing, keep original fileType
    console.log(e);
  }

  //TODO:  Fix once auth is implemented.
  var buffer = new Buffer(fileRequest.file);
  grid.put(buffer, {
    metadata: {
      source: source,
      details: details,
      owner: username,
      parsedFlag: false
    },
    'filename': fileRequest.filename,
    'content_type': fileType
  }, function(err, fileInfo) {
    if (err) {
      throw err;
    }
    var recordId = fileInfo._id;
    //console.log("Record Stored in Gridfs: " + recordId);
    callback(err, fileInfo);
  });

}
module.exports.storeFile = storeFile;

app.del('/storage/:identifier', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  if (req.params.identifier) {
    console.log("deleting record: " + req.params.identifier);
    db.collection('storage.files', function(err, coll) {
      if (err) {
        throw err;
      }
      var objectID = new ObjectId(req.params.identifier);
      coll.findOne({
        "_id": objectID,
        "metadata.owner": req.user.username
      }, function(err, results) {
        if (err) {
          throw err;
        }
        if (results) {
          grid['delete'](objectID, function(err, delres) {
            if (err) {
              throw err;
            }
            res.statusCode = 200;
            res.end();
          });
        }
      });
    });
  }
});

//Pass me an identifier, I give you a preview object.
app.post('/storage/preview', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  db.collection('storage.files', function(err, fileColl) {
    if (err) {
      throw err;
    }
    var objectID = new ObjectId(req.body.identifier);
    fileColl.findOne({
      "_id": objectID
    }, function(err, results) {
      //console.log("results: "+JSON.stringify(results));
      grid.get(objectID, function(err, data) {
        var inputFile = data.toString('utf8');
        var bb = blueButton(inputFile);
        var bbMeta = bb.document();

        if (bbMeta.type !== 'ccda') {
          res.send(200, 'preview unavailable');
        } else {
          var JSONResponse = {};

          var bbAllergies = bb.allergies();
          JSONResponse.allergies = bbAllergies;

          var bbDemographics = bb.demographics();
          JSONResponse.demographics = [bbDemographics];

          var bbEncounters = bb.encounters();
          JSONResponse.encounters = bbEncounters;

          var bbImmunizations = bb.immunizations();
          JSONResponse.immunizations = bbImmunizations;

          var bbResults = bb.labs();
          JSONResponse.results = bbResults;

          var bbMedications = bb.medications();
          JSONResponse.medications = bbMedications;

          var bbProblems = bb.problems();
          JSONResponse.problems = bbProblems;

          var bbProcedures = bb.procedures();
          JSONResponse.procedures = bbProcedures;

          var bbVitals = bb.vitals();
          JSONResponse.vitals = bbVitals;

          res.send(JSONResponse);
        }
      });
    });
  });
});




//Update API, allows one to set the parsedFlag.
// expects parsedFlag and identifier in body
app.post('/storage', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  //Insert bb parsing logic.
  if (req.body.parsedFlag === true) {
    db.collection('storage.files', function(err, fileColl) {
      if (err) {
        throw err;
      }
      var objectID = new ObjectId(req.body.identifier);
      fileColl.findOne({
        "_id": objectID
      }, function(err, results) {
        console.log("results: " + JSON.stringify(results));


        if (err) {
          throw err;
        }
        if (results.metadata.parsedFlag === false) {
          //Need to SAVE update flag to be true.
          results.metadata.parsedFlag = true;
          var r = results;
          fileColl.update({
            "_id": objectID,
            'metadata.owner': req.user.username
          }, {
            $set: {
              'metadata.parsedFlag': true
            }
          }, function(err, index, results2) {
            console.log("results1: " + JSON.stringify(results));
            console.log("results2: " + JSON.stringify(results2));

            if (err) {
              throw err;
            }

            grid.get(objectID, function(err, data) {
              var inputFile = data.toString('utf8');
              //console.log("file: "+inputFile);

              var bb = blueButton(inputFile);

              var bbMeta = bb.document();

              function bbStore() {
                //Counter for all async calls to complete.
                var persistCount = 0;
                var persistElements = 9;

                //Persist Demographics.
                db.collection('demographics', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.demographics();

                  //console.log("demographics: "+JSON.stringify(bbDocument,null, 4));
                  //console.log("demographics: "+JSON.stringify(bbDocument.ethnicity,null, 4));
                  //console.log("demographics: "+bbDocument.ethnicity);


                  //for (var i=0;i<bbDocument.length;i++) {
                  bbDocument.owner = results.metadata.owner;
                  bbDocument.record_id = objectID;
                  bbDocument.approved = false;
                  bbDocument.archived = false;
                  bbDocument.ignored = false;
                  coll.insert(bbDocument, function(err, res) {
                    if (err) {
                      throw err;
                    }
                    persistCount = persistCount + 1;
                    persistComplete();
                  });
                  //}
                });


                function persistDocument(err, res) {
                  if (err) {
                    throw err;
                  }
                  persistCount = persistCount + 1;
                  persistComplete();
                }

                //Persist Allergies.
                db.collection('allergies', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.allergies();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Encounters.
                db.collection('encounters', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.encounters();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Immunizations.
                db.collection('immunizations', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.immunizations();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Labs.
                db.collection('results', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.labs();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Medications.
                db.collection('medications', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.medications();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Problems.
                db.collection('problems', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.problems();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Procedures.
                db.collection('procedures', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.procedures();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                //Persist Vitals.
                db.collection('vitals', function(err, coll) {
                  if (err) {
                    throw err;
                  }
                  var bbDocument = bb.vitals();
                  for (var i = 0; i < bbDocument.length; i++) {
                    bbDocument[i].owner = results.metadata.owner;
                    bbDocument[i].record_id = objectID;
                    bbDocument[i].approved = false;
                    bbDocument[i].archived = false;
                    bbDocument[i].ignored = false;
                    coll.insert(bbDocument[i], persistDocument);
                  }
                });

                function persistComplete() {
                  if (persistCount === persistElements) {
                    res.json({
                      recieved: true
                    });
                  }
                }
              }

              if (bbMeta.type === 'ccda') {

                bbStore();


              }
            });
          });
        } else {
          res.statusCode = 200;
          res.end();
        }
      });
    });
  } else {
    res.statusCode = 400;
    res.end();
  }
});

//Get user record list.
app.get('/storage', auth.ensureAuthenticated, function(req, res) {
  db = app.get("db_conn");
  grid = app.get("grid_conn");

  var userName = req.user.username;
  var responseJSON = {};
  var responseArray = [];

  db.collection('storage.files', function(err, coll) {
    if (err) {
      throw err;
    }
    coll.find({
      'metadata.owner': req.user.username
    }, function(err, results) {
      if (err) {
        throw err;
      }
      results.toArray(function(err, docs) {
        for (var i = 0; i < docs.length; i++) {
          var documentJSON = {};
          documentJSON.fileName = docs[i].filename;
          documentJSON.contentType = docs[i].contentType;
          documentJSON.length = docs[i].length;
          documentJSON.source = docs[i].metadata.source;
          documentJSON.details = docs[i].metadata.details;
          documentJSON.parsedFlag = docs[i].metadata.parsedFlag;
          documentJSON.uploadDate = docs[i].uploadDate;
          documentJSON.identifier = docs[i]._id;
          responseArray.push(documentJSON);
          documentJSON = {};
        }
        responseJSON.files = responseArray;
        responseArray = [];
        //console.log(responseJSON);
        res.json(responseJSON);
        responseJSON = {};
        return;
      });
    });
  });
});*/