/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var express = require('express');
var app = module.exports = express();
var record = require('../recordjs');

//Get all merges API.
app.get('/api/v1/merges', function(req, res) {
    record.getMerges('allergy', 'name severity', 'filename uploadDate', function(err, mergeList) {
        if (err) {
            res.send(400, err);
        } else {
            var mergeJSON = {};
            mergeJSON.merges = mergeList;
            res.send(mergeJSON);
        }
    });
});




