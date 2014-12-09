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

        var getPartialRecord = function (callback) {

            var tmpSocial = [{
                "date_time": {
                    "low": {
                        "date": "2005-04-30T00:00:00Z",
                        "precision": "day"
                    },
                    "high": {
                        "date": "2012-02-27T13:00:00Z",
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

        this.getPartialRecord = getPartialRecord;

        var getRecord = function (callback) {

            var tmpSocial = [{
                "date_time": {
                    "low": {
                        "date": "2005-04-30T00:00:00Z",
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

        this.getRecord = getRecord;

                var saveEntry = function(entry, callback) {
            console.log(entry);
            callback(null);
        }

        this.saveEntry = saveEntry;

        var getPartialMatch = function(callback) {

            getPartialRecord(function(err, partialResults) {
                getRecord(function(err, recordResults) {

                    var tmpMatch = [{
                        "match": "partial",
                        "percent": 75,
                        "subelements": {},
                        "diff": {
                            "date_time": "diff"
                        },
                        "srcMatch": recordResults[0],
                        "newMatch": partialResults[0]
                    }];

                    callback(null, tmpMatch);

                });
            });
        }

        this.getPartialMatch = getPartialMatch;


    });