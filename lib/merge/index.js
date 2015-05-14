var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var _ = require('lodash');
var bbm = require('blue-button-meta');
var login = require('../login');

//Get all merges API.
app.get('/api/v1/merges/:component', login.checkAuth, function (req, res) {

    if (_.contains(bbm.supported_sections, req.params.component) === false) {
        res.status(404).end();
    } else {
        record.getMerges(req.params.component, req.user.username, 'name severity', 'filename uploadDate', function (err, mergeList) {
            if (err) {
                res.status(400).send(err);
            } else {
                var mergeJSON = {};
                mergeJSON.merges = mergeList;
                res.send(mergeJSON);
            }
        });
    }
});

app.get('/api/v1/merges', login.checkAuth, function (req, res) {

    var mergeJSON = {};
    mergeJSON.merges = [];
    mergeCount = 0;

    var supported_sections = _.difference(bbm.supported_sections, ["plan_of_care", "providers", "organizations"]);

    function checkComplete() {
        if (mergeCount === supported_sections.length) {
            res.send(mergeJSON);
        }

    }
    
    function mergeCallback(err, mergeList) {
        if (err) {
            res.status(400).send(err);
        } else {
            mergeCount++;
            mergeJSON.merges = mergeJSON.merges.concat(mergeList);
            checkComplete();
        }
    }

    for (var iMerge in supported_sections) {
        record.getMerges(supported_sections[iMerge], req.user.username, 'procedure problem payer_name plan_name payer number product observation code value allergen vital name smoking_statuses encounter result_set results', 'filename uploadDate', mergeCallback);
    }
});
