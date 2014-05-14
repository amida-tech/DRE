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
var record = require('../../record');

app.get('/api/v1/record/allergies', function(req, res) {
    record.getAllergies('test', function(err, allergyList) {
        if (err) {
            res.send(400, err);
        } else {
            //May be part of model?
            var serverityReference = {
                    "Mild": 1,
                    "Mild to Moderate": 2,
                    "Moderate": 3,
                    "Moderate to Severe": 4,
                    "Severe": 5,
                    "Fatal": 6
            };
            for (var i=0;i<allergyList.length;i++) {
                for (severity in serverityReference) {
                    if (severity.toUpperCase() === allergyList[i].severity.toUpperCase()) {
                        allergyList[i].severity_weight = serverityReference[severity];
                    }
                }
            }
            var allergyJSON = {};
            allergyJSON.allergies = allergyList;
            res.send(allergyJSON);
        }
    });
});
