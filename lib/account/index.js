var express = require('express');
var app = module.exports = express();

app.get('/api/v1/account', function (req, res) {
    res.send({
        "authenticated": req.isAuthenticated()
    });
});
