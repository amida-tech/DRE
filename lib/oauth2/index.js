/**
 * OAuth 2 support.
 * Most of code is from example app at https://github.com/jaredhanson/oauth2orize/tree/master/examples/express2
 */

var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var mongoose = require('mongoose');
var login = require('connect-ensure-login');

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
    created: {
        type: Date,
        default: Date.now
    }
});

var AuthorizationCodeModel = connection.model('AuthorizationCode', AuthorizationCode);

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
        type: String,
        required: false //Probably should be true!
    },
    /* NOT REQURED for OAuth2 but somewhat useful for SMART on FIRE apps */
    launchUri: {
        type: String,
        required: false
    },
    redirectUri: {
        type: String,
        required: false
    },
    logoUri: {
        type: String,
        required: false
    },
    ownerEmail: {
        type: String,
        required: false
    },
    clientType: {
        type: Boolean, //public (apps that don't use server-side logic) vs confidential
        required: false
    },
    refreshToken: {
        type: Boolean, //NOT Supported right now
        required: false
    },
    scopes: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var ClientModel = connection.model('Client', Client);

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
    created: {
        type: Date,
        default: Date.now
    }
});

var AccessTokenModel = connection.model('AccessToken', AccessToken);

// TODO RefreshToken
/*var RefreshToken = new Schema({
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

var RefreshTokenModel = connection.model('RefreshToken', RefreshToken);*/
//var UserModel = mongoose.model('User');

//Substitutes
var authorizationCodes = (function(){
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
       find : function(key, done) {
         AuthorizationCodeModel.where({code:key}).findOne( function(err, code) {
           if(err) return done(err);
           if(code) return done(null, code);
         done(null, null);
         });
        },
        
        save : function(code, clientId, redirectUri, userId, done) {
          var dbcode = new AuthorizationCodeModel({ code: code, clientId: clientId, redirectUri: redirectUri, userId: userId });
          dbcode.save(done);
        },
        
        delete : function(key, done) {
          AuthorizationCodeModel.where({code:key}).findOneAndRemove(done);
        }      
   };
})();

var clients = module.exports.clients = (function() {
  // Test client, data taken from https://gallery.smarthealthit.org
  var clients =[{ name: 'Cardiac Risk', clientId: 'cardiac_risk', clientSecret: '',
  launchUri : 'https://fhir.smarthealthit.org/apps/cardiac-risk/launch.html',
  redirectUri : 'https://fhir.smarthealthit.org',
  logoUri : 'https://gallery.smarthealthit.org/img/apps/1.png?v=0.1.9',
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
    
    //Check for existence and/or add test client to the database.  
    ClientModel.where( {clientId  : 'cardiac_risk'}).findOne(
            function (err, client) {
            if (err) return function(err) { console.log(err); };
            if (client) return;
            client = new ClientModel( clients[0]);
            client.save(function(err) {if(err) console.log(err);})
        });
        
    return {
      find : function(id, done) {
        ClientModel.where( {_id  : id}).findOne(
            function (err, client) {
            if (err) return done(err);
            if (client) {
              return done(null, client);
            }
            return done(null, null);
        });
      },
      findByClientId : function(clientId, done) {
        ClientModel.where( {clientId  : clientId}).findOne(
            function (err, client) {
            if (err) return done(err);
            if (client) {
              return done(null, client);
            }
            return done(null, null);
        });
      }
    }; 
}) ();

var accessTokens = module.exports.accessTokens = (function() {
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
*/    return {
      find : function(key, done) {
          AccessTokenModel.where( { token: key }).findOne( 
            function (err, token) {
            if (err) return done(err);
            if (token) {
              return done(null, token);
            }
            return done(null, null);
        });},
        
        save : function(token, userId, clientId, done) {
          token = new AccessTokenModel({ token: token, userId: userId, clientId: clientId });
          token.save(done);
        }
    };
}) ();

// create OAuth 2.0 server
var server = module.exports.oauth2server = oauth2orize.createServer();

server.serializeClient(function(client, done) {
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
  clients.find(id, function(err, client) {
    if (err) { return done(err); }
    return done(null, client);
  });
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, done) {
  var code = crypto.randomBytes(16).toString('hex');
  
  authorizationCodes.save(code, client.id, redirectUri, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, code);
  });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, done) {
  authorizationCodes.find(code, function(err, authCode) {
    if (err) { return done(err); }
    if (authCode === undefined) { return done(null, false); }
    //Can't make row below to work - so drop it for now
    //if (client.id !== authCode.clientId) { return done(null, false); }
    if (redirectUri !== authCode.redirectUri) { return done(null, false); }

      authorizationCodes.delete(code, function(err) {
        if(err) { return done(err); }
        var token = crypto.randomBytes(128).toString('hex');
        accessTokens.save(token, authCode.userId, authCode.clientId, function(err) {
          if (err) { return done(err); }
            done(null, token, {
              //"expires_in": "3600",
              "scope": "patient/Observation.read patient/Patient.read", //TODO Provide a better mechanism to deal with SMART on FHIR permissions
              //"refresh_token": "a47txjiipgxkvohibvsm",
              intent: "client-ui-name", // TODO Not sure what is this
              patient:  authCode.userId,
              encounter: "456" //TODO Required for SMART on FHIR have to be inferred from request         
            });
        });
      });
  });
}));

