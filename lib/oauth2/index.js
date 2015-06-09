/**
 * OAuth 2 support.
 * Most of code is from example app at https://github.com/jaredhanson/oauth2orize/tree/master/examples/express2
 */

var fs = require('fs');
var path = require('path');
var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var mongoose = require('mongoose');
var login = require('connect-ensure-login');
var _ = require('lodash');

var databaseServer = process.env.DB || 'localhost:27017';
console.log("oauth2.js DB: ", 'mongodb://' + databaseServer + '/dre');

//var connection = mongoose.connect('mongodb://'+app.get("db_url")+'/'+app.get("db_name"));
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/dre');

var Schema = mongoose.Schema;

var AuthorizationCode = new Schema({
    code: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    redirectUri: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    scope: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String
    },
    /* NOT REQURED for OAuth2 but somewhat useful for SMART on FIRE apps */
    launchUri: {
        type: String
    },
    redirectUri: {
        type: String
    },
    logoUri: {
        type: String
    },
    ownerEmail: {
        type: String
    },
    tokenEndpointAuthMethod: {
        type: String
    },
    grantTypes: {
        type: String
    },
    scope: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// AccessToken
var AccessToken = new Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    expirationDate: {
        type: String
    },
    scope: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// RefreshToken
var RefreshToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var AccessTokenModel = connection.model('AccessToken', AccessToken);
var AuthorizationCodeModel = connection.model('AuthorizationCode', AuthorizationCode);
var ClientModel = connection.model('Client', Client);
var RefreshTokenModel = connection.model('RefreshToken', RefreshToken);

var refreshTokens = (function () {
    return {
        find: function (token, done) {
            RefreshTokenModel.where({
                token: token
            }).findOne(function (err, code) {
                if (err) {
                    return done(err);
                }
                if (code) {
                    return done(null, code);
                }
                done(null, null);
            });
        },

        save: function (token, clientId, userId, scope, done) {
            var db = new RefreshTokenModel({
                token: token,
                clientId: clientId,
                userId: userId,
                scope: scope
            });
            db.save(done);
        },

        delete: function (token, done) {
            RefreshTokenModel.where({
                token: token
            }).findOneAndRemove(done);
        }
    };
})();

var authorizationCodes = (function () {
    /*//In-memory clients for testing
       var codes = {};
       
       return  {
           codes : codes,

           find : function(key, done) {
              var code = codes[key];
              return done(null, code);
            },
            
            save : function(code, clientId, redirectUri, userId, done) {
              codes[code] = { clientId: clientId, redirectUri: redirectUri, userId: userId };
              return done(null);
            },
            
            delete : function(key, done) {
                delete codes[key];
                return done(null);
            } 
       };*/
    return {
        find: function (key, done) {
            AuthorizationCodeModel.where({
                code: key
            }).findOne(function (err, code) {
                if (err) {
                    return done(err);
                }
                if (code) {
                    return done(null, code);
                }
                done(null, null);
            });
        },

        save: function (code, clientId, redirectUri, userId, scope, done) {
            var dbcode = new AuthorizationCodeModel({
                code: code,
                clientId: clientId,
                redirectUri: redirectUri,
                userId: userId,
                scope: scope
            });
            dbcode.save(done);
        },

        delete: function (key, done) {
            AuthorizationCodeModel.where({
                code: key
            }).findOneAndRemove(done);
        }
    };
})();

var clients = module.exports.clients = (function () {
    // Test client, data taken from https://gallery.smarthealthit.org
    var testClients = [{
        name: 'Cardiac Risk',
        clientId: 'cardiac_risk',
        clientSecret: '',
        launchUri: 'https://fhir.smarthealthit.org/apps/cardiac-risk/launch.html',
        redirectUri: 'https://fhir.smarthealthit.org',
        logoUri: 'https://gallery.smarthealthit.org/img/apps/1.png?v=0.1.9',
        tokenEndpointAuthMethod: 'none'
    }, {
        name: 'Argonaut Demo Client (localhost)',
        clientId: 'argonaut_demo_client_local',
        clientSecret: 'have no secrets!',
        launchUri: '',
        redirectUri: '',
        logoUri: '',
        tokenEndpointAuthMethod: 'none'
    }, {
        name: 'Argonaut Demo Client',
        clientId: 'argonaut_demo_client',
        clientSecret: 'have no secrets!',
        launchUri: '',
        redirectUri: '',
        logoUri: '',
        tokenEndpointAuthMethod: 'none'
    }];
    /*//In-memory clients for testing
        return {
        clients : clients,
        
        find : function(id, done) {
          for (var i = 0, len = clients.length; i < len; i++) {
            var client = clients[i];
            if (client.id === id) {
              return done(null, client);
            }
          }
          return done(null, null);
        },
        
        findByclientId : function(clientId, done) {
          for (var i = 0, len = clients.length; i < len; i++) {
            var client = clients[i];
            if (client.clientId === clientId) {
              return done(null, client);
            }
          }
          return done(null, null);
        }    
        };*/

    var logError = function (err) {
        console.log(err);
    };

    var createIfNotExists = function (testClient) {
        return function (err, client) {
            if (err) {
                return logError;
            }
            if (client) {
                return;
            }
            client = new ClientModel(testClient);
            client.save(logError);
        };
    };
    //Check for existence and/or add test client to the database. 
    for (var i = 0; i < testClients.length; i++) {
        ClientModel.where({
            clientId: testClients[i].clientId
        }).findOne(
            createIfNotExists(testClients[i])
        );
    }

    return {
        find: function (id, done) {
            ClientModel.where({
                _id: id
            }).findOne(
                function (err, client) {
                    if (err) {
                        return done(err);
                    }
                    if (client) {
                        return done(null, client);
                    }
                    return done(null, null);
                });
        },
        findByClientId: function (clientId, done) {
            ClientModel.where({
                clientId: clientId
            }).findOne(
                function (err, client) {
                    if (err) {
                        return done(err);
                    }
                    if (client) {
                        return done(null, client);
                    }
                    return done(null, null);
                });
        },
        findByClientName: function (client_name, done) {
            ClientModel.where({
                name: client_name
            }).findOne(
                function (err, client) {
                    if (err) {
                        return done(err);
                    }
                    if (client) {
                        return done(null, client);
                    }
                    return done(null, null);
                });
        },
        save: function (client_name, client_id, client_secret, launch_uri, redirect_uri, logo_uri, owner_email, token_endpoint_auth_method, grant_types, scope, done) {
            var client = new ClientModel({
                name: client_name,
                clientId: client_id,
                clientSecret: client_secret,
                launchUri: launch_uri,
                redirectUri: redirect_uri,
                logoUri: logo_uri,
                ownerEmail: owner_email,
                tokenEndpointAuthMethod: token_endpoint_auth_method,
                grantTypes: grant_types,
                scope: scope
            });
            client.save(done);
        },
        deleteByName: function (client_name, done) {
            ClientModel.where({
                name: client_name
            }).findOneAndRemove(done);
        }
    };
})();

var accessTokens = module.exports.accessTokens = (function () {
    //In-memory tokens for testing    
    /*    var tokens = {};
        return {
            tokens : tokens,
            
            find : function(key, done) {
              var token = tokens[key];
              return done(null, token);
            },
            
            save : function(token, userId, clientId, done) {
              tokens[token] = { userId: userId, clientId: clientId };
              return done(null);
            }
        };
    */
    return {
        find: function (key, done) {
            AccessTokenModel.where({
                token: key
            }).findOne(
                function (err, token) {
                    if (err) {
                        return done(err);
                    }
                    if (token) {
                        return done(null, token);
                    }
                    return done(null, null);
                });
        },

        save: function (token, expirationDate, userId, clientId, scope, done) {
            token = new AccessTokenModel({
                token: token,
                expirationDate: expirationDate,
                userId: userId,
                clientId: clientId,
                scope: scope

            });
            token.save(done);
        },

        update: function (token, expirationDate, userId, done) {
            AccessTokenModel.update({
                userId: userId
            }, {
                $set: {
                    token: token,
                    expirationDate: expirationDate
                }
            }, done);
        }
    };
})();

// create OAuth 2.0 server
var server = module.exports.oauth2server = oauth2orize.createServer();

server.serializeClient(function (client, done) {
    return done(null, client.id);
});

server.deserializeClient(function (id, done) {
    clients.find(id, function (err, client) {
        if (err) {
            return done(err);
        }
        return done(null, client);
    });
});

server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
    var code = crypto.randomBytes(16).toString('hex');

    authorizationCodes.save(code, client.id, redirectUri, user.id, ares.scope, function (err) {
        if (err) {
            return done(err);
        }
        return done(null, code);
    });
}));

