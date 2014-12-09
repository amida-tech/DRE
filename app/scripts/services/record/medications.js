'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record/medications
 * @description
 * # record/medications
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('medications', function medications() {

<<<<<<< HEAD
    var getPartialRecord = function(callback) {
 		
 		var tmpMedications = [    {
 			"date_time": {
 				"low": {
 					"date": "2006-12-31T00:00:00Z",
 					"precision": "day"
 				},
 				"high": {
 					"date": "2012-04-30T00:00:00Z",
 					"precision": "day"
 				}
 			},
 			"identifiers": [
 			{
 				"identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
 			}
 			],
 			"status": "Completed",
 			"sig": "Proventil HFA",
 			"product": {
 				"identifiers": [
 				{
 					"identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
 				}
 				],
 				"unencoded_name": "Proventil HFA",
 				"product": {
 					"name": "Proventil HFA",
 					"code": "219483",
 					"translations": [
 					{
 						"name": "Proventil 0.09 MG/ACTUAT inhalant solution",
 						"code": "573621",
 						"code_system_name": "RXNORM"
 					}
 					],
 					"code_system_name": "RXNORM"
 				},
 				"manufacturer": "Medication Factory Inc."
 			},
 			"supply": {
 				"date_time": {
 					"low": {
 						"date": "2007-01-03T00:00:00Z",
 						"precision": "day"
 					}
 				},
 				"repeatNumber": "1",
 				"quantity": "75",
 				"author": {
 					"identifiers": [
 					{
 						"identifier": "2a620155-9d11-439e-92b3-5d9815fe4de8"
 					}
 					],
 					"name": {
 						"prefix": "Dr.",
 						"last": "Seven",
 						"first": "Henry"
 					}
 				}
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
 				},
 				"interval": {
 					"period": {
 						"value": 6,
 						"unit": "h"
 					},
 					"frequency": true
 				}
 			},
 			"performer": {
 				"organization": [
 				{
 					"identifiers": [
 					{
 						"identifier": "2.16.840.1.113883.19.5.9999.1393"
 					}
 					],
 					"name": [
 					"Community Health and Hospitals"
 					]
 				}
 				]
 			},
 			"drug_vehicle": {
 				"name": "Aerosol",
 				"code": "324049",
 				"code_system_name": "RXNORM"
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
 			},
 			"indication": {
 				"identifiers": [
 				{
 					"identifier": "db734647-fc99-424c-a864-7e3cda82e703",
 					"extension": "45665"
 				}
 				],
 				"code": {
 					"name": "Finding",
 					"code": "404684003",
 					"code_system_name": "SNOMED CT"
 				},
 				"date_time": {
 					"low": {
 						"date": "2007-01-03T00:00:00Z",
 						"precision": "day"
 					}
 				},
 				"value": {
 					"name": "Pneumonia",
 					"code": "233604007",
 					"code_system_name": "SNOMED CT"
 				}
 			},
 			"dispense": {
 				"identifiers": [
 				{
 					"identifier": "1.2.3.4.56789.1",
 					"extension": "cb734647-fc99-424c-a864-7e3cda82e704"
 				}
 				],
 				"performer": {
 					"identifiers": [
 					{
 						"identifier": "2.16.840.1.113883.19.5.9999.456",
 						"extension": "2981823"
 					}
 					],
 					"address": [
 					{
 						"street_lines": [
 						"1001 Village Avenue"
 						],
 						"city": "Portland",
 						"state": "OR",
 						"zip": "99123",
 						"country": "US"
 					}
 					],
 					"organization": [
 					{
 						"identifiers": [
 						{
 							"identifier": "2.16.840.1.113883.19.5.9999.1393"
 						}
 						],
 						"name": [
 						"Community Health and Hospitals"
 						]
 					}
 					]
 				}
 			}
 		}];
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

        var tmpMedication = {
            "date_time": {
                "low": {
                    "date": "2007-01-03T00:00:00Z",
                    "precision": "day"
                },
                "high": {
                    "date": "2012-05-15T00:00:00Z",
                    "precision": "day"
                }
            },
            "identifiers": [{
                "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
            }],
            "status": "Completed",
            "sig": "Proventil HFA",
            "product": {
                "identifiers": [{
                    "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
                }],
                "unencoded_name": "Proventil HFA",
                "product": {
                    "name": "Proventil HFA",
                    "code": "219483",
                    "translations": [{
                        "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
                        "code": "573621",
                        "code_system_name": "RXNORM"
                    }],
                    "code_system_name": "RXNORM"
                },
                "manufacturer": "Medication Factory Inc."
            },
            "supply": {
                "date_time": {
                    "low": {
                        "date": "2007-01-03T00:00:00Z",
                        "precision": "day"
                    }
                },
                "repeatNumber": "1",
                "quantity": "75",
                "author": {
                    "identifiers": [{
                        "identifier": "2a620155-9d11-439e-92b3-5d9815fe4de8"
                    }],
                    "name": {
                        "prefix": "Dr.",
                        "last": "Seven",
                        "first": "Henry"
                    }
                }
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
                },
                "interval": {
                    "period": {
                        "value": 6,
                        "unit": "h"
                    },
                    "frequency": true
                }
            },
            "performer": {
                "organization": [{
                    "identifiers": [{
                        "identifier": "2.16.840.1.113883.19.5.9999.1393"
                    }],
                    "name": [
                        "Community Health and Hospitals"
                    ]
                }]
            },
            "drug_vehicle": {
                "name": "Aerosol",
                "code": "324049",
                "code_system_name": "RXNORM"
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
            },
            "indication": {
                "identifiers": [{
                    "identifier": "db734647-fc99-424c-a864-7e3cda82e703",
                    "extension": "45665"
                }],
                "code": {
                    "name": "Finding",
                    "code": "404684003",
                    "code_system_name": "SNOMED CT"
                },
                "date_time": {
                    "low": {
                        "date": "2007-01-03T00:00:00Z",
                        "precision": "day"
                    }
                },
                "value": {
                    "name": "Pneumonia",
                    "code": "233604007",
                    "code_system_name": "SNOMED CT"
                }
            },
            "dispense": {
                "identifiers": [{
                    "identifier": "1.2.3.4.56789.1",
                    "extension": "cb734647-fc99-424c-a864-7e3cda82e704"
                }],
                "performer": {
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
                    "organization": [{
                        "identifiers": [{
                            "identifier": "2.16.840.1.113883.19.5.9999.1393"
                        }],
                        "name": [
                            "Community Health and Hospitals"
                        ]
                    }]
                }
            }
        };
>>>>>>> master

        var getRecordMeta = function (callback) {
            callback(null, tmpMetaData);
        }

<<<<<<< HEAD
 	}

 	this.getPartialRecord = getPartialRecord;

 	var getRecord = function(callback) {

 		var tmpMedications = [    {

 			"date_time": { 
                "high":  { 
                    "precision": "day",
                    "date": "2012-05-15T00:00:00Z"
                 },
                "low":  { 
                    "precision": "day",
                    "date": "2007-01-03T00:00:00Z"
                 } 
            } ,
 			"identifiers": [
 			{
 				"identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
 			}
 			],
 			"status": "Completed",
 			"sig": "Proventil HFA",
 			"product": {
 				"identifiers": [
 				{
 					"identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
 				}
 				],
 				"unencoded_name": "Proventil HFA",
 				"product": {
 					"name": "Proventil HFA",
 					"code": "219483",
 					"translations": [
 					{
 						"name": "Proventil 0.09 MG/ACTUAT inhalant solution",
 						"code": "573621",
 						"code_system_name": "RXNORM"
 					}
 					],
 					"code_system_name": "RXNORM"
 				},
 				"manufacturer": "Medication Factory Inc."
 			},
 			"supply": {
 				"date_time": {
 					"low": {
 						"date": "2007-01-03T00:00:00Z",
 						"precision": "day"
 					}
 				},
 				"repeatNumber": "1",
 				"quantity": "75",
 				"author": {
 					"identifiers": [
 					{
 						"identifier": "2a620155-9d11-439e-92b3-5d9815fe4de8"
 					}
 					],
 					"name": {
 						"prefix": "Dr.",
 						"last": "Seven",
 						"first": "Henry"
 					}
 				}
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
 				},
 				"interval": {
 					"period": {
 						"value": 6,
 						"unit": "h"
 					},
 					"frequency": true
 				}
 			},
 			"performer": {
 				"organization": [
 				{
 					"identifiers": [
 					{
 						"identifier": "2.16.840.1.113883.19.5.9999.1393"
 					}
 					],
 					"name": [
 					"Community Health and Hospitals"
 					]
 				}
 				]
 			},
 			"drug_vehicle": {
 				"name": "Aerosol",
 				"code": "324049",
 				"code_system_name": "RXNORM"
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
 			},
 			"indication": {
 				"identifiers": [
 				{
 					"identifier": "db734647-fc99-424c-a864-7e3cda82e703",
 					"extension": "45665"
 				}
 				],
 				"code": {
 					"name": "Finding",
 					"code": "404684003",
 					"code_system_name": "SNOMED CT"
 				},
 				"date_time": {
 					"low": {
 						"date": "2007-01-03T00:00:00Z",
 						"precision": "day"
 					}
 				},
 				"value": {
 					"name": "Pneumonia",
 					"code": "233604007",
 					"code_system_name": "SNOMED CT"
 				}
 			},
 			"dispense": {
 				"identifiers": [
 				{
 					"identifier": "1.2.3.4.56789.1",
 					"extension": "cb734647-fc99-424c-a864-7e3cda82e704"
 				}
 				],
 				"performer": {
 					"identifiers": [
 					{
 						"identifier": "2.16.840.1.113883.19.5.9999.456",
 						"extension": "2981823"
 					}
 					],
 					"address": [
 					{
 						"street_lines": [
 						"1001 Village Avenue"
 						],
 						"city": "Portland",
 						"state": "OR",
 						"zip": "99123",
 						"country": "US"
 					}
 					],
 					"organization": [
 					{
 						"identifiers": [
 						{
 							"identifier": "2.16.840.1.113883.19.5.9999.1393"
 						}
 						],
 						"name": [
 						"Community Health and Hospitals"
 						]
 					}
 					]
 				}
 			}
 		}];

 		callback(null, tmpMedications);

 	}

        this.getRecord = getRecord;

        var saveEntry = function(entry, callback) {
            console.log(entry);
            callback(null);
        }

        this.saveEntry = saveEntry;

        var getPartialMatch = function(callback) {

            getPartialRecord(function(err, partialResults) {
                getRecord(function(err, recordResults) {

                    var tmpMatch = [{
                        "match": "partial",
                        "percent": 75,
                        "subelements": {},
                        "diff": {
                            "date_time": "diff"
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
=======
        this.getRecordMeta = getRecordMeta;

        this.getRecord = function (callback) {

            var tmpReturn = [{
                'metadata': tmpMetaData,
                'data': tmpMedication
            }];

            callback(null, tmpReturn);

        }

    });
>>>>>>> master
