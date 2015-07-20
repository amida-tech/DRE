/*jshint -W079 */
var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fs = require('fs');
var moment = require('moment');
var _ = require('lodash');

var Withings = require('withings-lib');
var json2csv = require('json2csv');
var record = require('blue-button-record');

var databaseServer = process.env.DB || 'localhost:27017';
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/dre');

var UserSchema = new Schema({
    username: {
        type: String,
        unique: false,
        required: true
    },
    withingsToken: {
        type: Boolean,
        default: false,

    },
    createdAt: {
        type: Date,
        expires: '1.5h',
        default: Date.now
    }
});

UserSchema
    .virtual('user_info')
    .get(function () {
        return {
            '_id': this._id,
            'username': this.username,
            withingsToken: this.withingsToken,
            createdAt: this.createdAt
        };
    });

var WithingsUser = connection.model('WithingsUser', UserSchema);

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

            var user = new WithingsUser({
                username: req.user.username,
                withingsToken: true,
                createdAt: new Date()
            });
            user.save(function (err) {
                console.log('making a user');
                if (err) {
                    console.log(err);
                }
            });

            res.redirect('/');
        }
    );
});

// Check for OAuth Token
app.get('/api/v1/oauth/withings/auth', function (req, res) {
    WithingsUser.findOne({
        username: req.user.username
    }, function (err, user) {
        if (err) {
            res.send(err);
        }
        if (!user) {
            res.send({
                bool: false
            });
        } else {
            res.send({
                bool: true
            });
        }
    });
});

// Measures
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
        // convert the JSON to BB JSON
        var json = {
            "data": {
                "vitals": []
            },
            "meta": {
                "sections": [
                    "vitals"
                ]
            }
        };
        _.forEach(data, function (measure) {
            var vital = {
                "vital": {
                    "name": "Weight",
                    "code": "3141-9",
                    "code_system_name": "LOINC"
                },
                "status": "completed",
                "date_time": {
                    "point": {
                        "date": moment(data.date).toISOString(),
                        "precision": "day"
                    }
                },
                "interpretations": [
                    "Normal"
                ],
                "value": Number((measure.measures[0].value * Math.pow(10, measure.measures[0].unit)).toFixed(2)),
                "unit": "kg"
            };
            json.data.vitals.push(vital);
        });
        // convert the JSON to CSV, and save it to the user's files
        // then send back both formats
        var fields = ['date', 'measures[0].value', 'measures[0].unit', 'measures[0].type'];
        var fieldNames = ['Date', 'Value', 'Exponent', 'Type'];
        json2csv({
            data: data,
            fields: fields,
            fieldNames: fieldNames,
            nested: true
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
                    csv: csv,
                    json: json
                });
            });
        });
    });
});

// Notifications
app.post('/api/v1/oauth/withings/subscribe/weight', function (req, res) {
    var options = {
        consumerKey: app.get('consumer-key'),
        consumerSecret: app.get('consumer-secret'),
        accessToken: req.session.oauth.accessToken,
        accessTokenSecret: req.session.oauth.accessTokenSecret,
        userID: req.session.oauth.id
    };
    var client = new Withings(options);
    client.createNotification('http://devices.amida-demo.com:3000/api/v1/oauth/withings/notification/weight', 'DRE weight', 1, function (err, data) {
        if (err) {
            res.send(err);
        }
        console.log(data);
        res.send(data);
    });
});

app.delete('/api/v1/oauth/withings/subscribe/weight', function (req, res) {
    var options = {
        consumerKey: app.get('consumer-key'),
        consumerSecret: app.get('consumer-secret'),
        accessToken: req.session.oauth.accessToken,
        accessTokenSecret: req.session.oauth.accessTokenSecret,
        userID: req.session.oauth.id
    };
    var client = new Withings(options);
    client.revokeNotification('http://devices.amida-demo.com:3000/api/v1/oauth/withings/notification/weight', 1, function (err, data) {
        if (err) {
            res.send(err);
        }
        res.send(data);
    });
});

// Notifications external endpoint
app.post('/api/v1/oauth/withings/notification/weight', function (req, res) {
    // store the data
    console.log('got a notification');
    res.sendStatus(200);
});

function addWeightData() {

}
