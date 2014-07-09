var express = require('express');
var app = module.exports = express();
var record = require('blue-button-record');
var _ = require('underscore');

var supportedComponents = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems'];

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

// Retrieves master health record for download
app.get('/api/v1/storage', function(req, res) {
    record.getAllSections('test', function(err, allSections) {
        if (err) {
            throw err;
        }
        console.log("activated getAllSections");
        var recordResponse = {};
        recordResponse.storage = allSections;
        res.send(recordResponse);
    });
});


