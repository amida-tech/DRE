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
<<<<<<< HEAD
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
            }];

            callback(null, tmpConditions);

        }

        this.getPartialRecord = getPartialRecord;

        var getRecord = function (callback) {
           var tmpConditions = [{
=======
                }
            },
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": {
                "name": "Resolved",
>>>>>>> master
                "date_time": {
                    "low": {
                        "date": "2008-01-03T00:00:00Z",
                        "precision": "day"
<<<<<<< HEAD
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
=======
>>>>>>> master
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

        var getRecordMeta = function (callback) {
            callback(null, tmpMetaData);
        }

        this.getRecordMeta = getRecordMeta;

        this.getRecord = function (callback) {

            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpCondition
            }];

            callback(null, tmpReturn);

        }

        this.getRecord = getRecord;

        var saveEntry = function (entry, callback) {
        console.log(entry);
        callback(null);
    }

    this.saveEntry = saveEntry;

        var getPartialMatch = function (callback) {

        getPartialRecord(function (err, partialResults) {
            getRecord(function (err, recordResults) {

                var tmpMatch = [{
                    "match": "partial",
                    "percent": 75,
                    "subelements": {},
                    "diff": {
                        "problem":"diff"
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