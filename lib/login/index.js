var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
// var flash = require('connect-flash');
var record = require('blue-button-record');
// var moment = require('moment');
//TODO clean up connect flash stuff


var databaseServer = process.env.DB || 'localhost:27017';
console.log("login.js DB: ", 'mongodb://' + databaseServer + '/dre');

//var connection = mongoose.connect('mongodb://'+app.get("db_url")+'/'+app.get("db_name"));
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/dre');

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
    User = connection.model('User', userSchema);
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
function newAccount(inputBody, done) {
    var inputUsername = inputBody.username;
    var inputPassword = inputBody.password;
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

    record.saveSection('demographics', inputInfo.username, inputFormat, function(err) {
        if (err) {
            throw err;
        } else {
            console.log(inputFormat);
            // console.log('registration info saved to profile', inputFormat);
        }
    })
}


app.post('/api/v1/register', function(req, res) {
    //console.log("register API:", req.body);
    newAccount(req.body, function(err, account) {
        if (err) {
            res.status(400).send(err);
        } else {
            //console.log(account);
            record.saveEvent('initAccount', req.body.username, "User created account '" + req.body.username + "'", null, function(err) {
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


app.post('/api/v1/changepassword', function(req, res) {
    console.log("changepassword API:", req.body);

    var old_password = req.body.old;
    var new_password = req.body.new;

    User.find(function(error, users) {
        if (users) {
            console.log(users);

            var current_user;

            if (users.length === 1) {
                current_user = users[0];
                console.log("user found");
            } else {
                console.log("user not found");
                res.status(400).send('Password change error ' + err);
            }

            current_user.authenticate(old_password, function(err, data) {
                if (err) {
                    console.log("auth err", err);
                    res.status(400).send('Old Password doesn\'t match' + err);
                } else {
                    console.log("old password match");
                    current_user.setPassword(new_password, function(err, data) {
                        if (err) {
                            console.log("set password fail", err);
                        }


                        current_user.save(function(err, data) {
                            console.log("saving user");
                            record.saveEvent('passwordChange', req.body.username, "User changed password", null, function(err) {
                                if (err) {
                                    console.log("change err", err);
                                    res.status(400).send('Password change error ' + err);
                                } else {
                                    console.log("password change success");
                                    res.status(200).end();
                                }
                            });


                        });

                    });
                }


            });



        } else {
            console.log("errr in passwd change api");
            res.status(400).send('Password change error ' + err);
        }
    });


});

// check if username already exists
app.get('/api/v1/users', function(req, res) {
    User.find(function(error, users) {
        if (users) {
            console.log(users);
            res.send(users);
        } else {
            // res.send(false);
        }
    });
});


app.post('/api/v1/login',
    passport.authenticate('local'),
    function(req, res) {
        record.saveEvent('loggedIn', req.user.username, "User logged in from IP address '" + req.ip + "'", null, function(err) {
            if (err) {
                res.status(400).send('Event error ' + err);
            } else {
                res.status(200).end();
            }
        });
    });

//logout
app.post('/api/v1/logout', checkAuth, function(req, res) {
    record.saveEvent('loggedOut', req.user.username, '', null, function(err) {
        if (err) {
            req.logout();
            res.status(400).send('Event error ' + err);
        } else {
            req.logout();
            res.status(200).end();

        }
    });
});
//logout
app.get('/api/v1/logout', checkAuth, function(req, res) {
    record.saveEvent('loggedOut', req.user.username, '', null, function(err) {
        if (err) {
            req.logout();
            res.status(400).send('Event error ' + err);
        } else {
            req.logout();
            res.status(200).end();
        }
    });
});


// {
//             "point": {
//                 "date": inputDOB,
//                 "precision": "day"
//             }
// }
