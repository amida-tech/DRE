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

        var tmpPartial = {
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
        };

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

        var tmpSocial = {
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
        };

        this.getRecord = function (callback) {
            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpSocial
            }];

            callback(null, tmpReturn);
        }

        this.getPartialRecord = function (callback) {

            var tmpReturn = [{
                'metadata': '',
                'data': tmpPartial
            }];

            callback(null, tmpReturn);
        }

        this.getPartialMatch = function (callback) {
                var tmpMatch = [{
                    "match": "partial",
                    "percent": 75,
                    "subelements": {},
                    "diff": {
                        "date_time": "diff"
                    },
                    "srcMatch": {
                        'metadata': tmpMetaData,
                        'data': tmpSocial
                    },
                    "newMatch": tmpPartial
                }];

                callback(null, tmpMatch);
        }

    });