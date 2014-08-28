var express = require('express');
var app = module.exports = express();
var Promise = require("bluebird");
var record = require('blue-button-record');
var bb = require('blue-button');
var _ = require('underscore');
var bbm = require('blue-button-meta');
var fs = require('fs');
var path = require('path');
var login = require('../login');

// blue bird to promisify record API
Promise.promisifyAll(require("blue-button-record"));


var supportedComponents = bbm.supported_sections.reduce(function(r, c) {
    r[c] = true;
    return r;
}, {});

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

app.get('/api/v1/record/:component', login.checkAuth, function(req, res) {

    if (!supportedComponents[req.params.component]) {
        res.send(404);
    } else {

        function sendResponse(componentName) {
            record.getSection(componentName, req.user.username, function(err, componentList) {
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

function getMHR(username, callback) {
    var aggregatedResponse = {},
        count = 0,
        components = Object.keys(supportedComponents);

    bbm.supported_sections.forEach(function(secName) {
        record.getSectionAsync(secName, username).then(function(sec) {
            if (sec.length !== 0) {
                _.extend(aggregatedResponse, formatResponse(secName, prep(sec, secName)));
            }
            if (++count === components.length)
                callback(null, aggregatedResponse);
        }).catch(function(e) {
            callback("Error");
        });
    });
}

app.get('/api/v1/master_health_record/:format?', login.checkAuth, function(req, res) {
    var format = "xml";
    if (req.params.format && req.params.format === "json") {
        format = "json";
    }

    getMHR(req.user.username, function(err, result) {
        //console.log(result);

        if (err) {
            res.send(500);
        } else {
            res.setHeader('Content-disposition', 'attachment; filename=' + 'ccda_record.' + format);

            if (format === "json") {
                //return BB JSON
                res.send(JSON.stringify(result, null, 4)); 
            } else {
                //return CCDA
                res.send(bb.generateCCDA(result).toString());
            }
        }
    });
});
