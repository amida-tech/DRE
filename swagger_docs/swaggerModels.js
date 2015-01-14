//https://github.com/swagger-api/swagger-node-express/blob/master/sample-application/models.js

//Deprecated: Swagger 2.0 keeps it all in one file, see "definitions" field
exports.eventSchema = {
	"eventSchema": {
        "required": [
            "userID",
            "event_type"
        ],
        "properties": {
            "userID": {
                "type": "string"
            },
            "event_type": {
                "type": "string",
                "enum": [
                    "initAccount",
                    "loggedIn",
                    "loggedOut",
                    "fileUploaded",
                    "fileDownloaded",
                    "labResults",
                    "passwordChange",
                    "infoUpdate"
                ]
            },
            "note": {
                "type": "string"
            },
            "fileRef": {
                "type": "string"
            }
        }
    }
}

	