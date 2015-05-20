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
        required: true
    }
});

var ClientModel = connection.model('Client', Client);

// AccessToken
var AccessToken = new Schema({
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

var RefreshTokenModel = connection.model('RefreshToken', RefreshToken);
//var UserModel = mongoose.model('User');

module.exports.ClientModel = ClientModel;
module.exports.AccessTokenModel = AccessTokenModel;
module.exports.RefreshTokenModel = RefreshTokenModel;

//Substitutes
var authorizationCodes = module.exports.authorizationCodes = (function(){
   var codes = {};
   
   return  {
       codes : codes,

       find : function(key, done) {
          var code = codes[key];
          return done(null, code);
        },
        
        save : function(code, clientID, redirectURI, userID, done) {
          codes[code] = { clientID: clientID, redirectURI: redirectURI, userID: userID };
          return done(null);
        },
        
        delete : function(key, done) {
            delete codes[key];
            return done(null);
        } 
   };
})();

var clients = module.exports.clients = (function() {
    var clients =[{ id: '1', name: 'Cardiac Risk', clientId: 'cardiac_risk', clientSecret: '' }];
    
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
    
    findByClientId : function(clientId, done) {
      for (var i = 0, len = clients.length; i < len; i++) {
        var client = clients[i];
        if (client.clientId === clientId) {
          return done(null, client);
        }
      }
      return done(null, null);
    }    
    };
}) ();

var accessTokens = module.exports.accessTokens = (function() {
    var tokens = {};
    return {
        tokens : tokens,
        
        find : function(key, done) {
          var token = tokens[key];
          return done(null, token);
        },
        
        save : function(token, userID, clientID, done) {
          tokens[token] = { userID: userID, clientID: clientID };
          return done(null);
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

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
  var code = crypto.randomBytes(16).toString('hex');
  
  authorizationCodes.save(code, client.id, redirectURI, user.id, function(err) {
    if (err) { return done(err); }
    done(null, code);
  });
}));

server.exchange(oauth2orize.exchange.code({ userProperty: "client_id" }, function(client, code, redirectURI, done) {
  authorizationCodes.find(code, function(err, authCode) {
    if (err) { return done(err); }
    if (authCode === undefined) { return done(null, false); }
//??????    if (client.id !== authCode.clientID) { return done(null, false); }
    if (redirectURI !== authCode.redirectURI) { return done(null, false); }

      authorizationCodes.delete(code, function(err) {
        if(err) { return done(err); }
        var token = crypto.randomBytes(128).toString('hex');
        accessTokens.save(token, authCode.userID, authCode.clientID, function(err) {
          if (err) { return done(err); }
            done(null, token, {
              //"expires_in": "3600",
              "scope": "patient/Observation.read patient/Patient.read",
              //"refresh_token": "a47txjiipgxkvohibvsm",
              intent: "client-ui-name",
              patient:  authCode.userID,
              encounter: "456"             
            });
        });
      });
  });
}));

// Exchange refreshToken for an access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }

        UserModel.findById(token.userId, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });
            AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
                if (err) return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('hex');
            var refreshTokenValue = crypto.randomBytes(32).toString('hex');
            var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
            var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
            refreshToken.save(function (err) {
                if (err) { return done(err); }
            });
            var info = { scope: '*' }
            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, tokenValue, refreshTokenValue, { 'expires_in': 5000 /*config.get('security:tokenLife')*/ });
            });
        });
    });
}));

exports.authorization = [
  login.ensureLoggedIn(),
  server.authorization(function(clientID, redirectURI, done) {
    //console.log("Trying to authorize client: " + clientID + " " + redirectURI);
    clients.findByClientId(clientID, function(err, client) {
      if (err) { return done(err); }
      // WARNING: For security purposes, it is highly advisable to check that
      //          redirectURI provided by the client matches one registered with
      //          the server.  For simplicity, this example does not.  You have
      //          been warned.
      return done(null, client, redirectURI);
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

exports.decision = [
  login.ensureLoggedIn(),
  server.decision()
];

// token endpoint
exports.token = [
    // We can't enforce clients to use authentication, so drop it for now
    //passport.authenticate(['basic', 'oauth2-client-password'], { session: false })
    server.token(),
    server.errorHandler()
];




