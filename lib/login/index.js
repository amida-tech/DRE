var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');


var databaseServer = process.env.DB || 'localhost:27017';
console.log("login.js DB: ", 'mongodb://'+databaseServer+'/dre');

//var connection = mongoose.connect('mongodb://'+app.get("db_url")+'/'+app.get("db_name"));
var connection = mongoose.connect('mongodb://'+databaseServer+'/dre');

var Schema = mongoose.Schema;


//define user schema
function defineUserSchema() {
    userSchema = new Schema({
        username: String,
        password: String
    });
    userSchema.plugin(passportLocalMongoose);
    User = mongoose.model('User', userSchema);
    configurePassport();
}


// passport config
function configurePassport() {
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}

defineUserSchema();


// register new users
function newAccount(inputUsername, inputPassword, callback) {
    var account = new User({
        username: inputUsername
    });
    User.register(account, inputPassword, function(err, user) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

module.exports.newAccount = newAccount;

function checkAuth(req, res, next) {
    //console.log("is Authenticated: ", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    //console.log("no auth");
    res.send(401);
}

module.exports.checkAuth = checkAuth;

app.post('/api/v1/register', function(req, res) {
    newAccount(req.body.username, req.body.password, function(err, account) {
        if (err) {
            res.send(400, err);
        } else {
            res.send(200);
        }
    });
});

app.post('/api/v1/login',
    passport.authenticate('local'), function(req, res) {
        res.send(200);
    });

//logout
app.post('/api/v1/logout', function(req, res) {
    req.logout();
    res.send(200);
});
//logout
app.get('/api/v1/logout', function(req, res) {
    req.logout();
    res.send(200);
});
