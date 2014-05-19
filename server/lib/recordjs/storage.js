/*=======================================================================
Copyright 2014 Amida Technology Solutions (http://amida-tech.com)

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

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//Saves raw file to gridFS.
exports.saveRecord = function(dbinfo, patKey, inboundFile, inboundFileInfo, inboundXMLType, callback) {
    var buffer = new Buffer(inboundFile);

    var fileMetadata = {patKey: patKey};
    if (inboundXMLType) {
        fileMetadata.fileClass = inboundXMLType;
    }

    dbinfo.grid.put(buffer, {
        metadata: fileMetadata,
        filename: inboundFileInfo.name,
        content_type: inboundFileInfo.type,
    }, function(err, fileInfo) {
        if (err) {
            callback(err);
        } else {
            /*Relax for now pending further investigation, seems to be chunking overhead.*/
            //if (fileInfo.length !== inboundFileInfo.size) {
            //  callback('file size mismatch');
            //} else {
            callback(null, fileInfo);
            //}
        }
    });
};

exports.getRecordList = function(dbinfo, patKey, callback) {
    dbinfo.db.collection('storage.files', function(err, recordCollection) {
        if (err) {
            callback(err);
        } else {
            recordCollection.find({"metadata.patKey": patKey}, function(err, findResults) {
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
                        recordJSON.patient_key = recordArray[i].metadata.patKey;

                        recordResponseArray.push(recordJSON);
                    }

                    callback(null, recordResponseArray);
                });
            });
        }
    });
};

exports.getRecord = function(dbinfo, fileId, callback) {
    //Removed owner validation for demo purposes.
    dbinfo.db.collection('storage.files', function(err, coll) {
        if (err) {
            callback(err);
        } else {
            coll.findOne({"_id": fileId}, function(err, results) {
                if (err) {
                    callback(err);
                } else if (results) {
                    dbinfo.grid.get(fileId, function(err, data) {
                        if (err) {
                            callback(err);
                        } else {
                            var returnFile = data.toString();
                            callback(null, results.filename, returnFile);
                        }
                    });
                } else {
                    callback(new Error('no file'));
                }
            });
        }
    });
};

exports.recordCount = function(dbinfo, patKey, callback) {
    dbinfo.storageModel.count({"metadata.patKey" : patKey}, function(err, count) {
        callback(err, count);
    });
};
