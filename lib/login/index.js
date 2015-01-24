var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
// var flash = require('connect-flash');

//TODO clean up connect flash stuff


var databaseServer = process.env.DB || 'localhost:27017';
console.log("login.js DB: ", 'mongodb://'+databaseServer+'/dre');

//var connection = mongoose.connect('mongodb://'+app.get("db_url")+'/'+app.get("db_name"));
var connection = mongoose.connect('mongodb://'+databaseServer+'/dre');

var Schema = mongoose.Schema;


//define user schema
function defineUserSchema() {
    userSchema = new Schema({
        username: String,
        password: String,
        email: String,
        firstName: String,
        middleName: String,
        lastName: String,
        dob: String,
        gender: String,

        //add fields to correspond with registration
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

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.local.password);
// };

defineUserSchema();


// register new users
function newAccount(inputUsername, inputPassword, done) {
    var account = new User({
        username: inputUsername
    });
    User.register(account, inputPassword, function(err, user) {
        if (err) {
            done(err);
        } else {
            done(null, user);
        }
    });
}

    // // check if username already exists
    // User.findOne({'username':inputUsername}, function (err, user) {
    //     if (err) {
    //         return done(err);
    //     }
    //     if (user) {
    //         console.log('username exists: '+user.username);
    //         return done(null, false, { message: 'Username already exists' });
    //     //create new account
    //     } else {
    //         var account = new User({
    //             username: inputUsername
    //         });
    //         User.register(account, inputPassword, function(err, user) {
    //             if (err) {
    //                 done(err);
    //             } else {
    //                 done(null, user);
    //             }
    //         });
    //     }
        
    // });

    // User.register(account, inputPassword, function (err, user) {
    //     if (err) {return done(err); }
    //     if (!user) {
    //         return done(null, false, { message: 'That username is already taken, please choose another.' });
    //     }
    //     return done(null, user);
    // });

module.exports.newAccount = newAccount;

function checkAuth(req, res, next) {
    //console.log("is Authenticated: ", req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    //console.log("no auth");
    res.status(401).end();
}

module.exports.checkAuth = checkAuth;

app.post('/api/v1/register', function(req, res) {
    console.log("register API:", req.body);
    newAccount(req.body.username, req.body.password, function(err, account) {
        if (err) {
            res.status(400).send(err);
        } else {
            console.log(account);
            res.status(200).end();
        }
    });
});

// app.post('/api/v1/login',
//     passport.authenticate('local', { failureRedirect: '/home', failureFlash: true })
// );

app.post('/api/v1/login',
    passport.authenticate('local'), function(req, res) {
        res.status(200).end();
});

//logout
app.post('/api/v1/logout', function(req, res) {
    req.logout();
    res.status(200).end();
});
//logout
app.get('/api/v1/logout', function(req, res) {
    req.logout();
    res.status(200).end();
});
