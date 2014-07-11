var express = require('express');
var app = module.exports = express();
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


var aggregatedResponse = {};

function getSection(componentName) {
    var deferred = $q.defer();
    record.getSection(componentName, 'test', function(err, componentList) {
        if (err) {
            deferred.reject(err);
        } else {
            componentList = record.cleanSection(componentList);
            deferred.resolve(formatResponse(componentName, componentList));
        }
    });
    return deferred.promise;
}

function aggregateEachSection() {
    var components = ['demographics', 'allergies', 'encounters', 'immunizations', 'medications', 'problems', 'procedures', 'results', 'social_history', 'vitals'];
    var deferred = $q.defer();

    for (var i = 0; i < components.length; i++) {
        var promise = getSection(components[i]);
        promise.then(function(result) {
            _.extend(aggregatedResponse, result);
        }, function(reason) {
          deferred.reject(reason);
        });
    }
    if (Object.size(aggregatedResponse) == 10) {
        deferred.resolve(aggregatedResponse);
    }
    return deferred.promise;
}

app.get('/api/v1/ccda', function(req, res) {
    var deferred = $q.defer();

    var promise = aggregateEachSection();
    promise.then(function(result) {
        deferred.resolve(aggregatedResponse);
        res.send(bb.generateCCDA(aggregatedResponse).toString());
    }, function(reason) {
        deferred.reject(reason);
        console.log("Error: " + reason);
    });
    return deferred.promise;
});

