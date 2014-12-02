'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/allergies
 * @description
 * # record/allergies
 * Service in the phrPrototypeApp.
 */
 angular.module('phrPrototypeApp')
 .service('allergies', function allergies() {

    var getPartialRecord = function (callback) {

        var tmpAllergies = [{
            "identifiers": [{
                "identifier": "36e3e930-7b14-11db-9fe1-0800200c9a66"
            }],
            "date_time": {
                "point": {
                    "date": "2007-05-10T00:00:00Z",
                    "precision": "day"
                }
            },
            "observation": {
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "ALLERGENIC EXTRACT, PENICILLIN",
                    "code": "314422",
                    "code_system_name": "RXNORM"
                },
                "intolerance": {
                    "name": "Propensity to adverse reactions to drug",
                    "code": "419511003",
                    "code_system_name": "SNOMED CT"
                },
                "date_time": {
                    "low": {
                        "date": "2007-05-01T00:00:00Z",
                        "precision": "day"
                    }
                },
                "status": {
                    "name": "Active",
                    "code": "73425007",
                    "code_system_name": "SNOMED CT"
                },
                "reactions": [{
                    "date_time": {
                        "low": {
                            "date": "2007-05-01T00:00:00Z",
                            "precision": "day"
                        },
                        "high": {
                            "date": "2009-02-27T13:00:00Z",
                            "precision": "second"
                        }
                    },
                    "reaction": {
                        "name": "Nausea",
                        "code": "422587007",
                        "code_system_name": "SNOMED CT"
                    },
                    "severity": {
                        "code": {
                            "name": "Mild",
                            "code": "255604002",
                            "code_system_name": "SNOMED CT"
                        },
                        "interpretation": {
                            "name": "Suceptible",
                            "code": "S",
                            "code_system_name": "Observation Interpretation"
                        }
                    }
                }],
                "severity": {
                    "code": {
                        "name": "Moderate to severe",
                        "code": "371924009",
                        "code_system_name": "SNOMED CT"
                    },
                    "interpretation": {
                        "name": "Normal",
                        "code": "N",
                        "code_system_name": "Observation Interpretation"
                    }
                }
            }
        }];

        callback(null, tmpAllergies);

    }

    this.getPartialRecord = getPartialRecord;

    var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': 'I should make sure I let my aunt know about this!',
                'date': '2007-05-01T00:00:00Z',
                'starred': false
            }]
        };

    var getRecordMeta = function(callback) {
        callback(null, tmpMetaData);
    }

    this.getRecordMeta = getRecordMeta;

    var getRecord = function (callback) {

        var tmpAllergy = {
            "identifiers": [{
                "identifier": "36e3e930-7b14-11db-9fe1-0800200c9a66"
            }],
            "date_time": {
                "point": {
                    "date": "2007-05-01T00:00:00Z",
                    "precision": "day"
                }
            },
            "observation": {
                "identifiers": [{
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }],
                "allergen": {
                    "name": "ALLERGENIC EXTRACT, PENICILLIN",
                    "code": "314422",
                    "code_system_name": "RXNORM"
                },
                "intolerance": {
                    "name": "Propensity to adverse reactions to drug",
                    "code": "419511003",
                    "code_system_name": "SNOMED CT"
                },
                "date_time": {
                    "low": {
                        "date": "2007-05-01T00:00:00Z",
                        "precision": "day"
                    }
                },
                "status": {
                    "name": "Active",
                    "code": "73425007",
                    "code_system_name": "SNOMED CT"
                },
                "severity": {
                    "code": {
                        "name": "Moderate to severe",
                        "code": "371924009",
                        "code_system_name": "SNOMED CT"
                    },
                    "interpretation": {
                        "name": "Normal",
                        "code": "N",
                        "code_system_name": "Observation Interpretation"
                    }
                }
            }
        };



        var tmpAllergies = [{
            'metadata': tmpMetaData,
            'data': tmpAllergy
        }];

        callback(null, tmpAllergies);

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
                        "date_time": "diff",
                        "observation": {
                            "reactions": "new"
                        }
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