// Exchange refreshToken for an access token.
/*server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
       
       // TODO - actually implement it.
 
    });
}));*/

/**
 * Authorize client if possible.
 */
module.exports.authorization = [
  // Has to be authenticated
  function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return passport.authenticate(['basic', 'oauth2-client-password'])(req, res, next);
  },
  //login.ensureLoggedIn(),
  server.authorization(function(clientId, redirectUri, done) {
    //console.log("Trying to authorize client: " + clientId + " " + redirectUri);
    clients.findByClientId(clientId, function(err, client) {
      if (err) { return done(err); }
      // WARNING: For security purposes, it is highly advisable to check that
      //          redirectUri provided by the client matches one registered with
      //          the server.  For simplicity, this example does not.  You have
      //          been warned.
      return done(null, client, redirectUri);
    });
  }),
  //Quick and dirty solution
  function(req, res){
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
    //console.log(req.user);
    html = html.replace('<%= user.name %>',req.user.username)
        .replace('<%= client.name %>',req.oauth2.client.name)
        .replace('<%= transactionID %>',req.oauth2.transactionID);
    res.send( html);
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
 * Render simple login form - NOT TESTED!!! It might be used in some fallback scenarios, but not requred in 99%
 */
module.exports.displaylogin = function(req, res) {
  var html = '<DOCTYPE html><html><head><head><body></body>' + 
    '<form method="post" action="/oauth2/login">' +

      '<div id="username">' +
        '<label>Username:</label>' +
        '<input type="text" value="bob" name="username">' +
      '</div>' +

      '<div id="password">' +
        '<label>Password:</label>' +
        '<input type="password" value="secret" name="password">' +
      '</div>' +

      '<div id="info"></div>' +
        '<div id="submit">' +
        '<input type="submit" value="submit">' +
      '</div>' +

    '</form>' +
    '</form></html>';
    //console.log(req.user);
    html = html.replace('<%= user.name %>',req.user.username)
        .replace('<%= client.name %>',req.oauth2.client.name)
        .replace('<%= transactionID %>',req.oauth2.transactionID);
    res.send( html); 
};

/**
 * Process login
 */
module.exports.login = function() {
  return passport.authenticate('local', { failureRedirect: '/oauth2/login' });
};

/**
 * Exchange access code to an access token.
 */
module.exports.token = [
    // We can't enforce clients to use authentication, so drop it for now
    //passport.authenticate(['basic', 'oauth2-client-password'], { session: false })
    server.token(),
    server.errorHandler()
];