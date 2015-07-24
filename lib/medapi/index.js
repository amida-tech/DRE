var express = require('express');
var app = module.exports = express();
var login = require('../login');

var rxnorm = require("rxnorm-js");

// app.get('/api/v1/rximage/:rxcui', login.checkAuth, function (req, res) {
//     rxnorm.queryRxImageCode(req.params.rxcui, function (err, data) {
//         if (err) {
//             res.status(400).send(err);
//         } else {
//             res.set('Content-Type', 'application/json');
//             res.status(200).send(data)
//         }
//     });
// });
/*
app.get('/api/v1/rxnorm/:medname', login.checkAuth, function (req, res) {
    rxnorm.queryRxNorm(req.params.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});
*/
app.post('/api/v1/rximage', login.checkAuth, function (req, res) {
    rxnorm.queryRxImageCode(req.body.rxcui, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/name', login.checkAuth, function (req, res) {
    rxnorm.queryRxNormName(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/spelling', login.checkAuth, function (req, res) {
    rxnorm.queryRxNormSpelling(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/approximate', login.checkAuth, function (req, res) {
    rxnorm.queryRxNormApproximate(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/group', login.checkAuth, function (req, res) {
    rxnorm.queryRxNormGroup(req.body.medname, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/dfg', login.checkAuth, function (req, res) {
    rxnorm.queryRxNormDFG(req.body.rxcui, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/openfda/name', login.checkAuth, function (req, res) {
    rxnorm.queryfdaName(req.body.medname, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/openfda/code', login.checkAuth, function (req, res) {
    rxnorm.queryfdaCode(req.body.rxcui, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/medlineplus', login.checkAuth, function (req, res) {
    rxnorm.queryMedlinePage(req.body.rxcui, req.body.medname, function (err, data) {
        if (err) {
            console.log("medline plus err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});