/**
 * See https://rwlive.wordpress.com/2014/06/11/oauth2-implicit-flow-using-oauth2orize-express-4-and-mongojs/
 */
server.grant(oauth2orize.grant.token(function (client, user, ares, done) {
    var token = crypto.randomBytes(256);
    var tokenHash = crypto.createHash('sha1').update(token).digest('hex');
    var expirationDate = new Date(new Date().getTime() + (3600 * 1000));

    accessTokens.save(tokenHash, expirationDate, user.userId, client.clientId, function (err) {
        if (err) {
            return done(err);
        }
    });
}));

server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, done) {
    authorizationCodes.find(code, function (err, authCode) {
        if (err) {
            return done(err);
        }
        if (!authCode) {
            return done(null, false);
        }
        if (client.id !== authCode.clientId) {
            return done(null, false);
        }
        //TODO - return this check for a prod setup
        if (redirectUri !== authCode.redirectUri) {
            //return done(null, false);
        }

        authorizationCodes.delete(code, function (err) {
            if (err) {
                return done(err);
            }
            var token = crypto.randomBytes(256);
            var refreshToken = crypto.randomBytes(256);
            var tokenHash = crypto.createHash('sha1').update(token).digest('hex');
            var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');

            var expiration_in = (3600 * 1000); // to seconds
            var expiration_date = (new Date());
            expiration_date.setDate(expiration_date.getSeconds() + expiration_in);

            accessTokens.save(tokenHash, expiration_date, authCode.userId, authCode.clientId, authCode.scope, function (err) {
                if (err) {
                    return done(err);
                }

                refreshTokens.save(refreshTokenHash, authCode.clientId, authCode.userId, authCode.scope,
                    function (err) {
                        if (err) {
                            return done(err);
                        }
                        var para = {
                            expires_in: expiration_in,
                            scope: authCode.scope, //TODO Provide a better mechanism to deal with SMART on FHIR permissions
                            intent: authCode.clientId,
                            patient: authCode.userId,
                            encounter: "456" //TODO Required for SMART on FHIR have to be inferred from request         
                        };
                        done(null, tokenHash, refreshTokenHash, para);
                    });
            });
        });
    });
}));

