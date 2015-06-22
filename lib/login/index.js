var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//-- OAuth2 support
var oauth2 = require('../oauth2');
var BearerStrategy = require('passport-http-bearer').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var debug = require('debug')('login');
// OAuth2 support --//
var passportLocalMongoose = require('passport-local-mongoose');
var record = require('blue-button-record');

var mongo_url = process.env.MONGO_URL || 'localhost';
var mongo_port = process.env.MONGO_PORT || 27017;
var mongo_name = process.env.MONGO_NAME || 'dre';
var connection = mongoose.createConnection('mongodb://'+mongo_url+':'+mongo_port+'/'+mongo_name);
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    middleName: String,
    lastName: String,
    dob: String,
    gender: String,
});
userSchema.plugin(passportLocalMongoose);
var User = connection.model('User', userSchema);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// OAuth2 support

passport.use('clientBasic', new BasicStrategy(
    function (clientId, clientSecret, done) {
        debug('Client basic auth: ', clientId);
        oauth2.clients.findByClientId(clientId, function (err, client) {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            //Public clients doesn't need a secret
            if (client.tokenEndpointAuthMethod !== 'none' && client.clientSecret !== clientSecret) {
                return done(null, false);
            }
            return done(null, client);
        });
    }
));

passport.use('clientPassword', new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        debug('Client password auth: ', clientId);
        oauth2.clients.findByClientId(clientId, function (err, client) {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            //Public clients doesn't need a secret
            if (client.tokenEndpointAuthMethod !== 'none' && client.clientSecret !== clientSecret) {
                return done(null, false);
            }
            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function (accessToken, done) {
        oauth2.accessTokens.find(accessToken, function (err, token) {
            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }

            User.findOne({
                _id: mongoose.Types.ObjectId(token.userId)
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                // to keep this example simple, restricted scopes are not implemented,
                // and this is just for illustrative purposes
                var info = {
                    scope: '*'
                };
                done(null, user, info);
            });
        });
    }
));

//passport.use(new AnonymousStrategy ());

// register new users
function newAccount(inputBody, done) {
    var inputUsername = inputBody.username;
    var inputPassword = inputBody.password;
    var account = new User({
        username: inputUsername
    });
    User.register(account, inputPassword, function (err, user) {
        if (err) {
            done(err);
        } else {
            done(null, user);
        }
    });
}

module.exports.newAccount = newAccount;

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //console.log("no auth");
    res.status(401).end();
}

module.exports.checkAuth = checkAuth;
module.exports.passport = passport;

function saveRegProfile(inputInfo) {
    // var inputDOB = moment(inputInfo.dob).format();
    var inputFormat = {
        "name": {
            "last": inputInfo.lastName,
            "first": inputInfo.firstName
        },
        "dob": {
            "point": {
                "date": inputInfo.dob,
                "precision": "day"
            }
        },
        "gender": inputInfo.gender,
        "email": [{
            "email": inputInfo.email,
            "type": "primary"
        }]
    };

    if (inputInfo.middleName) {
        inputFormat.name.middle = [];
        inputFormat.name.middle[0] = inputInfo.middleName;
    }

    record.saveSection('demographics', inputInfo.username, inputFormat, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(inputFormat);
            // console.log('registration info saved to profile', inputFormat);
        }
    });
}

app.post('/api/v1/register', function (req, res) {
    //console.log("register API:", req.body);
    newAccount(req.body, function (err, account) {
        if (err) {
            res.status(400).send(err);
        } else {
            //console.log(account);
            record.saveEvent('initAccount', req.body.username, "User created account '" + req.body.username + "'", null, function (err) {
                if (err) {
                    res.status(400).send('Event error ' + err);
                } else {
                    // save registration info to profile/demographics section
                    saveRegProfile(req.body);
                    res.status(200).end();

                }
            });

        }
    });
});

app.post('/api/v1/changepassword', function (req, res) {
    console.log("changepassword API:", req.body);

    var username = req.user.username;
    var old_password = req.body.old;
    var new_password = req.body.new;

    User.find({
        username: username
    }, function (error, users) {
        if (users) {
            console.log(users);

            var current_user;

            if (users.length === 1) {
                current_user = users[0];
                console.log("user found");
            } else {
                console.log("user not found");
                res.status(400).send('Password change error ' + error);
            }

            current_user.authenticate(old_password, function (blah, err, message) {
                console.log(">>>>", blah, err, message);
                if (err === false) {
                    console.log("auth err", err, message);
                    res.status(400).send('Old Password doesn\'t match' + err);
                } else {
                    console.log("old password match");
                    current_user.setPassword(new_password, function (err, data) {
                        if (err) {
                            console.log("set password fail", err);
                        }

                        current_user.save(function (err, data) {
                            console.log("saving user");
                            record.saveEvent('passwordChange', req.user.username, "User changed password", null, function (err) {
                                if (err) {
                                    console.log("change err", err);
                                    res.status(400).send('Password change error ' + err);
                                } else {
                                    console.log("password change success, user:", req.user.username);
                                    res.status(200).end();
                                }
                            });

                        });

                    });
                }

            });

        } else {
            console.log("errr in passwd change api");
            res.status(400).send('Password change error ' + error);
        }
    });

});

// check if username already exists
app.post('/api/v1/users', function (req, res) {
    User.find({
        username: req.body.username
    }, function (error, user) {
        if (error) {
            res.status(400).send(error);
        } else if (!user[0]) {
            res.status(200).send(false);
        } else {
            res.status(200).send(true);
        }
    });
});

app.post('/api/v1/login',
    passport.authenticate('local'),
    function (req, res) {
        record.saveEvent('loggedIn', req.user.username, "User logged in from IP address '" + req.ip + "'", null, function (err) {
            if (err) {
                res.status(400).send('Event error ' + err);
            } else {
                res.status(200).end();
            }
        });
    });

//logout
app.post('/api/v1/logout', checkAuth, function (req, res) {
    record.saveEvent('loggedOut', req.user.username, '', null, function (err) {
        if (err) {
            req.logout();
            res.status(400).send('Event error ' + err);
        } else {
            req.logout();
            res.status(200).end();

        }
    });
});

/**
 * Display authorization page.
 */
app.get('/oauth2/authorize', oauth2.authorization);

/**
 * Process authorization decision.
 */
app.post('/oauth2/decision', oauth2.decision);

/**
 * Exchange for access token.
 */
app.post('/oauth2/token', oauth2.token);

/**
 * Display simplified login page.
 */
app.get('/oauth2/login', oauth2.displaylogin);

/**
 * Process login.
 */
app.post('/oauth2/login', oauth2.login);

/**
 * Dynamically register client
 */
app.post('/oauth2/register', oauth2.register);

/**
 * Refresh access token
 */
app.post('/oauth2/refresh', oauth2.refresh);

/**
 * Remove test client
 */
app.get('/oauth2/cleantest', oauth2.cleantest);

// {
//             "point": {
//                 "date": inputDOB,
//                 "precision": "day"
//             }
// }
