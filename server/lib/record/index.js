var express = require('express');
var app = module.exports = express();
var Promise = require("bluebird");
var record = require('blue-button-record');
var bb = require('../../../../blue-button');
var _ = require('underscore');
var $q = require("q");

var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 
'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems'];

// blue bird to promisify record API
Promise.promisifyAll(require("blue-button-record"));

function formatResponse(srcComponent, srcResponse) {
    var srcReturn = {};
    //Clean __v tag.
    for (var ir in srcResponse) {
        if (srcResponse[ir].__v >= 0) {
            delete srcResponse[ir].__v;
        }
    }
    srcReturn[srcComponent] = srcResponse;
    return srcReturn;
}

app.get('/api/v1/record/:component', function(req, res) {

    if (_.contains(supportedComponents, req.params.component) === false) {
        res.send(404);
    } else {

        function sendResponse(componentName) {
            record.getSection(req.params.component, 'test', function(err, componentList) {
                if (err) {
                    res.send(500);
                } else {
                    var apiResponse = formatResponse(componentName, componentList);
                    res.send(apiResponse);
                }
            });
        }

        sendResponse(req.params.component);
    }
});

app.get('/api/v1/record/partial/:component', function(req, res) {

    if (_.contains(supportedComponents, req.params.component) === false) {
        res.send(404);
    } else {

        function sendResponse(componentName) {
            record.getPartialSection(req.params.component, 'test', function(err, componentList) {
                if (err) {
                    res.send(500);
                } else {
                    //console.log(componentList);
                    var apiResponse = formatResponse(componentName, componentList);
                    res.send(apiResponse);
                }
            });
        }
        sendResponse(req.params.component);
    }
});

// ccda generation

function getCCDA(callback) {
    var aggregatedResponse = {};
    var count = 0;

    supportedComponents.forEach(function(secName) {
        record.getSectionAsync(secName, 'test').then(function(sec) {
            _.extend(aggregatedResponse, formatResponse(secName, sec));
            count++;
            if (count == 10)
                callback(null, aggregatedResponse);
        }).catch(function(e) {
            callback("Error");
        });
    });
}

app.get('/api/v1/ccda', function(req, res) {
    getCCDA(function(err, result) {
        err ? res.send(500) : res.send(bb.generateCCDA(result).toString());
    });
});

