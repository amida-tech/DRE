var express = require('express');
var app = module.exports = express();
var login = require('../login');
var record = require('blue-button-record');
var mongoose = require('mongoose');
var databaseServer = process.env.DB || 'localhost:27017';
var databaseName = process.env.DBname || 'dre';
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/' + databaseName);
var storage = require('../storage');
var fs = require('fs');
var oauth2 = require('../oauth2');

var reginfo = {
    'username': 'isabella',
    'password': 'testtest',
    'email': 'isabella@amida-demo.com',
    'firstName': 'Isabella',
    'middleName': 'Isa',
    'lastName': 'Jones',
    'dob': '1975-05-01',
    'gender': 'female'
};
var filedata1 = {
    'path': 'test/artifacts/demo-r1.5/bluebutton-cms.txt',
    'name': 'bluebutton-cms.txt',
    'type': 'text/xml'
};
var filedata2 = {
    'path': 'test/artifacts/demo-r1.5/bluebutton-primary.xml',
    'name': 'bluebutton-primary.xml',
    'type': 'text/xml'
};
var filedata3 = {
    'path': 'test/artifacts/demo-r1.5/bluebutton-duplicate.xml',
    'name': 'bluebutton-duplicate.xml',
    'type': 'text/xml'
};

app.get('/api/v1/demo', login.checkAuth, function (req, res) {
    dropdb(function (err) {
        if (err) {
            res.status(400).send(err);
        } else {
            login.newAccount(reginfo, function (err, account) {
                if (err) {
                    res.status(400).send(err);
                } else {

                    demoUpload(account.username, filedata1, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            record.saveEvent('fileUploaded', account.username, "User uploaded '" + filedata3.name, filedata3.name, function (err) {
                                if (err) {
                                    res.status(400).send('Event error ' + err);
                                } else {
                                    demoUpload(account.username, filedata2, function (err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            record.saveEvent('fileUploaded', account.username, "User uploaded '" + filedata2.name, filedata2.name, function (err) {
                                                if (err) {
                                                    res.status(400).send('Event error ' + err);
                                                } else {
                                                    demoUpload(account.username, filedata3, function (err) {
                                                        if (err) {
                                                            res.status(400).send(err);
                                                        } else {
                                                            oauth2.populate;
                                                            record.saveEvent('fileUploaded', account.username, "User uploaded '" + filedata3.name, filedata3.name, function (err) {
                                                                if (err) {
                                                                    res.status(400).send('Event error ' + err);
                                                                } else {
                                                                    res.status(200).end();

                                                                }
                                                            });
                                                        }
                                                    });

                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

function dropdb(callback) {
    connection.db.dropDatabase(function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
    // record.clearDatabase(function (err) {
    // 	if(err) {
    // 		res.status(400).send(err);
    // 	} else {
    // 		res.status(200).end();
    // 	}
    // });
}

function demoUpload(username, recordUpload, callback) {
    fs.readFile(recordUpload.path, 'utf8', function (err, fileData) {
        if (err) {
            console.log('readfile error');
            callback(err);
        } else {
            storage.importRecord(username, recordUpload, fileData, function (err, import_results) {
                if (err) {
                    console.log('import error');
                    callback(err);
                } else {
                    console.log('import_results', import_results);
                    callback(null, import_results);
                }
            });
        }
    });
}
