'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/conditions
 * @description
 * # record/conditions
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('conditions', function conditions() {

        var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': "I've had this a few times over the course of my life",
                'date': '2009-01-30T08:12:00Z',
                'starred': false
            }]
        };

        var tmpCondition = {
            "date_time": {
                "low": {
                    "date": "2008-01-03T00:00:00Z",
                    "precision": "day"
                },
                "high": {
                    "date": "2008-01-03T00:00:00Z",
                    "precision": "day"
                }
            },
            "identifiers": [{
                "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
            }],
            "negation_indicator": false,
            "problem": {
                "code": {
                    "name": "Pneumonia",
                    "code": "233604007",
                    "code_system_name": "SNOMED CT"
                },
                "date_time": {
                    "low": {
                        "date": "2008-01-03T00:00:00Z",
                        "precision": "day"
                    },
                    "high": {
                        "date": "2008-01-03T00:00:00Z",
                        "precision": "day"
                    }
                }
            },
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": {
                "name": "Resolved",
                "date_time": {
                    "low": {
                        "date": "2008-01-03T00:00:00Z",
                        "precision": "day"
                    },
                    "high": {
                        "date": "2009-02-27T13:00:00Z",
                        "precision": "second"
                    }
                }
            },
            "patient_status": "Alive and well",
            "source_list_identifiers": [{
                "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
            }]
        };

        var tmpPartial = {
            "date_time": {
                "low": {
                    "date": "2008-01-03T00:00:00Z",
                    "precision": "day"
                },
                "high": {
                    "date": "2008-01-03T00:00:00Z",
                    "precision": "day"
                }
            },
            "identifiers": [{
                "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
            }],
            "negation_indicator": false,
            "problem": {
                "code": {
                    "name": "Pneumonia"
                }
            },
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": {
                "name": "Resolved",
                "date_time": {
                    "low": {
                        "date": "2008-01-03T00:00:00Z",
                        "precision": "day"
                    },
                    "high": {
                        "date": "2009-02-27T13:00:00Z",
                        "precision": "second"
                    }
                }
            },
            "patient_status": "Alive and well",
            "source_list_identifiers": [{
                "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
            }]
        };

        this.getRecord = function (callback) {

            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpCondition
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
                        "problem": "diff"
                    },
                    "srcMatch": {
                        'metadata': tmpMetaData,
                        'data': tmpCondition
                    },
                    "newMatch": tmpPartial
                }];

                callback(null, tmpMatch);
        }

    });
