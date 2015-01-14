var express = require('express'),
	events = require('./routes/accountEvents'),
	bodyParser = require('body-parser');

var app = express();

var swagger = require('swagger-node-express');

swagger.setAppHandler(app);

swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.configure('http://localhost:3005', '0.1');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/accountEvents/add', events.addEvent);
//app.post('/accountEvents', events.addEvent);

app.get('/accountEvents/all', events.allEventsInOrder);
//app.get('/accountEvents/:id', events.getEvent);

app.listen(3005)
console.log('listening on port 3005')