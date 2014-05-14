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
var record = require('../record');

function getNotifications (callback) {

  //need new record count for my record, merge record count for updates, and sum for total updates.
  var newCount;
  var dupeCount;
  var fileCount;
  var recordCount;


  function checkDone() {
    if (newCount >=0 && dupeCount >=0 && fileCount >=0 && recordCount>=0) {
      var recCount = {
        new_merges: newCount,
        duplicate_merges: dupeCount,
        file_count: fileCount,
        record_count: recordCount
      }
      callback(null, recCount);
    }
  }


  record.mergeCount({merge_reason: "new"}, function(err, count) {
    if (err) {
      callback(err);
    } else {
      newCount = count;
      checkDone();
    }
  });

  record.mergeCount({merge_reason: "duplicate"}, function(err, count) {
    if (err) {
      callback(err);
    } else {
      dupeCount = count;
      checkDone();
    }
  });

  record.recordCount('test', function(err, count) {
    if (err) {
      callback(err);
    } else {
      fileCount = count;
      checkDone();
    }
  });

  record.allergyCount({patKey: 'test'}, function(err, count) {
    if (err) {
      callback(err);
    } else {
      recordCount = count;
      checkDone();
    }


  });


}

app.get('/api/v1/notification', function(req, res) {

  getNotifications(function(err, notificationList) {
    if (err) {
      res.send(400, err);
    } else {
      var notificationJSON = {};
      notificationJSON.notifications = notificationList;
      res.send(notificationJSON);
    }

  });

});


