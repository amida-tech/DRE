var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var _ = require('underscore');
var login = require('../login');

var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems'];

//Get all merges API.
app.get('/api/v1/merges/:component', login.checkAuth, function(req, res) {

    if (_.contains(supportedComponents, req.params.component) === false) {
        res.send(404);
    } else {
        record.getMerges(req.params.component, 'test', 'name severity', 'filename uploadDate', function(err, mergeList) {
            if (err) {
                res.send(400, err);
            } else {
                var mergeJSON = {};
                mergeJSON.merges = mergeList;
                res.send(mergeJSON);
            }
        });
    }
});

app.get('/api/v1/merges', login.checkAuth, function(req, res) {

    var mergeJSON = {};
    mergeJSON.merges = [];
    mergeCount = 0;

    function checkComplete () {
        if(mergeCount === supportedComponents.length) {
            res.send(mergeJSON);
        }

    }


    for (var iMerge in supportedComponents) {
        record.getMerges(supportedComponents[iMerge], 'test', 'procedure problem product allergen vital name smoking_statuses encounter result_set results', 'filename uploadDate', function(err, mergeList) {
            if (err) {
                res.send(400, err);
            } else {
                mergeCount++;
                mergeJSON.merges = mergeJSON.merges.concat(mergeList);
                checkComplete();
            }
        });

    }
});
