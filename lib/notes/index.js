var express = require('express');
var app = module.exports = express();
var login = require('../login');

var record = require('blue-button-record');

function starNote(ptKey, id, star, callback) {
    record.starNote(ptKey, id, star, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function deleteNote(ptKey, id, callback) {
    record.deleteNote(ptKey, id, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function editNote(ptKey, id, note, callback) {
    console.log("note ", note);

    record.editNote(ptKey, id, note, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function addNote(ptKey, entry, section, note, callback) {
    record.addNote(ptKey, section, entry, note, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

function allNotesInOrder(ptKey, callback) {
    record.getAllNotes(ptKey, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result);
        }
    });
}

app.get('/api/v1/notes/all', login.checkAuth, function (req, res) {
    allNotesInOrder(req.user.username, function (err, result) {
        if (err) {
            console.log("err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/notes/add', login.checkAuth, function (req, res) {
    addNote(req.user.username, req.body.entry, req.body.section, req.body.note, function (err, result) {
        if (err) {
            console.log("err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/notes/edit', login.checkAuth, function (req, res) {
    editNote(req.user.username, req.body.id, req.body.note, function (err, result) {
        if (err) {
            console.log("err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/notes/star', login.checkAuth, function (req, res) {
    starNote(req.user.username, req.body.id, req.body.star, function (err, result) {
        if (err) {
            console.log("err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});

app.post('/api/v1/notes/delete', login.checkAuth, function (req, res) {
    deleteNote(req.user.username, req.body.id, function (err, result) {
        if (err) {
            console.log("err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(result);
        }
    });
});
