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

<<<<<<< HEAD
        var getPartialRecord = function (callback) {
=======
        var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': 'I should make sure I let my aunt know about this!',
                'date': '2005-05-01T00:12:00Z',
                'starred': true
            }, {
                'comment': 'Remember Macrolides are a good alternative.',
                'date': '2009-05-18T00:08:00Z',
                'starred': false
            }]
        };
>>>>>>> master

        var tmpSocial = {
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
            };



        var getRecordMeta = function (callback) {
            callback(null, tmpMetaData);
        }

        this.getRecordMeta = getRecordMeta;

        this.getRecord = function (callback) {
            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpSocial
            }];

            callback(null, tmpReturn);
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