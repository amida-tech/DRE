/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var app = express();
var record = require('blue-button-record');
var passport = require('passport');
//var redis = require("redis").createClient();
//var redisStore = require('connect-redis')(express); //uncomment for Redis session support during development

app.set('client_location', path.resolve(__dirname, '../client/dist'));

//app.use(express.favicon(config.client.location + '/favicon.ico'));
app.use(express.static(app.get('client_location')));
app.use(function(req, res, next) {
    var requestPath = '';
    if (req.path.substring(req.path.length - 1) === '/') {
        requestPath = req.path.substring(0, req.path.length - 1);
    } else {
        requestPath = req.path;
    }
    var viewPath = app.get('client_location') + requestPath + '.html';
    fs.exists(viewPath, function(exists) {
        console.log(viewPath);
        if (exists) {

            res.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            res.render(viewPath);
        } else {
            next();
        }
    });
});

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

//app.use(express.session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}));
app.use(express.session({
    secret: 'keyboard cat'
    ,store: new redisStore({host:'127.0.0.1', port:6379, prefix:'chs-sess'})  //uncomment for Redis session support during development
}));

app.use(passport.initialize());
app.use(passport.session());

var storage = require('./lib/storage');
app.use(storage);

var parser = require('./lib/parser');
app.use(parser);

var healthRecord = require('./lib/record');
app.use(healthRecord);

var merges = require('./lib/merge');
app.use(merges);

var match = require('./lib/match');
app.use(match);

var notification = require('./lib/notification');
app.use(notification);

var login = require('./lib/login');
app.use(login);

var account = require('./lib/account');
app.use(account);

//Initialize Database Connection.
var databaseServer = 'localhost';

//Launch Application.
record.connectDatabase(databaseServer, function(err) {
    if (err) {
        console.log(err);
    } else {
        app.listen(3000, '0.0.0.0');
        console.log("Server listening on port " + 3000);
    }
});
