var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');

  var supportedComponents = [
    'allergies',
    'procedures',
    'medications',
    'encounters',
    'vitals',
    'results',
    'social_history',
    'immunizations',
    'demographics',
    'problems',
    'insurance',
    'claims'
  ];

function getNotifications (callback) {

  var newCount = 0;
  var newDone = false;
  var dupeCount = 0;
  var dupeDone = false;
  var fileCount = 0;
  var fileDone = false;
  var partialCount = 0;
  var partialDone = false;


  function checkDone() {
    if (newDone === true && partialDone === true && fileDone === true && dupeDone === true) {
      var recCount = {
        unreviewed_merges: partialCount,
        new_merges: newCount,
        duplicate_merges: dupeCount,
        file_count: fileCount,
      };
      callback(null, recCount);
    }
  }

  function getPartialCount(callback) {
    var secIteration = 0;
    var secTotal = supportedComponents.length;

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        partialDone = true;
        callback();
      }
    }

    supportedComponents.forEach(function(component) {
      record.matchCount(component, 'test', {}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          partialCount = partialCount + count;
          checkCountComplete();
        }
      });
    });
  }

  getPartialCount(function(err) {
    checkDone();
  });

  function getNewMergeCount(callback) {
    var secIteration = 0;
    var secTotal = supportedComponents.length;

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        newDone = true;
        callback();
      }
    }

    supportedComponents.forEach(function(component) {
      record.mergeCount(component, 'test', {merge_reason: "new"}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          newCount = newCount + count;
          checkCountComplete();
        }
      });
    });
  }

  getNewMergeCount(function(err) {
    checkDone();
  });

  function getDupeMergeCount(callback) {
    var secIteration = 0;
    var secTotal = supportedComponents.length;

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        dupeDone = true;
        callback();
      }
    }

    supportedComponents.forEach(function(component) {
      record.mergeCount(component, 'test', {merge_reason: "duplicate"}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          dupeCount = dupeCount + count;
          checkCountComplete();
        }
      });
    });
  }

  getDupeMergeCount(function(err) {
    checkDone();
  });

  function getSourceCount(callback) {
    record.sourceCount('test', function(err, count) {
      if (err) {
        callback(err);
      } else {
        fileCount = count;
        fileDone = true;
        checkDone();
      }
    });
  }

  getSourceCount(function(err) {
    checkDone();
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


