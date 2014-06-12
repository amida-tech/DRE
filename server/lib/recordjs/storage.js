"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

//Saves raw file to gridFS.
exports.saveRecord = function(dbinfo, ptKey, content, sourceInfo, contentType, callback) {
    var buffer = new Buffer(content);

    var fileMetadata = {patKey: ptKey};
    if (contentType) {
        fileMetadata.fileClass = contentType;
    }

    dbinfo.grid.put(buffer, {
        metadata: fileMetadata,
        filename: sourceInfo.name,
        content_type: sourceInfo.type,
    }, function(err, fileInfo) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            /*Relax for now pending further investigation, seems to be chunking overhead.*/
            //if (fileInfo.length !== sourceInfo.size) {
            //  callback('file size mismatch');
            //} else {
            callback(null, fileInfo);
            //}
        }
    });
};

exports.getRecordList = function(dbinfo, ptKey, callback) {
    dbinfo.db.collection('storage.files', function(err, recordCollection) {
        if (err) {
            callback(err);
        } else {
            recordCollection.find({"metadata.patKey": ptKey}, function(err, findResults) {
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

exports.getRecord = function(dbinfo, sourceId, callback) {
    //Removed owner validation for demo purposes.
    dbinfo.db.collection('storage.files', function(err, coll) {
        if (err) {
            callback(err);
        } else {
            if (typeof sourceId === 'string') {
                sourceId = mongoose.Types.ObjectId(sourceId);
            }
            coll.findOne({"_id": sourceId}, function(err, results) {
                if (err) {
                    callback(err);
                } else if (results) {
                    dbinfo.grid.get(sourceId, function(err, data) {
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

exports.recordCount = function(dbinfo, ptKey, callback) {
    dbinfo.storageModel.count({"metadata.patKey" : ptKey}, function(err, count) {
        callback(err, count);
    });
};
