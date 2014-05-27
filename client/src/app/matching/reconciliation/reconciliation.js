/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular.module('dre.match.reconciliation', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation', {
            templateUrl: 'templates/matching/reconciliation/reconciliation.tpl.html',
            controller: 'reconciliationCtrl'
        });
    }
])

.controller('reconciliationCtrl', ['$scope', '$http', '$location', '$rootScope',
    function($scope, $http, $location, $rootScope) {

        console.log('hit');

        $scope.navPath = "templates/nav/nav.tpl.html";

        $scope.reviewClick = function(match) {
            //alert(JSON.stringify(match));
            $location.path("match/reconciliation/review/" + match.section + "/" + match.index + "/" + match.src_id + "/" + match.dest_id);
        };

        $scope.matches = {
            "allergies": [{
                "match": "partial",
                "percent": 95,
                "subelements": [{
                    "match": "duplicate",
                    "src_id": "1",
                    "dest_id": "0"
                }, {
                    "match": "new",
                    "src_id": "0"
                }],
                "src_id": "0",
                "dest_id": "0"
            }, {
                "match": "duplicate",
                "src_id": "1",
                "dest_id": "1"
            }, {
                "match": "duplicate",
                "src_id": "2",
                "dest_id": "2"
            }, {
                "match": "duplicate",
                "src_id": "3",
                "dest_id": "3"
            }, {
                "match": "partial",
                "percent": 95,
                "subelements": [{
                    "match": "duplicate",
                    "src_id": "1",
                    "dest_id": "0"
                }, {
                    "match": "new",
                    "src_id": "0"
                }],
                "src_id": "4",
                "dest_id": "4"
            }],
            "encounters": [{
                "match": "partial",
                "percent": 95,
                "subelements": [{
                    "match": "duplicate",
                    "src_id": "1",
                    "dest_id": "0"
                }, {
                    "match": "new",
                    "src_id": "0"
                }],
                "src_id": "0",
                "dest_id": "1"
            }],
            "immunizations": [{
                "match": "duplicate",
                "src_id": "0",
                "dest_id": "1"
            }, {
                "match": "duplicate",
                "src_id": "1",
                "dest_id": "2"
            }, {
                "match": "duplicate",
                "src_id": "2",
                "dest_id": "3"
            }, {
                "match": "duplicate",
                "src_id": "3",
                "dest_id": "4"
            }],
            "results": [{
                "match": "partial",
                "percent": 95,
                "subelements": [{
                    "match": "partial",
                    "percent": 75,
                    "src_id": "0",
                    "dest_id": "0"
                }, {
                    "match": "duplicate",
                    "src_id": "1",
                    "dest_id": "1"
                }, {
                    "match": "duplicate",
                    "src_id": "2",
                    "dest_id": "2"
                }],
                "src_id": "0",
                "dest_id": "6"
            }],
            "medications": [{
                "match": "partial",
                "percent": 90,
                "src_id": "0",
                "dest_id": "2"
            }],
            "problems": [{
                "match": "partial",
                "percent": 70,
                "src_id": "0",
                "dest_id": "1"
            }, {
                "match": "duplicate",
                "src_id": "1",
                "dest_id": "2"
            }],
            "procedures": [{
                "match": "partial",
                "percent": 65,
                "src_id": "0",
                "dest_id": "1"
            }, {
                "match": "duplicate",
                "src_id": "1",
                "dest_id": "2"
            }, {
                "match": "partial",
                "percent": 75,
                "src_id": "2",
                "dest_id": "3"
            }],
            "vitals": [{
                "match": "partial",
                "percent": 75,
                "src_id": "0",
                "dest_id": "5"
            }, {
                "match": "duplicate",
                "src_id": "1",
                "dest_id": "6"
            }, {
                "match": "duplicate",
                "src_id": "2",
                "dest_id": "7"
            }, {
                "match": "partial",
                "percent": 75,
                "src_id": "3",
                "dest_id": "8"
            }, {
                "match": "partial",
                "percent": 75,
                "src_id": "4",
                "dest_id": "9"
            }, {
                "match": "duplicate",
                "src_id": "5",
                "dest_id": "10"
            }],
            "demographics": [{
                "match": "diff",
                "diff": {
                    "name": "new",
                    "dob": "duplicate",
                    "gender": "duplicate",
                    "identifiers": "duplicate",
                    "marital_status": "duplicate",
                    "addresses": "duplicate",
                    "phone": "new",
                    "race_ethnicity": "duplicate",
                    "languages": "duplicate",
                    "religion": "duplicate",
                    "birthplace": "duplicate",
                    "guardians": "duplicate"
                }
            }],
            "socialHistory": [{
                "match": "diff",
                "diff": {
                    "0": "new"
                }
            }]
        };

        //bb-04
        $scope.src = {
    "demographics": {
        "name": {
            "last": "Jones",
            "first": "Isabella"
        },
        "dob": [
            {
                "date": "1975-05-01T00:00:00.000Z",
                "precision": "day"
            }
        ],
        "gender": "Female",
        "identifiers": [
            {
                "identifier": "2.16.840.1.113883.19.5.99999.2",
                "identifier_type": "998991"
            },
            {
                "identifier": "2.16.840.1.113883.4.1",
                "identifier_type": "111-00-2330"
            }
        ],
        "marital_status": "Married",
        "addresses": [
            {
                "streetLines": [
                    "1357 Amber Drive"
                ],
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home"
            }
        ],
        "phone": [
            {
                "number": "(202)276-6909",
                "type": "primary home"
            }
        ],
        "race_ethnicity": "White",
        "languages": [
            {
                "language": "en",
                "preferred": true,
                "mode": "Expressed spoken",
                "proficiency": "Good"
            }
        ],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US"
        },
        "guardians": [
            {
                "relation": "Parent",
                "addresses": [
                    {
                        "streetLines": [
                            "1357 Amber Drive"
                        ],
                        "city": "Beaverton",
                        "state": "OR",
                        "zip": "97867",
                        "country": "US",
                        "use": "primary home"
                    }
                ],
                "names": [
                    {
                        "last": "Jones",
                        "first": "Ralph"
                    }
                ],
                "phone": [
                    {
                        "number": "(816)276-6909",
                        "type": "primary home"
                    }
                ]
            }
        ]
    },
    "vitals": [
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "1999-11-14T14:30:00.000Z",
                    "precision": "minute"
                }
            ],
            "freeTextValue": "177 cm",
            "interpretations": [
                "Normal"
            ],
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC",
            "value": 177,
            "unit": "cm"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "1999-11-14T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "86 kg",
            "interpretations": [
                "Normal"
            ],
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC",
            "value": 86,
            "unit": "kg"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "1999-11-14T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "132/86 mmHg",
            "interpretations": [
                "Normal"
            ],
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC",
            "value": 132,
            "unit": "mm[Hg]"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2000-04-07T14:30:00.000Z",
                    "precision": "minute"
                }
            ],
            "freeTextValue": "177 cm",
            "interpretations": [
                "Normal"
            ],
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC",
            "value": 177,
            "unit": "cm"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2000-04-07T14:30:00.000Z",
                    "precision": "minute"
                }
            ],
            "freeTextValue": "88 kg",
            "interpretations": [
                "Normal"
            ],
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC",
            "value": 88,
            "unit": "kg"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2000-04-07T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "145/88 mmHg",
            "interpretations": [
                "Normal"
            ],
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC",
            "value": 145,
            "unit": "mm[Hg]"
        }
    ],
    "results": [
        {
            "identifiers": [
                {
                    "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                        }
                    ],
                    "date": [
                        {
                            "date": "2000-03-23T15:00:00.000Z",
                            "precision": "minute"
                        }
                    ],
                    "freeTextValue": "HGB (M 13-18 g/dl; F 12-16 g/dl)",
                    "interpretations": [
                        "Normal"
                    ],
                    "name": "HGB",
                    "code": "30313-1",
                    "code_system_name": "LOINC",
                    "value": 13.2,
                    "unit": "g/dl"
                },
                {
                    "identifiers": [
                        {
                            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                        }
                    ],
                    "date": [
                        {
                            "date": "2000-03-23T14:30:00.000Z",
                            "precision": "minute"
                        }
                    ],
                    "freeTextValue": "WBC (4.3-10.8 10+3/ul)",
                    "interpretations": [
                        "Normal"
                    ],
                    "name": "WBC",
                    "code": "33765-9",
                    "code_system_name": "LOINC",
                    "value": 6.7,
                    "unit": "10+3/ul"
                },
                {
                    "identifiers": [
                        {
                            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                        }
                    ],
                    "date": [
                        {
                            "date": "2000-03-23T14:30:00.000Z",
                            "precision": "minute"
                        }
                    ],
                    "freeTextValue": "PLT (135-145 meq/l)",
                    "interpretations": [
                        "Low"
                    ],
                    "name": "PLT",
                    "code": "26515-7",
                    "code_system_name": "LOINC",
                    "value": 123,
                    "unit": "10+3/ul"
                }
            ],
            "name": "CBC WO DIFFERENTIAL",
            "code": "43789009",
            "code_system_name": "SNOMED CT"
        }
    ],
    "medications": [
        {
            "date": [
                {
                    "date": "2007-01-03T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2012-05-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
                }
            ],
            "status": "Completed",
            "sig": "Proventil HFA ",
            "product": {
                "identifiers": {
                    "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
                },
                "unencoded_name": "Proventil HFA ",
                "name": "Proventil HFA",
                "code": "219483",
                "code_system_name": "RXNORM",
                "translations": [
                    {
                        "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                        "code": "573621",
                        "code_system_name": "RXNORM"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "RESPIRATORY (INHALATION)",
                    "code": "C38216",
                    "code_system_name": "Medication Route FDA"
                },
                "form": {
                    "name": "INHALANT",
                    "code": "C42944",
                    "code_system_name": "Medication Route FDA"
                },
                "dose": {
                    "value": 1,
                    "unit": "mg/actuat"
                },
                "rate": {
                    "value": 90,
                    "unit": "ml/min"
                }
            }
        }
    ],
    "encounters": [
        {
            "identifiers": [
                {
                    "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
                }
            ],
            "date": [
                {
                    "date": "2009-02-27T13:00:00.000Z",
                    "precision": "subsecond"
                }
            ],
            "locations": [
                {
                    "name": "Community Urgent Care Center",
                    "loc_type": {
                        "name": "Urgent Care Center",
                        "code": "1160-1",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "findings": [
                {
                    "name": "Bronchitis",
                    "code": "32398004",
                    "code_system_name": "SNOMED CT"
                },
                {
                    "name": "Pneumonia",
                    "code": "233604007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Office outpatient visit 15 minutes",
            "code": "99213",
            "code_system_name": "CPT",
            "translations": [
                {
                    "name": "Ambulatory",
                    "code": "AMB",
                    "code_system_name": "HL7ActCode"
                }
            ]
        }
    ],
    "allergies": [
        {
            "date": [
                {
                    "date": "2007-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "severity": "Moderate to severe",
            "status": "Inactive",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Wheezing",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT"
                },
                {
                    "severity": "Mild",
                    "name": "Nausea",
                    "code": "422587007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "ALLERGENIC EXTRACT, PENICILLIN",
            "code": "314422",
            "code_system_name": "RXNORM"
        },
        {
            "date": [
                {
                    "date": "2006-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "severity": "Moderate",
            "status": "Active",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Wheezing",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Codeine",
            "code": "2670",
            "code_system_name": "RXNORM"
        },
        {
            "date": [
                {
                    "date": "1984-06-05T10:00:00.000Z",
                    "precision": "second"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "status": "Inactive",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Nausea",
                    "code": "422587007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Eggs",
            "code": "291P45F896",
            "code_system_name": "OID 2.16.840.1.113883.4.9",
            "translations": [
                {
                    "name": "Allergy to eggs",
                    "code": "V15.03",
                    "code_system_name": "OID 2.16.840.1.113883.6.2"
                }
            ]
        },
        {
            "date": [
                {
                    "date": "2008-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "severity": "Mild to moderate",
            "status": "Active",
            "reaction": [
                {
                    "severity": "Mild to moderate",
                    "name": "Hives",
                    "code": "247472004",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Aspirin",
            "code": "1191",
            "code_system_name": "RXNORM"
        },
        {
            "date": [
                {
                    "date": "2009-08-26T10:00:00.000Z",
                    "precision": "second"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "status": "Inactive",
            "reaction": [
                {
                    "severity": "Mild to moderate",
                    "name": "Hives",
                    "code": "247472004",
                    "code_system_name": "SNOMED CT"
                },
                {
                    "severity": "Mild",
                    "name": "Nausea",
                    "code": "422587007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Neomycin Sulfate 500 MG",
            "code": "866041",
            "code_system_name": "RXNORM"
        }
    ],
    "immunizations": [
        {
            "date": [
                {
                    "date": "1999-11-01T00:00:00.000Z",
                    "precision": "month"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "complete",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Influenza virus vaccine",
                "code": "88",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Influenza, seasonal, injectable",
                        "code": "141",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "refused",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Influenza virus vaccine",
                "code": "88",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Influenza, seasonal, injectable",
                        "code": "141",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "complete",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Pneumococcal polysaccharide vaccine",
                "code": "33",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Pneumococcal NOS",
                        "code": "109",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "refused",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Tetanus and diphtheria toxoids - preservative free",
                "code": "103",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Tetanus and diphtheria toxoids - preservative free",
                        "code": "09",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            },
            "refusal_reason": "Patient objection"
        }
    ],
    "socialHistory": [
        {
            "value": "Current every day smoker",
            "dateRange": [
                {
                    "date": "2005-05-01T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2009-02-27T13:00:00.000Z",
                    "precision": "subsecond"
                }
            ]
        }
    ],
    "problems": [
        {
            "date": [
                {
                    "date": "2008-01-03T12:12:00.000Z",
                    "precision": "minute"
                },
                {
                    "date": "2008-01-03T12:12:00.000Z",
                    "precision": "minute"
                }
            ],
            "identifiers": [
                {
                    "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
                }
            ],
            "negation_indicator": false,
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": "Resolved",
            "patient_status": "Alive and well",
            "source_list_identifiers": [
                {
                    "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
                }
            ],
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        },
        {
            "date": [
                {
                    "date": "2007-01-03T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2008-01-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
                }
            ],
            "negation_indicator": false,
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": "Active",
            "patient_status": "Alive and well",
            "source_list_identifiers": [
                {
                    "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
                }
            ],
            "name": "Asthma",
            "code": "195967001",
            "code_system_name": "SNOMED CT"
        }
    ],
    "procedures": [
        {
            "identifiers": [
                {
                    "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
                }
            ],
            "status": "Completed",
            "date": [
                {
                    "date": "2012-05-12T14:30:00.000Z",
                    "precision": "minute"
                }
            ],
            "bodysite": [
                {
                    "name": "colon",
                    "code": "appropriate_code",
                    "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "1001 Village Avenue"
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "99123",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "555-555-5000",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals",
                        "address": {
                            "streetLines": [
                                "1001 Village Avenue"
                            ],
                            "city": "Portland",
                            "state": "OR",
                            "zip": "99123",
                            "country": "US"
                        },
                        "telecom": {
                            "value": "555-555-5000",
                            "use": "work place"
                        }
                    }
                }
            ],
            "proc_type": "procedure",
            "name": "Colonoscopy",
            "code": "73761001",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "2.16.840.1.113883.19",
                    "identifier_type": "123456789"
                }
            ],
            "status": "Aborted",
            "date": [
                {
                    "date": "2011-02-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "bodysite": [
                {
                    "name": "Abdomen and pelvis",
                    "code": "416949008",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "(555)555-555-1234",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals"
                    }
                }
            ],
            "locations": [
                {
                    "name": "Community Gastroenterology Clinic",
                    "loc_type": {
                        "name": "Gastroenterology Clinic",
                        "code": "1118-9",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "proc_type": "observation",
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.2.3.4.5.6.7.8",
                    "identifier_type": "1234567"
                }
            ],
            "status": "Completed",
            "date": [
                {
                    "date": "2011-02-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "locations": [
                {
                    "name": "Community Gastroenterology Clinic",
                    "loc_type": {
                        "name": "Gastroenterology Clinic",
                        "code": "1118-9",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "proc_type": "act",
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        }
    ]
};
        //bb-03
        $scope.dest ={
    "demographics": {
        "name": {
            "middle": [
                "Isa"
            ],
            "last": "Jones",
            "first": "Isabella"
        },
        "dob": [
            {
                "date": "1975-05-01T00:00:00.000Z",
                "precision": "day"
            }
        ],
        "gender": "Female",
        "identifiers": [
            {
                "identifier": "2.16.840.1.113883.19.5.99999.2",
                "identifier_type": "998991"
            },
            {
                "identifier": "2.16.840.1.113883.4.1",
                "identifier_type": "111-00-2330"
            }
        ],
        "marital_status": "Married",
        "addresses": [
            {
                "streetLines": [
                    "1357 Amber Drive"
                ],
                "city": "Beaverton",
                "state": "OR",
                "zip": "97867",
                "country": "US",
                "use": "primary home"
            }
        ],
        "phone": [
            {
                "number": "(816)276-6909",
                "type": "primary home"
            }
        ],
        "race_ethnicity": "White",
        "languages": [
            {
                "language": "en",
                "preferred": true,
                "mode": "Expressed spoken",
                "proficiency": "Good"
            }
        ],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US"
        },
        "guardians": [
            {
                "relation": "Parent",
                "addresses": [
                    {
                        "streetLines": [
                            "1357 Amber Drive"
                        ],
                        "city": "Beaverton",
                        "state": "OR",
                        "zip": "97867",
                        "country": "US",
                        "use": "primary home"
                    }
                ],
                "names": [
                    {
                        "last": "Jones",
                        "first": "Ralph"
                    }
                ],
                "phone": [
                    {
                        "number": "(816)276-6909",
                        "type": "primary home"
                    }
                ]
            }
        ]
    },
    "vitals": [
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "6660219000296"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "6660219000356"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC",
            "value": 64,
            "unit": "[in_us]"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "1166602190002918"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "1166602190003518"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "name": "Weight",
            "code": "3141-9",
            "code_system_name": "LOINC",
            "value": 160,
            "unit": "[lb_av]"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "11666021900029181"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "11666021900035181"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "name": "BP Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC",
            "value": 120,
            "unit": "mm[Hg]"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "1166602190002928"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "1166602190003528"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "name": "BP Diastolic",
            "code": "8462-4",
            "code_system_name": "LOINC",
            "value": 78,
            "unit": "mm[Hg]"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "1166602190002939"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.6",
                    "identifier_type": "1166602190003539"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "name": "Body Mass Index Calculated",
            "code": "39156-5",
            "code_system_name": "LOINC",
            "value": 27.5,
            "unit": "1"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "1999-11-14T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "177 cm",
            "interpretations": [
                "Normal"
            ],
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC",
            "value": 177,
            "unit": "cm"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "1999-11-14T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "86 kg",
            "interpretations": [
                "Normal"
            ],
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC",
            "value": 86,
            "unit": "kg"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "1999-11-14T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "132/86 mmHg",
            "interpretations": [
                "Normal"
            ],
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC",
            "value": 132,
            "unit": "mm[Hg]"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2000-04-07T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "177 cm",
            "interpretations": [
                "Normal"
            ],
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC",
            "value": 177,
            "unit": "cm"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2000-04-07T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "88 kg",
            "interpretations": [
                "Normal"
            ],
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC",
            "value": 88,
            "unit": "kg"
        },
        {
            "identifiers": [
                {
                    "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                }
            ],
            "status": "completed",
            "date": [
                {
                    "date": "2000-04-07T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "freeTextValue": "145/88 mmHg",
            "interpretations": [
                "Normal"
            ],
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC",
            "value": 145,
            "unit": "mm[Hg]"
        }
    ],
    "results": [
        {
            "identifiers": [
                {
                    "identifier": "ce19d2be-3d3b-44ea-95f1-5a0a04586377"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "1331eea1-3efe-497e-96bc-de56796a253d"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "freeTextValue": "HGB (M 13-18 g/dl; F 12-16 g/dl)",
                    "interpretations": [
                        "abnormal",
                        "high alert"
                    ],
                    "name": "Thyrotropin [Units/volume] in Serum or Plasma",
                    "code": "3016-3",
                    "code_system_name": "LOINC",
                    "value": 6,
                    "unit": "m[IU]/L"
                }
            ],
            "name": "Thyrotropin [Units/volume] in Serum or Plasma by Detection limit less than or equal to 0.05 mIU/L",
            "code": "11579-0",
            "code_system_name": "LOINC"
        },
        {
            "identifiers": [
                {
                    "identifier": "ce19d2be-3d3b-44ea-95f1-5a0a04586377"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "dc16a671-c8f7-4125-a3f6-c8787606f576"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "freeTextValue": "WBC (4.3-10.8 10+3/ul)",
                    "interpretations": [
                        "abnormal",
                        "high alert"
                    ],
                    "name": "Hemoglobin A1c/Hemoglobin.total in Blood",
                    "code": "4548-4",
                    "code_system_name": "LOINC",
                    "value": 8,
                    "unit": "%"
                }
            ],
            "name": "Hemoglobin A1c/Hemoglobin.total in Blood",
            "code": "4548-4",
            "code_system_name": "LOINC"
        },
        {
            "identifiers": [
                {
                    "identifier": "ce19d2be-3d3b-44ea-95f1-5a0a04586377"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "9cd43fa7-db31-4c29-ab30-83f92fdcaa20"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "freeTextValue": "PLT (135-145 meq/l)",
                    "interpretations": [
                        "abnormal"
                    ],
                    "name": "Creatinine [Mass/volume] in Serum or Plasma",
                    "code": "2160-0",
                    "code_system_name": "LOINC",
                    "value": 1.5,
                    "unit": "mg/dL"
                }
            ],
            "name": "Creatinine [Mass/volume] in Serum or Plasma",
            "code": "2160-0",
            "code_system_name": "LOINC"
        },
        {
            "identifiers": [
                {
                    "identifier": "ce19d2be-3d3b-44ea-95f1-5a0a04586377"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "78df60b1-daf7-4838-b509-ec3a3f4116c1"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "interpretations": [
                        "abnormal",
                        "high alert"
                    ],
                    "name": "INR in Platelet poor plasma by Coagulation assay",
                    "code": "6301-6",
                    "code_system_name": "LOINC",
                    "value": 1.5,
                    "unit": "1"
                }
            ],
            "name": "INR in Platelet poor plasma by Coagulation assay",
            "code": "6301-6",
            "code_system_name": "LOINC"
        },
        {
            "identifiers": [
                {
                    "identifier": "ce19d2be-3d3b-44ea-95f1-5a0a04586377"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "aaa00f9e-0154-4eaa-be85-aeb34169f06a"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "interpretations": [
                        "normal"
                    ],
                    "name": "Aortic valve Ejection [Time] by US.doppler",
                    "code": "18041-4",
                    "code_system_name": "LOINC",
                    "value": 55,
                    "unit": "%"
                },
                {
                    "identifiers": [
                        {
                            "identifier": "347f958c-9b6b-4eeb-848d-624567117cb7"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "interpretations": [
                        "abnormal"
                    ],
                    "name": "AV Orifice Area US",
                    "code": "18089-3",
                    "code_system_name": "LOINC",
                    "value": 1.5,
                    "unit": "cm2"
                }
            ],
            "name": "2D echocardiogram panel",
            "code": "34552-0",
            "code_system_name": "LOINC"
        },
        {
            "identifiers": [
                {
                    "identifier": "ce19d2be-3d3b-44ea-95f1-5a0a04586377"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "ba4f85fa-586c-4898-9aad-b592d4c2c383"
                        }
                    ],
                    "date": [
                        {
                            "date": "2012-11-26T00:00:00.000Z",
                            "precision": "day"
                        }
                    ],
                    "name": "EKG impression Narrative",
                    "code": "18844-1",
                    "code_system_name": "LOINC"
                }
            ],
            "name": "EKG 12 channel panel",
            "code": "34534-8",
            "code_system_name": "LOINC"
        },
        {
            "identifiers": [
                {
                    "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                }
            ],
            "results": [
                {
                    "identifiers": [
                        {
                            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                        }
                    ],
                    "date": [
                        {
                            "date": "2000-03-23T14:30:00.000Z",
                            "precision": "minute"
                        }
                    ],
                    "freeTextValue": "HGB (M 13-18 g/dl; F 12-16 g/dl)",
                    "interpretations": [
                        "Normal"
                    ],
                    "name": "HGB",
                    "code": "30313-1",
                    "code_system_name": "LOINC",
                    "value": 13.2,
                    "unit": "g/dl"
                },
                {
                    "identifiers": [
                        {
                            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                        }
                    ],
                    "date": [
                        {
                            "date": "2000-03-23T14:30:00.000Z",
                            "precision": "minute"
                        }
                    ],
                    "freeTextValue": "WBC (4.3-10.8 10+3/ul)",
                    "interpretations": [
                        "Normal"
                    ],
                    "name": "WBC",
                    "code": "33765-9",
                    "code_system_name": "LOINC",
                    "value": 6.7,
                    "unit": "10+3/ul"
                },
                {
                    "identifiers": [
                        {
                            "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                        }
                    ],
                    "date": [
                        {
                            "date": "2000-03-23T14:30:00.000Z",
                            "precision": "minute"
                        }
                    ],
                    "freeTextValue": "PLT (135-145 meq/l)",
                    "interpretations": [
                        "Low"
                    ],
                    "name": "PLT",
                    "code": "26515-7",
                    "code_system_name": "LOINC",
                    "value": 123,
                    "unit": "10+3/ul"
                }
            ],
            "name": "CBC WO DIFFERENTIAL",
            "code": "43789009",
            "code_system_name": "SNOMED CT"
        }
    ],
    "medications": [
        {
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.9",
                    "identifier_type": "6591225000051"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.9",
                    "identifier_type": "6591225000071"
                }
            ],
            "status": "Prescribed",
            "product": {
                "name": "Cefepime 20 MG/ML",
                "code": "329646",
                "code_system_name": "RXNORM"
            },
            "administration": {
                "form": {
                    "name": "SOLUTION",
                    "code": "C42986",
                    "code_system_name": "Medication Route FDA"
                }
            }
        },
        {
            "date": [
                {
                    "date": "2012-09-20T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.9",
                    "identifier_type": "659122500005"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.9",
                    "identifier_type": "659122500007"
                }
            ],
            "status": "Prescribed",
            "product": {
                "name": "Cephalexin 500 MG Oral Tablet",
                "code": "309114",
                "code_system_name": "RXNORM"
            },
            "administration": {
                "form": {
                    "name": "TABLET",
                    "code": "C42998",
                    "code_system_name": "Medication Route FDA"
                },
                "dose": {
                    "value": 1
                }
            }
        },
        {
            "date": [
                {
                    "date": "2007-01-03T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2012-05-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
                }
            ],
            "status": "Completed",
            "sig": "Proventil HFA ",
            "product": {
                "identifiers": {
                    "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
                },
                "unencoded_name": "Proventil HFA ",
                "name": "Proventil HFA",
                "code": "219483",
                "code_system_name": "RXNORM",
                "translations": [
                    {
                        "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                        "code": "573621",
                        "code_system_name": "RXNORM"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "RESPIRATORY (INHALATION)",
                    "code": "C38216",
                    "code_system_name": "Medication Route FDA"
                },
                "form": {
                    "name": "INHALANT",
                    "code": "C42944",
                    "code_system_name": "Medication Route FDA"
                },
                "dose": {
                    "value": 1,
                    "unit": "mg/actuat"
                },
                "rate": {
                    "value": 90,
                    "unit": "ml/min"
                }
            },
            "precondition": {
                "code": {
                    "code": "ASSERTION",
                    "code_system_name": "HL7ActCode"
                },
                "value": {
                    "name": "Wheezing",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT"
                }
            }
        }
    ],
    "encounters": [
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.3.4",
                    "identifier_type": "5283815"
                }
            ],
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2012-10-05T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "locations": [
                {
                    "name": "Local Community Hospital",
                    "loc_type": {
                        "name": "Inpatient Medical/Surgical Ward",
                        "code": "1061-1",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "1000 Hospital Way"
                            ],
                            "city": "Portland",
                            "state": "OR",
                            "zip": "97005",
                            "country": "US"
                        }
                    ]
                }
            ],
            "name": "UNK",
            "code": "99231",
            "code_system_name": "CPT"
        },
        {
            "identifiers": [
                {
                    "identifier": "2a620155-9d11-439e-92b3-5d9815ff4de8"
                }
            ],
            "date": [
                {
                    "date": "2009-02-27T13:00:00.000Z",
                    "precision": "subsecond"
                }
            ],
            "locations": [
                {
                    "name": "Community Urgent Care Center",
                    "loc_type": {
                        "name": "Urgent Care Center",
                        "code": "1160-1",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "findings": [
                {
                    "name": "Pneumonia",
                    "code": "233604007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Office outpatient visit 15 minutes",
            "code": "99213",
            "code_system_name": "CPT",
            "translations": [
                {
                    "name": "Ambulatory",
                    "code": "AMB",
                    "code_system_name": "HL7ActCode"
                }
            ]
        }
    ],
    "allergies": [
        {
            "date": [
                {
                    "date": "2007-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "severity": "Moderate to severe",
            "status": "Inactive",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Nausea",
                    "code": "422587007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "ALLERGENIC EXTRACT, PENICILLIN",
            "code": "314422",
            "code_system_name": "RXNORM"
        },
        {
            "date": [
                {
                    "date": "2006-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "severity": "Moderate",
            "status": "Active",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Wheezing",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Codeine",
            "code": "2670",
            "code_system_name": "RXNORM"
        },
        {
            "date": [
                {
                    "date": "1984-06-05T10:00:00.000Z",
                    "precision": "second"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "status": "Inactive",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Nausea",
                    "code": "422587007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Eggs",
            "code": "291P45F896",
            "code_system_name": "OID 2.16.840.1.113883.4.9",
            "translations": [
                {
                    "name": "Allergy to eggs",
                    "code": "V15.03",
                    "code_system_name": "OID 2.16.840.1.113883.6.2"
                }
            ]
        },
        {
            "date": [
                {
                    "date": "2008-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "severity": "Mild to moderate",
            "status": "Active",
            "reaction": [
                {
                    "severity": "Mild to moderate",
                    "name": "Hives",
                    "code": "247472004",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Aspirin",
            "code": "1191",
            "code_system_name": "RXNORM"
        },
        {
            "date": [
                {
                    "date": "2009-08-26T10:00:00.000Z",
                    "precision": "second"
                }
            ],
            "identifiers": [
                {
                    "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
                }
            ],
            "status": "Inactive",
            "reaction": [
                {
                    "severity": "Mild",
                    "name": "Nausea",
                    "code": "422587007",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "name": "Neomycin Sulfate 500 MG",
            "code": "866041",
            "code_system_name": "RXNORM"
        }
    ],
    "immunizations": [
        {
            "date": [
                {
                    "date": "2012-08-06T15:35:00.000Z",
                    "precision": "subsecond"
                }
            ],
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.4.111.0.4.4",
                    "identifier_type": "1049280"
                }
            ],
            "status": "complete",
            "product": {
                "lot_number": "MK456987",
                "manufacturer": "Merck and Co., Inc.",
                "name": "Pneumococcal (2 years and up)",
                "code": "33",
                "code_system_name": "CVX"
            },
            "administration": {
                "route": {
                    "name": "INTRAMUSCULAR",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 0.5,
                    "unit": "ml"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.4.6",
                        "identifier_type": "1569874562"
                    }
                ],
                "name": [
                    {
                        "last": "Seven",
                        "first": "Henry"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1002 Healthcare Dr."
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "97005",
                        "country": "US"
                    }
                ],
                "email": [
                    {
                        "address": "tel:+1-(555)555-1002"
                    }
                ],
                "phone": [
                    {
                        "number": "+1-(555)555-1002"
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1999-11-01T00:00:00.000Z",
                    "precision": "month"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "complete",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Influenza virus vaccine",
                "code": "88",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Influenza, seasonal, injectable",
                        "code": "141",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "refused",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Influenza virus vaccine",
                "code": "88",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Influenza, seasonal, injectable",
                        "code": "141",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "complete",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Pneumococcal polysaccharide vaccine",
                "code": "33",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Pneumococcal NOS",
                        "code": "109",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            }
        },
        {
            "date": [
                {
                    "date": "1998-12-15T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "e6f1ba43-c0ed-4b9b-9f12-f435d8ad8f92"
                }
            ],
            "status": "refused",
            "product": {
                "lot_number": "1",
                "manufacturer": "Health LS - Immuno Inc.",
                "name": "Tetanus and diphtheria toxoids - preservative free",
                "code": "103",
                "code_system_name": "CVX",
                "translations": [
                    {
                        "name": "Tetanus and diphtheria toxoids - preservative free",
                        "code": "09",
                        "code_system_name": "CVX"
                    }
                ]
            },
            "administration": {
                "route": {
                    "name": "Intramuscular injection",
                    "code": "C28161",
                    "code_system_name": "Medication Route FDA"
                },
                "quantity": {
                    "value": 50,
                    "unit": "mcg"
                }
            },
            "performer": {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.456",
                        "identifier_type": "2981824"
                    }
                ],
                "name": [
                    {
                        "last": "Assigned",
                        "first": "Amanda"
                    }
                ],
                "address": [
                    {
                        "streetLines": [
                            "1021 Health Drive"
                        ],
                        "city": "Ann Arbor",
                        "state": "MI",
                        "zip": "99099",
                        "country": "US"
                    }
                ],
                "organization": [
                    {
                        "identifiers": [
                            {
                                "identifier": "2.16.840.1.113883.19.5.9999.1394"
                            }
                        ],
                        "name": [
                            "Good Health Clinic"
                        ]
                    }
                ]
            },
            "refusal_reason": "Patient objection"
        }
    ],
    "socialHistory": [
        {
            "value": "Former smoker",
            "dateRange": [
                {
                    "date": "2005-05-01T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2009-02-27T13:00:00.000Z",
                    "precision": "subsecond"
                }
            ]
        }
    ],
    "problems": [
        {
            "date": [
                {
                    "date": "2012-09-20T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1.2.1",
                    "identifier_type": "615028800003"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1.2.1",
                    "identifier_type": "659935200001"
                }
            ],
            "negation_indicator": false,
            "status": "Active",
            "source_list_identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1",
                    "identifier_type": "615028800003"
                },
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.1",
                    "identifier_type": "659935200001"
                }
            ],
            "name": "Sinusitis",
            "code": "36971009",
            "code_system_name": "SNOMED CT"
        },
        {
            "date": [
                {
                    "date": "2008-01-03T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2008-01-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
                }
            ],
            "negation_indicator": false,
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": "Resolved",
            "patient_status": "Alive and well",
            "source_list_identifiers": [
                {
                    "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
                }
            ],
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        },
        {
            "date": [
                {
                    "date": "2007-01-03T00:00:00.000Z",
                    "precision": "day"
                },
                {
                    "date": "2008-01-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "identifiers": [
                {
                    "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
                }
            ],
            "negation_indicator": false,
            "onset_age": "57",
            "onset_age_unit": "Year",
            "status": "Active",
            "patient_status": "Alive and well",
            "source_list_identifiers": [
                {
                    "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
                }
            ],
            "name": "Asthma",
            "code": "195967001",
            "code_system_name": "SNOMED CT"
        }
    ],
    "procedures": [
        {
            "identifiers": [
                {
                    "identifier": "1.3.6.1.4.1.22812.3.99930.3.4.7",
                    "identifier_type": "11144556"
                }
            ],
            "status": "Active",
            "date": [
                {
                    "date": "2012-10-02T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "bodysite": [
                {
                    "name": "Lower Respiratory Tract Structure",
                    "code": "82094008",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "1002 Healthcare Dr."
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "97005",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "tel:+1-(555)555-1122"
                    }
                }
            ],
            "proc_type": "observation",
            "name": "Sinus CT",
            "code": "241526005",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
                }
            ],
            "status": "Completed",
            "date": [
                {
                    "date": "2012-05-12T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "bodysite": [
                {
                    "name": "colon",
                    "code": "appropriate_code",
                    "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "1001 Village Avenue"
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "99123",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "555-555-5000",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals",
                        "address": {
                            "streetLines": [
                                "1001 Village Avenue"
                            ],
                            "city": "Portland",
                            "state": "OR",
                            "zip": "99123",
                            "country": "US"
                        },
                        "telecom": {
                            "value": "555-555-5000",
                            "use": "work place"
                        }
                    }
                }
            ],
            "proc_type": "procedure",
            "name": "Colonoscopy",
            "code": "73761001",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "2.16.840.1.113883.19",
                    "identifier_type": "123456789"
                }
            ],
            "status": "Aborted",
            "date": [
                {
                    "date": "2011-02-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "bodysite": [
                {
                    "name": "Abdomen and pelvis",
                    "code": "416949008",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "(555)555-555-1234",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals"
                    }
                }
            ],
            "locations": [
                {
                    "name": "Community Gastroenterology Clinic",
                    "loc_type": {
                        "name": "Gastroenterology Clinic",
                        "code": "1118-9",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "proc_type": "observation",
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.2.3.4.5.6.7.8",
                    "identifier_type": "1234567"
                }
            ],
            "status": "Completed",
            "date": [
                {
                    "date": "2011-02-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "(555)555-555-1234",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals"
                    }
                }
            ],
            "locations": [
                {
                    "name": "Community Gastroenterology Clinic",
                    "loc_type": {
                        "name": "Gastroenterology Clinic",
                        "code": "1118-9",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "proc_type": "act",
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        }
    ]
};

        var lookup = [
            'allergies',
            'encounters',
            'immunizations',
            'results',
            'medications',
            'problems',
            'procedures',
            'vitals',
            'demographics',
            'socialHistory',
        ];


        $scope.partial_matches = [];
        var partial_match = _.matches({
            match: "partial"
        });

        var tag = function(name) {
            var section = name;

            function addSection(el, index) {
                el["section"] = name;
                el["index"] = index;
                return el;
            }
            return addSection;
        };

        var partials;

        for (var section in lookup) {
            $scope.partial_matches = $scope.partial_matches.concat(
                _.each(
                    _.filter($scope.matches[lookup[section]], partial_match),
                    tag(lookup[section])
                )
            );

        }

        console.log($scope.partial_matches);


        $rootScope.matches = $scope.matches;
        $rootScope.src = $scope.src;
        $rootScope.dest = $scope.dest;
        $rootScope.lookup = $scope.lookup;
        $rootScope.partial_matches = $scope.partial_matches;

    }
]);
