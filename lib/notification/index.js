var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var login = require('../login');
var _ = require('underscore');

var bbm = require('blue-button-meta');

function getNotifications(username, callback) {

    var newCount = 0;
    var newDone = false;
    var dupeCount = 0;
    var dupeDone = false;
    var fileCount = 0;
    var fileDone = false;
    var partialCount = 0;
    var partialDone = false;

    //console.log(bbm);

    var supported_sections = _.filter(bbm.supported_sections, function (item) {
        //console.log(item);
        if (item === 'plan_of_care' || item === 'providers' || item === 'organizations') {
            return false;
        } else {
            return true;
        }
    });

    //console.log(supported_sections);

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

    function getPartialCount(username, callback) {
        var secIteration = 0;
        var secTotal = supported_sections.length;

        function checkCountComplete() {
            secIteration++;
            if (secIteration === secTotal) {
                partialDone = true;
                callback();
            }
        }

        supported_sections.forEach(function (component) {
            record.matchCount(component, username, {}, function (err, count) {
                if (err) {
                    callback(err);
                } else {
                    partialCount = partialCount + count;
                    checkCountComplete();
                }
            });
        });
    }

    getPartialCount(username, function (err) {
        checkDone();
    });

    function getNewMergeCount(username, callback) {
        var secIteration = 0;
        var secTotal = supported_sections.length;

        function checkCountComplete() {
            secIteration++;
            if (secIteration === secTotal) {
                newDone = true;
                callback();
            }
        }

        supported_sections.forEach(function (component) {
            record.mergeCount(component, username, {
                merge_reason: "new"
            }, function (err, count) {
                if (err) {
                    callback(err);
                } else {
                    newCount = newCount + count;
                    checkCountComplete();
                }
            });
        });
    }

    getNewMergeCount(username, function (err) {
        checkDone();
    });

    function getDupeMergeCount(username, callback) {
        var secIteration = 0;
        var secTotal = supported_sections.length;

        function checkCountComplete() {
            secIteration++;
            if (secIteration === secTotal) {
                //console.log(dupeCount);
                dupeDone = true;
                callback();
            }
        }

        supported_sections.forEach(function (component) {
            record.mergeCount(component, username, {
                merge_reason: "duplicate"
            }, function (err, count) {
                if (err) {
                    callback(err);
                } else {
                    //console.log(count);
                    dupeCount = dupeCount + count;
                    checkCountComplete();
                }
            });
        });
    }

    getDupeMergeCount(username, function (err) {
        checkDone();
    });

    function getSourceCount(username, callback) {
        record.sourceCount(username, function (err, count) {
            if (err) {
                callback(err);
            } else {
                fileCount = count;
                fileDone = true;
                checkDone();
            }
        });
    }

    getSourceCount(username, function (err) {
        checkDone();
    });

}

app.get('/api/v1/notification', login.checkAuth, function (req, res) {

    getNotifications(req.user.username, function (err, notificationList) {
        if (err) {
            res.status(400).send(err);
        } else {
            var notificationJSON = {};
            notificationJSON.notifications = notificationList;
            res.send(notificationJSON);
        }

    });

});
