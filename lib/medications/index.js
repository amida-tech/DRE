var express = require('express');
var app = module.exports = express();
var login = require('../login');

var record = require('blue-button-record');


function deleteMedication(req, res) {
    var ptKey = req.user.username;
    var id = req.body.id;

    record.deleteMedication(ptKey, id, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function editMedication(req, res) {
    var ptKey = req.user.username;
    var medication = req.body.data;
    var id = req.body.id;

    console.log("medication ", medication);

    record.editMedication(ptKey, id, medication, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function addMedication(req, res) {
    var ptKey = req.user.username;
    var medication = req.body.data

    record.addMedication(ptKey, medication, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function allMedicationsInOrder(req, res) {
    var ptKey = req.user.username;

    record.getAllMedications(ptKey, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

app.get('/api/v1/medications/all', login.checkAuth, function (req, res) {
    allMedicationsInOrder(req, res);
});

app.post('/api/v1/medications/add', login.checkAuth, function (req, res) {
    addMedication(req, res);
});

app.post('/api/v1/medications/edit', login.checkAuth, function (req, res) {
    editMedication(req, res);
});

app.post('/api/v1/medications/delete', login.checkAuth, function (req, res) {
    deleteMedication(req, res);
});
