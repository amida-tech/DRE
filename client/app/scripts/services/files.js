'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.files
 * @description
 * # files
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('files', function files($http) {

        this.getFiles = function (callback) {
            /*
            var fileList = [{
                "name": "consolidated_cda_one.xml",
                "type": "Health Summary",
                "modified": "12/13/2012 2:09 PM"
            }, {
                "name": "provider_record.xml",
                "type": "Health Summary",
                "modified": "12/13/2012 2:09 PM"
            }, {
                "name": "chest_xray.png",
                "type": "Image",
                "modified": "12/13/2012 2:09 PM"
            }];

            */
            $http.get('/api/v1/storage')
                .success(function (data) {
                    callback(null, data.storage);
                    /*
                        {
                        storage: [
                        {
                        file_id: "548b5f0d8e42f100001aa3d6",
                        file_name: "bluebutton-01-original.xml",
                        file_size: 129070,
                        file_mime_type: "application/xml",
                        file_upload_date: "2014-12-12T21:33:01.567Z",
                        file_class: "ccda",
                        patient_key: "test"
                        }
                        ]
                        }                    
                    */
                }).error(function (err) {
                    callback(err);
                });

        };

    });
