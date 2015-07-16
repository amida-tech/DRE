/*jshint -W079 */
var express = require('express');
var app = module.exports = express();
var Withings = require('withings-lib');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var json2csv = require('json2csv');

// OAuth flow
app.get('/api/v1/oauth/withings', function (req, res) {
    // Create an API client and start authentication via OAuth
    var options = {
        consumerKey: app.get('consumer-key'),
        consumerSecret: app.get('consumer-secret'),
        callbackUrl: app.get('callback-url')
    };
    var client = new Withings(options);

    client.getRequestToken(function (err, token, tokenSecret) {
        if (err) {
            // Throw error
            return;
        }

        req.session.oauth = {
            requestToken: token,
            requestTokenSecret: tokenSecret
        };

        res.send(client.authorizeUrl(token, tokenSecret));
    });
});

// On return from the authorization
app.get('/api/v1/oauth/withings/oauth_callback', function (req, res) {
    var verifier = req.query.oauth_verifier;
    var oauthSettings = req.session.oauth;
    var options = {
        consumerKey: app.get('consumer-key'),
        consumerSecret: app.get('consumer-secret'),
        callbackUrl: app.get('callback-url'),
        userID: req.query.userid
    };
    var client = new Withings(options);

    // Request an access token
    client.getAccessToken(oauthSettings.requestToken, oauthSettings.requestTokenSecret, verifier,
        function (err, token, secret) {
            if (err) {
                // Throw error
                return;
            }

            oauthSettings.accessToken = token;
            oauthSettings.accessTokenSecret = secret;
            oauthSettings.id = req.query.userid;

            res.redirect('/');
        }
    );
});

app.get('/api/v1/oauth/withings/weight', function (req, res) {
    var options = {
        consumerKey: app.get('consumer-key'),
        consumerSecret: app.get('consumer-secret'),
        accessToken: req.session.oauth.accessToken,
        accessTokenSecret: req.session.oauth.accessTokenSecret,
        userID: req.session.oauth.id
    };
    var client = new Withings(options);
    var today = moment().format('YYYY-MM-DD');
    var tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');

    client.getWeightMeasures(today, tomorrow, function (err, data) {
        if (err) {
            return res.send(err);
        }
        // convert the JSON to CSV, and save it to the user's files
        var fields = ['date', 'measures.value', 'measures.unit', 'measures.type'];
        var fieldNames = ['Date', 'Value', 'Exponent', 'Type'];
        json2csv({
            data: data,
            fields: fields,
            fieldNames: fieldNames
        }, function (err, csv) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            var name = 'withings_weight_' + moment().format() + '.csv';
            fs.writeFile(name, csv, function (err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                res.send({
                    name: name,
                    data: csv
                });
            });
        });
    });
});