// Exchange refreshToken for an access token.
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
    console.log('in refresh token');
    refreshTokens.find(refreshToken, function (err, token) {
        if (err) {
            return done(err);
        }
        if (!token) {
            return done(null, false);
        }

        if (client.id !== token.clientId) {
            return done(null, false);
        }

        var newAccessToken = crypto.randomBytes(256);
        var accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex');

        var expiration_in = (3600 * 1000); // to seconds
        var expirationDate = new Date(new Date().getTime() + expiration_in);

        accessTokens.update(token.userId, expirationDate, token.userId, function (err) {
            if (err) {
                return done(err);
            }
            done(null, accessTokenHash, refreshToken, {
                expires_in: expiration_in
            });
        });
    });
}));

module.exports.getClient = function (clientId, callback) {
    clients.findByClientId(clientId, function (err, client) {
        if (err) {
            callback(err);
        }
        //TODO
        // WARNING: For security purposes, it is highly advisable to check that
        //          redirectUri provided by the client matches one registered with
        //          the server.  For simplicity, this example does not.  You have
        //          been warned.
        callback(null, client);
    });
};

/**
 * Authorize client if possible.
 */
module.exports.authorization = [
    // Has to be authenticated
    function (req, res, next) {
        if (req.user) {
            return next();
        } else {
            res.redirect('/oauth2/login?redirectUri=' + encodeURIComponent(req.url) + "&clientId=" + encodeURIComponent(req.query.client_id) + "&responseType=" + encodeURIComponent(req.query.response_type));
        }
    },
    server.authorization(function (clientId, redirectUri, done) {
        console.log("Trying to authorize client: " + clientId + " " + redirectUri);
        clients.findByClientId(clientId, function (err, client) {
            if (err) {
                return done(err);
            }
            //TODO
            // WARNING: For security purposes, it is highly advisable to check that
            //          redirectUri provided by the client matches one registered with
            //          the server.  For simplicity, this example does not.  You have
            //          been warned.
            return done(null, client, redirectUri);
        });
    }),
    //Quick and dirty solution for decision form
    function (req, res) {
        /*
        var html = '<DOCTYPE html><html><head><head><body></body>' +
            '<p>Hi <%= user.name %>!</p>' +
            '<p><b><%= client.name %></b> is requesting access to your account.</p>' +
            '<p>Do you approve?</p>' +
            '<form action="/oauth2/decision" method="post">' +
            '  <input name="transaction_id" type="hidden" value="<%= transactionID %>">' +
            '  <div>' +
            '  <input type="submit" value="Allow" id="allow">' +
            '  <input type="submit" value="Deny" name="cancel" id="deny">' +
            '  </div>' +
            '</form></html>';
        html = html.replace('<%= user.name %>', req.user.username)
            .replace('<%= client.name %>', req.oauth2.client.name)
            .replace('<%= transactionID %>', req.oauth2.transactionID);
        res.send(html);
        */
        var html = "";
        var loginPage = path.join(__dirname, '../../client/oauth-authorize.html');
        fs.readFile(loginPage, {
            encoding: "utf8"
        }, function (err, data) {
            if (err) {
                console.log("err: ", err);
                res.status(400).end();
            } else {
                html = data;
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                html = html.replace('<%= user.name %>', req.user.username)
                    .replace('<%= client.name %>', req.oauth2.client.name)
                    .replace('<%= transactionID %>', req.oauth2.transactionID);
                res.write(html);
                res.end();
            }
        });
    }
];

