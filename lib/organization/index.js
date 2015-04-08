function process(inputRecord, callback) {
    //console.log("here in organization");
    //console.log(JSON.stringify(inputRecord, null, 4));
    //medications[].performer.organization[]
    /*
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
    */

    //medications[].dispense.performer
    /*
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
    */

    //immunizations[].performer.organization[]
    /*
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
    */

    //procedures[].performer[].organization[]
    /*
        "organization": [
            {
                "identifiers": [
                    {
                        "identifier": "2.16.840.1.113883.19.5.9999.1393"
                    }
                ],
                "name": [
                    "Community Health and Hospitals"
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
                "phone": [
                    {
                        "number": "555-555-5000",
                        "type": "work place"
                    }
                ]
            }
        ]
    */

    //payers[].policy.insurance.performer  //insurance company?
    /*
		"performer": {
            "identifiers": [
                {
                    "identifier": "2.16.840.1.113883.19"
                }
            ],
            "address": [
                {
                    "street_lines": [
                        "123 Insurance Road"
                    ],
                    "city": "Blue Bell",
                    "state": "MA",
                    "zip": "02368",
                    "country": "US",
                    "use": "work place"
                }
            ],
            "phone": [
                {
                    "number": "(781)555-1515",
                    "type": "work place"
                }
            ],
            "organization": [
                {
                    "name": [
                        "Good Health Insurance"
                    ],
                    "address": [
                        {
                            "street_lines": [
                                "123 Insurance Road"
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US",
                            "use": "work place"
                        }
                    ],
                    "phone": [
                        {
                            "number": "(781)555-1515",
                            "type": "work place"
                        }
                    ]
                }
            ],
            "code": [
                {
                    "code": "PAYOR",
                    "code_system_name": "HL7 RoleCode"
                }
            ]
        }
    */

    //payers[].policy.insurance.performer.organization[]
    /*
		{
            "name": [
                "Aetna Medicare Value Plan (HMO)",
                "Aetna Medicare",
                "3 - Coordinated Care Plan (HMO, PPO, PSO, SNP)"
            ],
            "address": [
                {
                    "use": "primary home",
                    "street_lines": [
                        "123 Any Road"
                    ],
                    "city": "Anytown",
                    "state": "PA",
                    "zip": "00003",
                    "country": "United States"
                }
            ]
        }
    */

    //providers[]
    /*
		"providers": [
	        {  //organization?
	            "address": {
	                "use": "primary home",
	                "street_lines": [
	                    "123 Any Rd"
	                ],
	                "city": "Anywhere",
	                "state": "MD",
	                "zip": "99999",
	                "country": "United States"
	            },
	            "type": {
	                "name": "NHC"  //?
	            },
	            "organization": {
	                "name": [
	                    "ANY CARE"
	                ]
	            }
	        },
	        { //doctor?
	            "name": {
	                "first": "Jane",
	                "last": "Doe"
	            },
	            "address": {
	                "use": "primary home",  //home?
	                "street_lines": [
	                    "123 Road"
	                ],
	                "city": "Anywhere",
	                "state": "VA",
	                "zip": "00001",
	                "country": "United States"
	            },
	            "type": {
	                "name": "PHY"  //physician?
	            }
	        }
	    ]
    */

    callback(null, inputRecord);
}

module.exports.process = process;
