/*jshint -W079 */
var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fs = require('fs');
var moment = require('moment');
var _ = require('lodash');
var request = require('request');

var Withings = require('withings-lib');
var json2csv = require('json2csv');
var record = require('blue-button-record');
var importRecord = require('../../storage').importRecord;

var databaseServer = process.env.DB || 'localhost:27017';
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/dre');

var notificationUrl = process.env.WITHINGS_URL || 'localhost';
var notificationCallback = 'http://' + notificationUrl + ':' + app.get('port');

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    withingsId: {
        type: String,
        unique: true,
        required: true
    },
    withingsToken: {
        type: Boolean,
        default: false,

    },
    token: String,
    secret: String,
});

UserSchema
    .virtual('user_info')
    .get(function () {
        return {
            '_id': this._id,
            'username': this.username,
            'withingsId': this.withingsId,
            withingsToken: this.withingsToken
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

            // Save Withings auth info
            var user = new WithingsUser({
                username: req.user.username,
                withingsId: req.query.userid,
                withingsToken: true,
                token: token,
                secret: secret
            });
            var upsertData = user.toObject();
            WithingsUser.update({
                    username: user.username
                },
                upsertData, {
                    upsert: true
                },
                function (err) {
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
    var query = {};
    if (req.user) {
        query.username = req.user.username;
    } else if (req.query) {
        query.withingsId = req.query.userid;
    } else {
        console.log("No user info available.");
        return res.sendStatus(400);
    }
    WithingsUser.findOne(query, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        if (!user) {
            return res.sendStatus(400);
        }

        var options = {
            consumerKey: app.get('consumer-key'),
            consumerSecret: app.get('consumer-secret'),
            accessToken: user.token,
            accessTokenSecret: user.secret,
            userID: user.withingsId
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
                    return res.send(err);
                }
                var name = 'withings_weight_' + moment().format() + '.csv';
                fs.writeFile(name, csv, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(err);
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
});

// Notifications
app.post('/api/v1/oauth/withings/subscribe/weight', function (req, res) {
    WithingsUser.findOne({
        username: req.user.username
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        var options = {
            consumerKey: app.get('consumer-key'),
            consumerSecret: app.get('consumer-secret'),
            accessToken: user.token,
            accessTokenSecret: user.secret,
            userID: user.withingsId
        };
        var client = new Withings(options);

        client.createNotification(notificationCallback + '/api/v1/oauth/withings/notification/weight', 'DRE weight', 1, function (err, data) {
            if (err) {
                res.send(err);
            }
            console.log(data);
            res.send(data);
        });
    });
});

app.delete('/api/v1/oauth/withings/subscribe/weight', function (req, res) {
    WithingsUser.findOne({
        username: req.user.username
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        var options = {
            consumerKey: app.get('consumer-key'),
            consumerSecret: app.get('consumer-secret'),
            accessToken: user.token,
            accessTokenSecret: user.secret,
            userID: user.withingsId
        };
        var client = new Withings(options);
        client.revokeNotification(notificationCallback + '/api/v1/oauth/withings/notification/weight', 1, function (err, data) {
            if (err) {
                res.send(err);
            }
            res.send(data);
        });
    });
});

// Notifications external endpoint
app.post('/api/v1/oauth/withings/notification/weight', function (req, res) {
    if (!_.has(req.body, 'appli')) {
        return res.sendStatus(200); // Let Withings know the URL is good
    }
    // TODO: use payload from Withings
    request(notificationCallback + '/api/v1/oauth/withings/weight?userid=' + req.body.userid, function (err, response, body) {
        if (err) {
            console.log(err);
            return res.sendStatus(400);
        }
        var meta = {
            type: 'application/json'
        };

        WithingsUser.findOne({
            withingsId: req.body.userid
        }, function (err, user) {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            } else if (!user) {
                res.sendStatus(400);
            } else {
                body = JSON.parse(body);
                importRecord(user.username, meta, JSON.stringify(body.json), function (err, import_results) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(400);
                    }
                    console.log(import_results);
                    res.sendStatus(200);
                });
            }
        });
    });
});

// Notifications endpoint for unsubscribe
app.head('/api/v1/oauth/withings/notification/weight', function (req, res) {
    res.sendStatus(200);
});

function addWeightData() {

}
