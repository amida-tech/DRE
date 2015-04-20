var async = require('async');

function process(inputRecord, callback) {

    var outputRecord = inputRecord;
    outputRecord.organizations = [];

    async.parallel([function (cb) {
        if (inputRecord.medications != null) {
            for (var j = 0; j <= inputRecord.medications.length; j++) {
                if (j != inputRecord.medications.length) {
                    var med = inputRecord.medications[j];
                    if (med.performer != null) {
                        if (med.performer.organization != null) {
                            for (var k = 0; k < med.performer.organization.length; k++) {
                                console.log("med perf org " + k + ": " + JSON.stringify(med.performer.organization[k], null, 4));
                                outputRecord.organizations.push(med.performer.organization[k]);
                            }
                        }
                    }
                    if (med.dispense != null) {
                        if (med.dispense.performer != null) {
                            if (med.dispense.performer.organization != null) {
                                for (var k = 0; k < med.dispense.performer.organization.length; k++) {
                                    console.log("med dispense performer organization " + k + ": " + JSON.stringify(med.dispense.performer.organization[k], null, 4));
                                    outputRecord.organizations.push(med.dispense.performer.organization[k]);
                                }
                            }
                        }
                    }
                } else {
                    cb();
                }
            }
        }
    }, function (cb) {
        if (inputRecord.immunizations != null) {
            for (var j = 0; j <= inputRecord.immunizations.length; j++) {
                if (j != inputRecord.immunizations.length) {
                    var imm = inputRecord.immunizations[j];
                    if (imm.performer != null) {
                        if (imm.performer.organization != null)
                            for (var k = 0; k < imm.performer.organization.length; k++) {
                                console.log("imm performer org " + k + ": " + JSON.stringify(imm.performer.organization[k], null, 4));
                                outputRecord.organizations.push(imm.performer.organization[k]);
                            }
                    }
                } else {
                    cb();
                }
            }
        }
    }, function (cb) {
        if (inputRecord.procedures != null) {
            for (var j = 0; j <= inputRecord.procedures.length; j++) {
                if (j != inputRecord.procedures.length) {
                    var pro = inputRecord.procedures[j];
                    if (pro.performers != null) {
                        for (var k = 0; k < pro.performers.length; k++) {
                            if (pro.performers[k].organization != null) {
                                for (var m = 0; m < pro.performers[k].organization.length; m++) {
                                    console.log("pro performer " + k + " + org " + m + ": " + JSON.stringify(pro.performers[k].organization[m], null, 4));
                                    outputRecord.organizations.push(pro.performers[k].organization[m]);
                                }
                            }
                        }
                    }
                } else {
                    cb();
                }
            }
        }
    }], function (err, results) {
        if (err) {
            console.log(err);
        }
        callback(null, outputRecord);
    });

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

    //medications[].dispense.performer.organization[]
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

    //procedures[].performers[].organization[]
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
}

module.exports.process = process;
