var express = require('express'),
	events = require('./routes/accountEvents'),
	bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/accountEvents', events.allInOrder);
//app.get('/accountEvents/:id', events.getEvent);

app.get('/accountEvent', events.addEvent);
//app.post('/accountEvents', events.addEvent);

app.listen(3005)
console.log('listening on port 3005')