//https://github.com/swagger-api/swagger-node-express/blob/master/sample-application/models.js

//TODO: figure out which datatypes/models are needed + how to organize them
exports.models = {
	'Event': {
		'id': 'Event',
		'required':['id','name'],
		'properties': {
			'id': {
				'type': 'integer',
				'format': 'int64',
				'description':'Event identifier', 
				//minimum:
				//maximum:	
			},
			'userID':{ //make a model for this too?
				'login': 'string',
				'uuid': 'string' //????
			}
			'name':{
				'type': 'string',
				'enum': ['initAccount', 'loggedIn', 'loggedOut','fileUploaded', 'fileDownloaded', 'labResults', 'passwordChange', 'infoUpdate'],
				'description': 'full title' //from lookup table
			},
			'date': 'Date', //look at Swagger docs
			'file':{
				'$ref': 'File',
				'description': 'description of the file'
			}
		}
	},
	'File':{

	}
}