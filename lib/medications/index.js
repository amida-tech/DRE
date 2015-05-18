var express = require('express');
var app = module.exports = express();
var login = require('../login');
var dre = require('../dre');

var record = require('blue-button-record');

function deleteMedication(ptKey, id, callback) {
    record.deleteMedication(ptKey, id, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null,result);
        }
    });
}

function editMedication(ptKey, medication, id, callback) {
    record.editMedication(ptKey, id, medication, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null,result);
        }
    });
}

function addMedication(ptKey, medication, callback) {
    console.log("adding medication: " + JSON.stringify(medication));

    record.addMedication(ptKey, medication, function (err, result) {
        if (err) {
            callback(err);
        } else {
            console.log("Added this:", result);
            callback(null,result);
        }
    });
}

function allMedicationsInOrder(ptKey, callback) {
    record.getAllMedications(ptKey, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null,result);
        }
    });
}

app.get('/api/v1/medications/all', login.checkAuth, function (req, res) {
    allMedicationsInOrder(req.user.username, function(err,result){
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/medications/add', login.checkAuth, function (req, res) {
    addMedication(req.user.username, req.body.medication, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/medications/edit', login.checkAuth, function (req, res) {
    editMedication(req.user.username, req.body.medication, req.body.id, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/medications/delete', login.checkAuth, function (req, res) {
    deleteMedication(req.user.username, req.body.id, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});
