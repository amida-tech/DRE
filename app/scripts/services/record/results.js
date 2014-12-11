'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/results
 * @description
 * # record/results
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('results', function results() {

        var tmpPartial = {
                "identifiers": [{
                    "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                }],
                "result_set": {
                    "name": "CBC WO DIFFERENTIAL"
                },
                "results": [{
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "HGB",
                        "code": "30313-1",
                        "code_system_name": "LOINC"
                    },
                    "date_time": {
                        "point": {
                            "date": "2000-03-23T14:30:00Z",
                            "precision": "minute"
                        }
                    },
                    "status": "completed",
                    "reference_range": {
                        "range": "M 13-18 g/dl; F 12-16 g/dl"
                    },
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 13.2,
                    "unit": "g/dl"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "WBC",
                        "code": "33765-9",
                        "code_system_name": "LOINC"
                    },
                    "date_time": {
                        "point": {
                            "date": "2000-03-23T14:30:00Z",
                            "precision": "minute"
                        }
                    },
                    "status": "completed",
                    "reference_range": {
                        "low": "4.3",
                        "high": "10.8",
                        "unit": "10+3/ul"
                    },
                    "interpretations": [
                        "Normal"
                    ],
                    "value": 6.7,
                    "unit": "10+3/ul"
                }, {
                    "identifiers": [{
                        "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                    }],
                    "result": {
                        "name": "PLT",
                        "code": "26515-7",
                        "code_system_name": "LOINC"
                    },
                    "date_time": {
                        "point": {
                            "date": "2000-03-23T14:30:00Z",
                            "precision": "minute"
                        }
                    },
                    "status": "completed",
                    "reference_range": {
                        "low": "150",
                        "high": "350",
                        "unit": "10+3/ul"
                    },
                    "interpretations": [
                        "Low"
                    ],
                    "value": 123,
                    "unit": "10+3/ul"
                }]
        };

        var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': 'Doctor called, and said there was nothing to worry about here.',
                'date': '2005-05-01T00:12:00Z',
                'starred': false
            }]
        };

        var tmpResult = {
            "identifiers": [{
                "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
            }],
            "result_set": {
                "name": "CBC WO DIFFERENTIAL",
                "code": "43789009",
                "code_system_name": "SNOMED CT"
            },
            "results": [{
                "identifiers": [{
                    "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                }],
                "result": {
                    "name": "HGB",
                    "code": "30313-1",
                    "code_system_name": "LOINC"
                },
                "date_time": {
                    "point": {
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }
                },
                "status": "completed",
                "reference_range": {
                    "range": "M 13-18 g/dl; F 12-16 g/dl"
                },
                "interpretations": [
                    "Normal"
                ],
                "value": 13.2,
                "unit": "g/dl"
            }, {
                "identifiers": [{
                    "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                }],
                "result": {
                    "name": "WBC",
                    "code": "33765-9",
                    "code_system_name": "LOINC"
                },
                "date_time": {
                    "point": {
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }
                },
                "status": "completed",
                "reference_range": {
                    "low": "4.3",
                    "high": "10.8",
                    "unit": "10+3/ul"
                },
                "interpretations": [
                    "Normal"
                ],
                "value": 6.7,
                "unit": "10+3/ul"
            }, {
                "identifiers": [{
                    "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                }],
                "result": {
                    "name": "PLT",
                    "code": "26515-7",
                    "code_system_name": "LOINC"
                },
                "date_time": {
                    "point": {
                        "date": "2000-03-23T14:30:00Z",
                        "precision": "minute"
                    }
                },
                "status": "completed",
                "reference_range": {
                    "low": "150",
                    "high": "350",
                    "unit": "10+3/ul"
                },
                "interpretations": [
                    "Low"
                ],
                "value": 123,
                "unit": "10+3/ul"
            }]
        };

        // var getRecordMeta = function (callback) {
        //     callback(null, tmpMetaData);
        // }

        // this.getRecordMeta = getRecordMeta;

        this.getRecord = function (callback) {

            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpResult
            }];

            callback(null, tmpReturn);

        }

        this.getPartialRecord = function (callback) {

            var tmpReturn = [{
                'metadata':'',
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
                            "result_set": "diff",
                            "results": "new"
                        },
                        "srcMatch": {
                            'metadata': tmpMetaData,
                            'data': tmpResult
                        },
                        "newMatch": tmpPartial
                    }];

            callback(null, tmpMatch);

        }

        // var getPartialRecord = function (callback) {

        //     var tmpResults = [{
        //         "identifiers": [{
        //             "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
        //         }],
        //         "result_set": {
        //             "name": "CBC WO DIFFERENTIAL"
        //         },
        //         "results": [{
        //             "identifiers": [{
        //                 "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
        //             }],
        //             "result": {
        //                 "name": "HGB",
        //                 "code": "30313-1",
        //                 "code_system_name": "LOINC"
        //             },
        //             "date_time": {
        //                 "point": {
        //                     "date": "2000-03-23T14:30:00Z",
        //                     "precision": "minute"
        //                 }
        //             },
        //             "status": "completed",
        //             "reference_range": {
        //                 "range": "M 13-18 g/dl; F 12-16 g/dl"
        //             },
        //             "interpretations": [
        //                 "Normal"
        //             ],
        //             "value": 13.2,
        //             "unit": "g/dl"
        //         }, {
        //             "identifiers": [{
        //                 "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
        //             }],
        //             "result": {
        //                 "name": "WBC",
        //                 "code": "33765-9",
        //                 "code_system_name": "LOINC"
        //             },
        //             "date_time": {
        //                 "point": {
        //                     "date": "2000-03-23T14:30:00Z",
        //                     "precision": "minute"
        //                 }
        //             },
        //             "status": "completed",
        //             "reference_range": {
        //                 "low": "4.3",
        //                 "high": "10.8",
        //                 "unit": "10+3/ul"
        //             },
        //             "interpretations": [
        //                 "Normal"
        //             ],
        //             "value": 6.7,
        //             "unit": "10+3/ul"
        //         }, {
        //             "identifiers": [{
        //                 "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
        //             }],
        //             "result": {
        //                 "name": "PLT",
        //                 "code": "26515-7",
        //                 "code_system_name": "LOINC"
        //             },
        //             "date_time": {
        //                 "point": {
        //                     "date": "2000-03-23T14:30:00Z",
        //                     "precision": "minute"
        //                 }
        //             },
        //             "status": "completed",
        //             "reference_range": {
        //                 "low": "150",
        //                 "high": "350",
        //                 "unit": "10+3/ul"
        //             },
        //             "interpretations": [
        //                 "Low"
        //             ],
        //             "value": 123,
        //             "unit": "10+3/ul"
        //         }]
        //     }];

        //     callback(null, tmpResults);

        // }

        // this.getPartialRecord = getPartialRecord;


        // var saveEntry = function(entry, callback) {
        //     console.log(entry);
        //     callback(null);
        // }

        // this.saveEntry = saveEntry;

        // var getPartialMatch = function(callback) {

        //     getPartialRecord(function(err, partialResults) {
        //         getRecord(function(err, recordResults) {

        //             var tmpMatch = [{
        //                 "match": "partial",
        //                 "percent": 75,
        //                 "subelements": {},
        //                 "diff": {
        //                     "result_set": "diff",
        //                     "results": "new"
        //                 },
        //                 "srcMatch": recordResults[0],
        //                 "newMatch": partialResults[0]
        //             }];

        //             callback(null, tmpMatch);

        //         });
        //     });
        // }

        // this.getPartialMatch = getPartialMatch;
    });