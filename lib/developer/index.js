var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ConnectRoles = require('connect-roles');

//-- OAuth2 support
var oauth2 = require('../oauth2');
var BearerStrategy = require('passport-http-bearer').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var debug = require('debug')('login');
// OAuth2 support --//
var passportLocalMongoose = require('passport-local-mongoose');
var databaseServer = process.env.DB || 'localhost:27017';
var databaseName = process.env.DBname || 'dre';
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/' + databaseName);
var Schema = mongoose.Schema;
var devSchema = new Schema({
    username: String,
    password: String,
    role: String
});
devSchema.plugin(passportLocalMongoose);
var User = connection.model('User', devSchema);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// roles support

var roles = new ConnectRoles();

app.use(roles.middleware());

//admin users can access all pages
roles.use(function (req) {
    if (req.user.role === 'admin') {
        return true;
    }
});

//developers can access developer section
roles.use('access developer page', function (req) {
    if (req.user.role === 'dev') {
        return true;
    }
});

// user roles
app.get('/api/v1/admin', checkAuth, roles.can('access admin page'), function (req, res) {
    // console.log(res);
    // console.log(req.user.role);
    res.sendStatus(true);
});
app.get('/api/v1/developer/', checkAuth, roles.can('access developer page'), function (req, res) {
    // console.log(res);
    // console.log(req.user.role);
    res.sendStatus(true);
});

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
        username: inputUsername,
        role: 'dev'
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

app.post('/api/v1/developer/register', function (req, res) {
    //console.log("register API:", req.body);
    newAccount(req.body, function (err, account) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).end();
        }
    });
});

// check if username already exists
app.post('/api/v1/developer/users', function (req, res) {
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

app.post('/api/v1/developer/login', passport.authenticate('local'), function (req, res) {
    res.status(200).end();
});

//logout
app.post('/api/v1/developer/logout', checkAuth, function (req, res) {
    req.logout();
    res.status(200).end();
});

// authentication
app.get('/api/v1/developer/account', function (req, res) {
    res.status(200).send({
        "authenticated": req.isAuthenticated()
    });
});

// get all clients
app.get('/api/v1/developer/clients', checkAuth, roles.can('access developer page'), function (req, res) {
    oauth2.clients.findByOwnerEmail(req.user.username, function (err, clients) {
        res.status(200).send(clients);
    });
});

// register a new client
app.post('/api/v1/developer/clients/add', checkAuth, roles.can('access developer page'), oauth2.register);

// delete a client
app.post('/api/v1/developer/clients/delete', checkAuth, roles.can('access developer page'), function (req, res) {
    oauth2.clients.deleteByName(req.body.name, function (err, client) {
        res.status(200).end();
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
