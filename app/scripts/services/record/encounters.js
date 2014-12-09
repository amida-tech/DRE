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


        var getPartialRecord = function (callback) {
            var tmpEncounters = [{
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
                {
                    "identifiers": [
                        {
                            "identifier": "db734647-fc99-424c-a864-7e3cda82e703",
                            "extension": "45665"
                        }
                    ],
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
            }];

            callback(null, tmpEncounters);

        }

        this.getPartialRecord = getPartialRecord;

        var getRecord = function (callback) {

            var tmpEncounters = [{
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
            }];

            callback(null, tmpEncounters);

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
                    "subelements": {
                        "findings": [{
                            "match": "new",
                            "percent": 0,
                            "src_id": "1",
                            "dest_id": "0",
                            "dest": "dest"
                        }]
                    },
                    "diff": {
                        "findings": "new"
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