/**
 * Process user's authorization decision. See module.exports.authorization above.
 */
module.exports.decision = [
    login.ensureLoggedIn('/oauth2/login'),
    server.decision()
];

/**
 * Render simple login form.
 */
module.exports.displaylogin = function (req, res) {
    var html = "";
    var loginPage = path.join(__dirname, '../../client/oauth-login.html');
    fs.readFile(loginPage, {
        encoding: "utf8"
    }, function (err, data) {
        if (err) {
            console.log("err: ", err);
            res.status(400).end();
        } else {
            html = data;
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            html = html.replace('<%= clientId %>', req.query.clientId)
                .replace('<%= redirectUri %>', req.query.redirectUri)
                .replace('<%= responseType %>', req.query.responseType);
            res.write(html);
            res.end();
        }
    });
    /*
    var html = '<DOCTYPE html><html><head><head><body></body>' +
        '<form method="post" action="/oauth2/login">' +

        '<div id="username">' +
        '<label>Username:</label>' +
        '<input type="text" name="username">' +
        '</div>' +

        '<div id="password">' +
        '<label>Password:</label>' +
        '<input type="password" name="password">' +
        '</div>' +

        '<div id="info"></div>' +
        '<input type="hidden" value="<%= clientId %>" name="clientId">' +
        '<input type="hidden" value="<%= redirectUri %>" name="redirectUri">' +
        '<input type="hidden" value="<%= responseType %>" name="responseType">' +
        '<div id="submit">' +
        '<input type="submit" value="submit">' +
        '</div>' +

        '</form>' +
        '</form></html>';
        */
    /*
    html = html.replace('<%= clientId %>', req.query.clientId)
        .replace('<%= redirectUri %>', req.query.redirectUri)
        .replace('<%= responseType %>', req.query.responseType);
    res.send(html);
    */
};

