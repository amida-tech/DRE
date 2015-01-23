var express = require('express'),
	events = require('./routes/accountEvents'),
	bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.post('/account_history', events.addEvent);
//TODO: app.post('/accountEvents', events.addEvent);

app.get('/account_history/all', events.allEventsInOrder);

app.listen(3005)
console.log('listening on port 3005')