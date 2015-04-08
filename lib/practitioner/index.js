function process(inputRecord, callback) {

    var outputRecord = inputRecord;
    outputRecord.practitioners = [];
    //console.log("here in practitioner");
    //console.log(JSON.stringify(inputRecord, null, 4));
    //medications[].supply.author
    /*
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
    */

    //medications[].dispense.performer
    /*
		"performer": {
            "identifiers": [
                {
                    "identifier": "2.16.840.1.113883.19.5.9999.456", //this is Amanda Assigned
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

    for (var j = 0; j < inputRecord.medications.length; j++) {
        var med = inputRecord.medications[j];
        if (med.supply != null) {
            if (med.supply.author != null) {
                //console.log("med supply author: " + JSON.stringify(med.supply.author, null, 4));
                outputRecord.practitioners.push(med.supply.author);
            }
        }
        if (med.dispense != null) {
            if (med.dispense.performer != null) {
                //console.log("med dispense performer: " + JSON.stringify(med.dispense.performer, null, 4));
                outputRecord.practitioners.push(med.dispense.performer);
            }
        }
    }

    //immunizations[].performer
    /*
		"performer": {
            "identifiers": [
                {
                    "identifier": "2.16.840.1.113883.19.5.9999.456",
                    "extension": "2981824"
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
                    "street_lines": [
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
    */

    for (var j = 0; j < inputRecord.immunizations.length; j++) {
        var imm = inputRecord.immunizations[j];
        if (imm.performer != null) {
            //console.log("imm performer: " + JSON.stringify(imm.performer, null, 4));
            outputRecord.practitioners.push(imm.performer);
        }
    }

    //procedures[].performers[]
    /*
    "performers": [
        {
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
            "phone": [
                {
                    "number": "555-555-5000",
                    "type": "work place"
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
        }
    ],
    */

    for (var j = 0; j < inputRecord.procedures.length; j++) {
        var pro = inputRecord.procedures[j];
        if (pro.performers != null) {
            for (var k = 0; k < pro.performers.length; k++) {
                //console.log("pro performer " + k + ": " + JSON.stringify(pro.performers[k], null, 4));
                outputRecord.practitioners.push(pro.performers[k]);
            }
        }
    }

    //providers[]
    /*
		"providers": [
	        {
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
	                "name": "NHC"
	            },
	            "organization": {
	                "name": [
	                    "ANY CARE"
	                ]
	            }
	        },
	        {
	            "name": {
	                "first": "Jane",
	                "last": "Doe"
	            },
	            "address": {
	                "use": "primary home",
	                "street_lines": [
	                    "123 Road"
	                ],
	                "city": "Anywhere",
	                "state": "VA",
	                "zip": "00001",
	                "country": "United States"
	            },
	            "type": {
	                "name": "PHY"
	            }
	        }
	    ]
    */

    callback(null, outputRecord);
}

module.exports.process = process;
