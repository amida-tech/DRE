var express = require('express');
var app = module.exports = express();
var npi = require('npi-js');

function buildPerformerObject(searchTerms, callback) {
    //convert searchTerms to performer-ish object
    var perfObj = searchTerms;
    callback(null, perfObj);
}

function queryNPI(searchTerms, callback) {
    buildPerformerObject(searchTerms, function (err, perfObj) {
        if (err) {
            console.log("Error: " + JSON.stringify(err, null, 4));
            callback(err);
        } else {
            npi.getNPI(perfObj, function (err2, results) {
                if (err2) {
                    console.log("Error: " + JSON.stringify(err2, null, 4));
                    callback(err2);
                } else {
                    callback(null, results);
                }
            })
        }
    });
}

app.get('/api/v1/npiapi', function (req, res) {
    console.log(req.body);
    var searchTerms = req.body;
    queryNPI(inputData, function (err, data) {
        if (err) {
            console.log('Error: ' + JSON.stringify(err, null, 4));
        }
        var npiInfo = data;
        res.send(npiInfo);
    });
});
