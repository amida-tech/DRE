
var express = require('express');
var app = module.exports = express();

app.get('/record/allergies', function(req, res) {


  var stub_response = {allergies: [{
        date_range: {
          start: '1/1/1922',
          end: '2/1/1984'
        },
        name: 'Hay',
        code: 1234,
        code_system: 1234,
        code_system_name: 'RxNorm',
        status: 'active',
        severity: 'mild',
        reaction: {
          name: 'hives',
          code: 247472004,
          code_system: 'test data'
        }
      },
      {
        date_range: {
          start: '1/1/1922',
          end: '2/1/1984'
        },
        name: 'Penicillin',
        code: 1234,
        code_system: 1234,
        code_system_name: 'RxNorm',
        status: 'active',
        severity: 'mild',
        reaction: {
          name: 'hives',
          code: 247472004,
          code_system: 'test data'
        }
      }]
    }

  res.send(stub_response);
});