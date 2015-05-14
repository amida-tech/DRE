var express = require('express');
var app = module.exports = express();
var oauth2orize = require('oauth2orize')
  , passport = require('passport');
  //, login = require('connect-ensure-login');

var server = oauth2orize.createServer();
var client = { id: '1', name: 'Cardiac Risk', clientId: 'cardiac_risk', clientSecret: 'ssh-secret' };
    
server.serializeClient(function(client, done) {
  return done(null, client.id);
});

server.deserializeClient(function(id, done) {
    return done(null, client);
});

server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
  var code = utils.uid(16)
  
  db.authorizationCodes.save(code, client.id, redirectURI, user.id, function(err) {
    if (err) { return done(err); }
    done(null, code);
  });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
  db.authorizationCodes.find(code, function(err, authCode) {
    if (err) { return done(err); }
    if (authCode === undefined) { return done(null, false); }
    if (client.id !== authCode.clientID) { return done(null, false); }
    if (redirectURI !== authCode.redirectURI) { return done(null, false); }

      db.authorizationCodes.delete(code, function(err) {
        if(err) { return done(err); }
        var token = utils.uid(256);
        db.accessTokens.save(token, authCode.userID, authCode.clientID, function(err) {
          if (err) { return done(err); }
            done(null, token);
        });
      });
  });
}));



app.get('/oauth2/regster', function (req, res) {
    console.log('register');
    console.log(req);
    res.send({
        'authenticated': req.isAuthenticated()
    });
});

app.get('/oauth2/authorize', function (req, res) {
    console.log('authorize');
    //console.log(req);
    
    server.authorize(function(clientID, redirectURI, done) {
	// Return fake client
        (function(err, client) {
	    console.log("1 client.redirectURI " + client.redirectURI);
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (!client.redirectUri != redirectURI) { return done(null, false); }
	    console.log("2 client.redirectURI " + client.redirectURI)
            return done(null, client, client.redirectURI);
        })(client);
    },
    function(req, res) {
    	console.log("3 render dialog " + req.oauth2.transactionID)
        res.render('dialog', { transactionID: req.oauth2.transactionID,
                           user: req.user, client: req.oauth2.client });
     })
});

app.post('/oauth2/token', function (req, res) {
    console.log('token');
    console.log(req);
    res.send({
        "authenticated": req.isAuthenticated()
    });
});
