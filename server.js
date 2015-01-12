var express = require('express'),
	events = require('./routes/accountEvents'),
	bodyParser = require('body-parser');

var app = express();

var swagger = require('swagger-node-express'),
	resources = require('./swagger-util/swaggerResources'),
	models = require('./swagger-util/swaggerModels');

//TODO: Implement Swagger 
swagger.setAppHandler(app);
swagger.addModels(swaggerModels)
	.addGet(resources.varName)...;

swagger.configureDeclaration('accountHistory',{
	description: 'Methods for maintaining account history',
	authorizations: [],
	produces: String (['application/json'])
});

swagger.setApiInfo({
	title: 'DRE Account History',
	description: 'API for maintaining account history for PHR based on DRE events',
	termsOfServiceUrl: '',
	contact: '',
	license: '',
	licenseUrl: ''
});

swagger.setAuthorizations(...);

swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.configure('http://localhost:3005', '1.0.0');

/*Serve up Swagger UI for website 
var docs_handler = express.static(__dirname + '/../swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});
*/


app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/accountEvent', events.addEvent);
//app.post('/accountEvents', events.addEvent);

app.get('/accountEvents', events.allInOrder);
//app.get('/accountEvents/:id', events.getEvent);

app.listen(3005)
console.log('listening on port 3005')