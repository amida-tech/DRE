var express = require('express');
var app = module.exports = express();
var record = require('../recordjs');

  var supportedComponents = {
    allergies: 'allergy',
    procedures: 'procedure',
    medications: 'medication',
    encounters: 'encounter',
    vitals: 'vital',
    results: 'result',
    socialhistories: 'social',
    immunizations: 'immunization',
    demographics: 'demographic',
    problems: 'problem'
  };

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
    var secTotal = 0;
    for (var iComponent in supportedComponents) {
      secTotal++;
    }

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        partialDone = true;
        callback();
      }
    }

    for (var iSection in supportedComponents) {
      //console.log(supportedComponents[iSection]);
      record.matchCount(supportedComponents[iSection], {}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          partialCount = partialCount + count;
          //console.log(unreviewedCount);
          checkCountComplete();
        }
      });
    }
  }

  getPartialCount(function(err) {
    checkDone();
  });

  function getNewMergeCount(callback) {
    var secIteration = 0;
    var secTotal = 0;
    for (var iComponent in supportedComponents) {
      secTotal++;
    }

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        newDone = true;
        callback();
      }
    }

    for (var iSection in supportedComponents) {


      record.mergeCount(supportedComponents[iSection], {merge_reason: "new"}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          newCount = newCount + count;
          checkCountComplete();
        }
      });

    }
  }

  getNewMergeCount(function(err) {
    checkDone();
  });

  function getDupeMergeCount(callback) {
    var secIteration = 0;
    var secTotal = 0;
    for (var iComponent in supportedComponents) {
      secTotal++;
    }

    function checkCountComplete() {
      secIteration++;
      if (secIteration === secTotal) {
        dupeDone = true;
        callback();
      }
    }

    for (var iSection in supportedComponents) {
      record.mergeCount(supportedComponents[iSection], {merge_reason: "duplicate"}, function(err, count) {
        if (err) {
          callback(err);
        } else {
          dupeCount = dupeCount + count;
          checkCountComplete();
        }
      });
    }
  }

  getDupeMergeCount(function(err) {
    checkDone();
  });

  function getRecordCount(callback) {
    record.recordCount('test', function(err, count) {
      if (err) {
        callback(err);
      } else {
        fileCount = count;
        fileDone = true;
        checkDone();
      }
    });
  }

  getRecordCount(function(err) {
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


