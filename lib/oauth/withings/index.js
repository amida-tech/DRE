var express = require('express');
var app = module.exports = express();
var Withings = require('withings-lib');

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

            res.redirect('/files/import');
        }
    );
});
