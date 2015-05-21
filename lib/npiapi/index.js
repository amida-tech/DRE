var express = require('express');
var app = module.exports = express();
var npi = require('npi-js');

function queryNPI(searchObj, callback) {
    npi.find.getNPI(searchObj, function (err2, results) {
        if (err2) {
            console.log("Error: " + JSON.stringify(err2, null, 4));
            callback(err2);
        } else {
            callback(null, results);
        }
    });
}

app.post('/api/v1/findnpi', function (req, res) {
    var searchTerms = req.body.searchObj;
    queryNPI(searchTerms, function (err, data) {
        if (err) {
            console.log('Error: ' + JSON.stringify(err, null, 4));
            res.status(400).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});
