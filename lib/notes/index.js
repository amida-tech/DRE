var express = require('express');
var app = module.exports = express();
var login = require('../login');

var record = require('blue-button-record');

function starNote(req, res) {
    var ptKey = req.user.username;

    var id = req.body.id;
    var star = req.body.star;

    record.starNote(ptKey, id, star, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function editNote(req, res) {
    var ptKey = req.user.username;

    var id = req.body.id;
    var note = req.body.note;
    console.log("note ", note);

    record.editNote(ptKey, id, note, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function addNote(req, res) {
    var ptKey = req.user.username;

    var section = req.body.section;
    var entry = req.body.entry;
    var note = req.body.note;

    record.addNote(ptKey, section, entry, note, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function allNotesInOrder(req, res) {
    var ptKey = req.user.username;

    record.getAllNotes(ptKey, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

function deleteNote(req, res) {
    var ptKey = req.user.username;

    notes.remove({"_id": req.body.id}, function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
};

app.post('/api/v1/notes/delete', login.checkAuth, function (req, res) {
    deleteNote(req, res);
});

app.get('/api/v1/notes/all', login.checkAuth, function (req, res) {
    allNotesInOrder(req, res);
});

app.post('/api/v1/notes/add', login.checkAuth, function (req, res) {
    addNote(req, res);
});

app.post('/api/v1/notes/edit', login.checkAuth, function (req, res) {
    editNote(req, res);
});


app.post('/api/v1/notes/star', login.checkAuth, function (req, res) {
    starNote(req, res);
});
