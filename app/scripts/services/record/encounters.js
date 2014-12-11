'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/encounters
 * @description
 * # record/encounters
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('encounters', function encounters() {

        var tmpPartial = {
            "encounter": {
                "name": "Office outpatient visit 15 minutes",
                "code": "99213",
                "code_system_name": "CPT",
                "translations": [{
                    "name": "Ambulatory",
                    "code": "AMB",
                    "code_system_name": "HL7ActCode"
                }]
            },
            "identifiers": [{
                "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
            }],
            "date_time": {
                "point": {
                    "date": "2009-02-27T13:00:00Z",
                    "precision": "second"
                }
            },
            "performers": [{
                "identifiers": [{
                    "identifier": "PseduoMD-3"
                }],
                "code": [{
                    "name": "General Physician",
                    "code": "59058001",
                    "code_system_name": "SNOMED CT"
                }]
            }],
            "locations": [{
                "name": "Community Urgent Care Center",
                "location_type": {
                    "name": "Urgent Care Center",
                    "code": "1160-1",
                    "code_system_name": "HealthcareServiceLocation"
                },
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US"
                }]
            }],
            "findings": [
            // {
            //     "identifiers": [{
            //         "identifier": "db734647-fc99-424c-a864-7e3cda82e703",
            //         "extension": "45665"
            //     }],
            //     "value": {
            //         "name": "Pneumonia",
            //         "code": "233604007",
            //         "code_system_name": "SNOMED CT"
            //     },
            //     "date_time": {
            //         "low": {
            //             "date": "2007-01-03T00:00:00Z",
            //             "precision": "day"
            //         }
            //     }
            // }, 
            {
                "identifiers": [{
                    "identifier": "db734647-fc99-424c-a864-7e3cda82e703",
                    "extension": "45665"
                }],
                "value": {
                    "name": "Diarrea",
                    "code": "12345",
                    "code_system_name": "SNOMED CT"
                },
                "date_time": {
                    "low": {
                        "date": "2007-01-03T00:00:00Z",
                        "precision": "day"
                    }
                }
            }]
        };

        var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': "It's not in the entry, but this was with Dr. James Henderson",
                'date': '2009-03-04T00:12:00Z',
                'starred': false
            }, {
                'comment': 'Remember to schedule my follow up appointment.',
                'date': '2009-03-04T00:08:00Z',
                'starred': true
            }]
        };

        var tmpEncounter = {
            "encounter": {
                "name": "Office outpatient visit 15 minutes",
                "code": "99213",
                "code_system_name": "CPT",
                "translations": [{
                    "name": "Ambulatory",
                    "code": "AMB",
                    "code_system_name": "HL7ActCode"
                }]
            },
            "identifiers": [{
                "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
            }],
            "date_time": {
                "point": {
                    "date": "2009-02-27T13:00:00Z",
                    "precision": "second"
                }
            },
            "performers": [{
                "identifiers": [{
                    "identifier": "PseduoMD-3"
                }],
                "code": [{
                    "name": "General Physician",
                    "code": "59058001",
                    "code_system_name": "SNOMED CT"
                }]
            }],
            "locations": [{
                "name": "Community Urgent Care Center",
                "location_type": {
                    "name": "Urgent Care Center",
                    "code": "1160-1",
                    "code_system_name": "HealthcareServiceLocation"
                },
                "address": [{
                    "street_lines": [
                        "17 Daws Rd."
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US"
                }]
            }]
            // "findings": [{
            //     "identifiers": [{
            //         "identifier": "db734647-fc99-424c-a864-7e3cda82e703",
            //         "extension": "45665"
            //     }],
            //     "value": {
            //         "name": "Pneumonia",
            //         "code": "233604007",
            //         "code_system_name": "SNOMED CT"
            //     },
            //     "date_time": {
            //         "low": {
            //             "date": "2007-01-03T00:00:00Z",
            //             "precision": "day"
            //         }
            //     }
            // }]
        };

        this.getRecord = function (callback) {

            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpEncounter
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

        var saveEntry = function(entry, callback) {
            console.log(entry);
            callback(null);
        }

        this.saveEntry = saveEntry;
        
        this.getPartialMatch = function (callback) {
                var tmpMatch = [{
                    "match": "partial",
                    "percent": 75,
                    "subelements": {
                        "observation": {
                            "reactions": [{
                                "match": "new",
                                "percent": 0,
                                "src_id": "0",
                                "dest_id": "0",
                                "dest": "dest"
                            }]
                        }
                    },
                    "diff": {
                        "findings":  "new"
                    },
                    "srcMatch": {
                        'metadata': tmpMetaData,
                        'data': tmpEncounter
                    },
                    "newMatch": tmpPartial
                }];

                callback(null, tmpMatch);
        }
});
