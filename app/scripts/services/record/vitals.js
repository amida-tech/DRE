'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/vitals
 * @description
 * # record/vitals
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('vitals', function vitals() {

        var tmpPartial = {
                "identifiers": [{
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }],
            "vital": {
                "name": "Height",
                "code": "8302-2",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2012-09-07T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 66,
            "unit": "[in_i]"
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

        var tmpVitals = [{
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Height",
                "code": "8302-2",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2012-09-07T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 68,
            "unit": "[in_i]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Intravascular Systolic",
                "code": "8480-6",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-05-07T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 124,
            "unit": "mm[Hg]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Intravascular Systolic",
                "code": "8480-6",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-06-14T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 130,
            "unit": "mm[Hg]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Intravascular Systolic",
                "code": "8480-6",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-09-01T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 115,
            "unit": "mm[Hg]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Intravascular Diastolic",
                "code": "8480-6",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-05-07T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 80,
            "unit": "mm[Hg]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Intravascular Diastolic",
                "code": "8480-6",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-06-14T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 82,
            "unit": "mm[Hg]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Intravascular Diastolic",
                "code": "8480-6",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-09-01T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 76,
            "unit": "mm[Hg]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Patient Body Weight - Measured",
                "code": "3141-9",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-10-08T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 140,
            "unit": "[lb_av]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Patient Body Weight - Measured",
                "code": "3141-9",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-10-12T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 142,
            "unit": "[lb_av]"
        }, {
            "identifiers": [{
                "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
            }],
            "vital": {
                "name": "Patient Body Weight - Measured",
                "code": "3141-9",
                "code_system_name": "LOINC"
            },
            "status": "completed",
            "date_time": {
                "point": {
                    "date": "2014-10-16T00:00:00Z",
                    "precision": "day"
                }
            },
            "interpretations": [
                "Normal"
            ],
            "value": 146,
            "unit": "[lb_av]"
        }];

        this.getRecord = function (callback) {

            var returnArray = [];

            _.each(tmpVitals, function (entry) {

                var tmpReturn = {
                    'metadata': angular.copy(tmpMetaData),
                    'data': entry
                };

                returnArray.push(tmpReturn);

            });

            callback(null, returnArray);
        }

        this.getPartialRecord = function (callback) {

            var tmpReturn = [{
                'metadata': '',
                'data': tmpPartial
            }];

            callback(null, tmpReturn);
        }

    });