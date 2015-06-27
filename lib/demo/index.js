var express = require('express');
var app = module.exports = express();
var login = require('../login');
var record = require('blue-button-record');
var mongoose = require('mongoose');
var databaseServer = process.env.DB || 'localhost:27017';
var databaseName = process.env.DBname || 'dre';
var connection = mongoose.createConnection('mongodb://' + databaseServer + '/' + databaseName);

app.get('/api/v1/demo', login.checkAuth, function (req, res) {
    mongoose.connect('mongodb://localhost:27017/dre', function (err) {
        mongoose.connection.db.dropDatabase();
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).end();
        }
    });
    // record.clearDatabase(function (err) {
    // 	if(err) {
    // 		res.status(400).send(err);
    // 	} else {
    // 		res.status(200).end();
    // 	}
    // });
});
