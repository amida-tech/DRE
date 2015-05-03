'use strict';

var record = require('blue-button-record');

var app = require('./config/app');
var server = module.exports = app();

//Launch Application.
var dboptions =
    record.connectDatabase(server.get('db_url'), {
        dbName: server.get('dbnameurl')
    }, function (err) {
        console.log(server.get('db_url'));
        if (err) {
            console.log("DB error");
            console.log(err);
        } else {
            server.listen(server.get('port'), '0.0.0.0');
            console.log("Server listening on port " + server.get('port'));
        }
    });