/**
 * Process login
 */
module.exports.login = [
    passport.authenticate('local', {
        failureRedirect: '/oauth2/login'
    }),
    function (req, res) {
        if (req.body.redirectUri) {
            res.redirect(req.body.redirectUri);
        } else {
            res.status(200).end();
        }
    }
];

/**
 * Process logout
 */
module.exports.logout = [
    function (req, res) {
        req.logout();
        if (req.body.redirectUri) {
            res.redirect(req.body.redirectUri);
        } else {
            res.status(200).end();
        }
    }
];

/**
 * Exchange access code to an access token.
 */
module.exports.token = [
    //TODO - it may be required to remove 3 rows below to make code compatible with demo SMART on FHIR apps
    //deployed at https://gallery.smarthealthit.org/
    passport.authenticate(['clientBasic', 'clientPassword'], {
        session: false
    }),
    function (req, res, next) {
        server.token()(req, res, next);
    },
    server.errorHandler()
];

/**
 * Refresh an access token.
 */
module.exports.refresh = [
    passport.authenticate(['clientBasic', 'clientPassword'], {
        session: false
    }),
    function (req, res, next) {
        server.token()(req, res, next);
    },
    server.errorHandler()
];

/**
 * Dynamic Client Registration
 * support (http://docs.smarthealthit.org/sandbox/register/, http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17)
 */
module.exports.register = function (req, res, next) {
    clients.findByClientName(req.body.client_name, function (err, client) {
        if (err) {
            return res.status(400).send({
                error: err
            });
        }
        if (client) {
            return res.status(400).send({
                error: client.clientName + ' already registered!'
            });
        }

        function randomValueHex(len) {
            return crypto.randomBytes(Math.ceil(len / 2))
                .toString('hex') // convert to hexadecimal format
                .slice(0, len); // return required number of characters
        }

        var token_endpoint_auth_method = req.body.token_endpoint_auth_method;

        var client_id = randomValueHex(32);
        var client_secret;
        if (token_endpoint_auth_method !== 'none') { // none means 'public client', so no secret
            client_secret = randomValueHex(32);
        }
        var launch_uri = req.body.launch_uri;
        var redirect_uri = (Array.isArray(req.body.redirect_uris)) ? req.body.redirect_uris.join(' ') : req.body.redirect_uris;
        var logo_uri = req.body.logo_uri;
        var owner_email = req.body.owner_email;
        var scope = req.body.scope;
        var grant_types = (Array.isArray(req.body.grant_types)) ? req.body.grant_types.join(' ') : req.body.grant_types;

        clients.save(req.body.client_name, client_id, client_secret, launch_uri, redirect_uri, logo_uri, owner_email, token_endpoint_auth_method, grant_types, scope,
            function (err, client) {
                if (err) {
                    res.status(400).send({
                        error: err
                    });
                } else {
                    var response = _.clone(req.body);
                    response.client_id = client_id;
                    response.client_secret = client_secret;
                    res.send(response);
                }
            });
    });
};

module.exports.cleantest = function (req, res, next) {
    clients.deleteByName('Cool SMART App', function (err, client) {
        res.status(200).end();
    });
};
