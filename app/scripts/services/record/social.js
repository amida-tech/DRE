'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/social
 * @description
 * # record/social
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('social', function social() {

        this.getRecord = function (callback) {

            var tmpSocial = [{
                "date_time": {
                    "low": {
                        "date": "2005-05-01T00:00:00Z",
                        "precision": "day"
                    },
                    "high": {
                        "date": "2009-02-27T13:00:00Z",
                        "precision": "second"
                    }
                },
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19",
                    "extension": "123456789"
                }],
                "code": {
                    "name": "Smoking Status"
                },
                "value": "Former smoker"
            }];

            callback(null, tmpSocial);

        }

    });