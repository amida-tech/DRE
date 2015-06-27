var express = require('express');
var app = module.exports = express();
var login = require('../login');
var record = require('blue-button-record');



app.get('/api/v1/demo', login.checkAuth, function (req, res) {
	record.clearDatabase(function (err) {
		if(err) {
			throw(err);
		}
	});
});