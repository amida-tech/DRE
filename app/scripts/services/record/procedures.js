'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/procedures
 * @description
 * # record/procedures
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('procedures', function procedures() {

        var tmpPartial = {
            "procedure": {
                "name": "Colonoscopy",
                "code": "73761001",
                "code_system_name": "SNOMED CT"
            },
            "identifiers": [{
                "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
            }],
            "status": "Completed",
            "date_time": {
                "point": {
                    "date": "2012-05-12T00:00:00Z",
                    "precision": "day"
                }
            },
            "body_sites": [{
                "name": "colon",
                "code": "appropriate_code",
                "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
            }],
            "specimen": {
                "identifiers": [{
                    "identifier": "c2ee9ee9-ae31-4628-a919-fec1cbb58683"
                }],
                "code": {
                    "name": "colonic polyp sample",
                    "code": "309226005",
                    "code_system_name": "SNOMED CT"
                }
            },
            "performer": [{
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5.9999.456",
                    "extension": "2981823"
                }],
                "address": [{
                    "street_lines": [
                        "1002 Village Avenue"
                    ],
                    "city": "Portland",
                    "state": "OR",
                    "zip": "99123",
                    "country": "US"
                }],
                "phone": [{
                    "number": "555-555-5000",
                    "type": "work place"
                }],
                "organization": [{
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.1393"
                    }],
                    "name": [
                        "Community Health and Hospitals"
                    ],
                    "address": [{
                        "street_lines": [
                            "1001 Village Avenue"
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "99123",
                        "country": "US"
                    }],
                    "phone": [{
                        "number": "555-555-5000",
                        "type": "work place"
                    }]
                }]
            }],
            "procedure_type": "procedure"
        };

        var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': "I don't recall having this done!  I should ask my doctor for more details.",
                'date': '2005-05-01T00:12:00Z',
                'starred': true
            }]
        };

        var tmpProcedure = {
            "procedure": {
                "name": "Colonoscopy",
                "code": "73761001",
                "code_system_name": "SNOMED CT"
            },
            "identifiers": [{
                "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
            }],
            "status": "Completed",
            "date_time": {
                "point": {
                    "date": "2012-05-12T00:00:00Z",
                    "precision": "day"
                }
            },
            "body_sites": [{
                "name": "colon",
                "code": "appropriate_code",
                "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
            }],
            "specimen": {
                "identifiers": [{
                    "identifier": "c2ee9ee9-ae31-4628-a919-fec1cbb58683"
                }],
                "code": {
                    "name": "colonic polyp sample",
                    "code": "309226005",
                    "code_system_name": "SNOMED CT"
                }
            },
            "performer": [{
                "identifiers": [{
                    "identifier": "2.16.840.1.113883.19.5.9999.456",
                    "extension": "2981823"
                }],
                "address": [{
                    "street_lines": [
                        "1001 Village Avenue"
                    ],
                    "city": "Portland",
                    "state": "OR",
                    "zip": "99123",
                    "country": "US"
                }],
                "phone": [{
                    "number": "555-555-5000",
                    "type": "work place"
                }],
                "organization": [{
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.1393"
                    }],
                    "name": [
                        "Community Health and Hospitals"
                    ],
                    "address": [{
                        "street_lines": [
                            "1001 Village Avenue"
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "99123",
                        "country": "US"
                    }],
                    "phone": [{
                        "number": "555-555-5000",
                        "type": "work place"
                    }]
                }]
            }],
            "procedure_type": "procedure"
        };

        this.getRecord = function (callback) {
            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpProcedure
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
                        "performer": "diff"
                    },
                    "srcMatch": {
                        'metadata': tmpMetaData,
                        'data': tmpProcedure
                    },
                    "newMatch": tmpPartial
                }];

                callback(null, tmpMatch);
        }


    });