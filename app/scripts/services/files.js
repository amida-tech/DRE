'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.files
 * @description
 * # files
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('files', function files() {

        this.getFiles = function (callback) {
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

            callback(null, fileList);

        };

    });