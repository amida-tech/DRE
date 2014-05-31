var express = require('express');
var app = module.exports = express();
var record = require('../recordjs');
var _ = require('underscore');

var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'socialHistory', 'demographics', 'problems'];

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
            record["get" + record.capitalize(req.params.component)]('test', function(err, componentList) {
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
            record["getPartial" + record.capitalize(req.params.component)]('test', function(err, componentList) {
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


