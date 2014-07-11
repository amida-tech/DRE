var express = require('express');
var app = module.exports = express();
var Promise = require("bluebird");
var record = require('blue-button-record');
var bb = require('../../../../blue-button');
var _ = require('underscore');
var $q = require("q");
var XmlDOM = require('xmldom').DOMParser;
var counter = 0;
var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems'];

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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

var aggregatedResponse = {};

function getSection(componentName) {
    return record.getSectionAsync(componentName, 'test').then(function(section) {
        return _.extend(aggregatedResponse, formatResponse(componentName, section));
    });
}

var aggregateEachSection = function(callback) {
    var components = ['demographics', 'allergies', 'encounters', 'immunizations', 
    'medications', 'problems', 'procedures', 'results', 'social_history', 'vitals'];

    for (var i = 0; i < components.length; i++) {
        getSection(components[i]).catch(function(e) {
            callback("Error");
        });
    }
    callback(null, aggregatedResponse);
}

app.get('/api/v1/ccda', function(req, res) {
    aggregateEachSection(function(err, result) {
        err ? res.send(500) : res.send(bb.generateCCDA(result).toString());
    });
});

