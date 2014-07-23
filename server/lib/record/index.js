var express = require('express');
var app = module.exports = express();
var Promise = require("bluebird");
var record = require('blue-button-record');
var bb = require('blue-button');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// blue bird to promisify record API
Promise.promisifyAll(require("blue-button-record"));

var supportedComponents = {
    allergies: 'allergies', procedures: 'procedures', immunizations: 'immunizations', medications: 'medications', 
    encounters: 'encounters', vitals: 'vitals', results: 'results', social_history: 'social_history',
    demographics: 'demographics', problems: 'problems' 
} 

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

    if (!supportedComponents[req.params.component]) {
        res.send(404);
    } else {

        function sendResponse(componentName) {
            record.getSection(componentName, 'test', function(err, componentList) {
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

    if (!supportedComponents[req.params.component]) {
        res.send(404);
    } else {

        function sendResponse(componentName) {
            record.getPartialSection(componentName, 'test', function(err, componentList) {
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

// CCDA generation. uses promise-based blue-button-record API 
// (via bluebird module) to combine returned sections, propagating 
// back to caller when done or on error via @callback

function prep(sec, secName) {
    return secName == "demographics" || secName == "social_history" ? sec[0] : sec;
}
   
function getCCDA(callback) {
    var aggregatedResponse = {}, count = 0, components = Object.keys(supportedComponents);

    components.forEach(function(secName) {
        record.getSectionAsync(secName, 'test').then(function(sec) {
            _.extend(aggregatedResponse, formatResponse(secName, prep(sec, secName)));
            if (++count === components.length)
                callback(null, aggregatedResponse);
        }).catch(function(e) {
            callback("Error");
        });
    });
}

app.get('/api/v1/ccda', function(req, res) {
    getCCDA(function(err, result) {
        if (err) {
            res.send(500);
        } else {
            var filePath = __dirname + '/files/master_health_record_ccda.xml';
            fs.writeFileSync(filePath, bb.generateCCDA(result).toString());
            res.download(filePath);
        } 
    });
});

