'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/immunizations
 * @description
 * # record/immunizations
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('immunizations', function immunizations() {

        this.getRecord = function (callback) {

            var tmpImmunizations = [{
                "date_time": {
                    "point": {
                        "date": "1999-11-01T00:00:00Z",
                        "precision": "month"
                    }
                },
                "identifiers": [{
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }],
                "status": "complete",
                "product": {
                    "product": {
                        "name": "Influenza virus vaccine",
                        "code": "88",
                        "code_system_name": "CVX",
                        "translations": [{
                            "name": "Influenza, seasonal, injectable",
                            "code": "141",
                            "code_system_name": "CVX"
                        }]
                    },
                    "lot_number": "1",
                    "manufacturer": "Health LS - Immuno Inc."
                },
                "administration": {
                    "route": {
                        "name": "Intramuscular injection",
                        "code": "C28161",
                        "code_system_name": "Medication Route FDA"
                    },
                    "dose": {
                        "value": 50,
                        "unit": "mcg"
                    }
                },
                "performer": {
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "extension": "2981824"
                    }],
                    "name": [{
                        "last": "Assigned",
                        "first": "Amanda"
                    }],
                    "address": [{
                        "street_lines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }],
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1394"
                        }],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }]
                },
                "instructions": {
                    "code": {
                        "name": "immunization education",
                        "code": "171044003",
                        "code_system_name": "SNOMED CT"
                    },
                    "free_text": "Possible flu-like symptoms for three days."
                }
            }];

            callback(null, tmpImmunizations);

        }

    });