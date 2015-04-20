var bloomjs = require('bloom-js');
var async = require('async');

var bloomClient = new bloomjs.Client();

function processPerformer(perfObj, callback) {
    //do some stuff
    var searchArr = [];
    var bloomObj = {};
    var bloomResults = [];
    async.series([function (cb) {
                if (perfObj.name != null) {
                    if (perfObj.name[0].last != null && perfObj.name[0].first != null) {
                        if (perfObj.address != null) {
                            if (perfObj.address[0].zip != null) {
                                searchArr.push({
                                    'last_name': {
                                        'eq': perfObj.name[0].last
                                    },
                                    'first_name': {
                                        'eq': perfObj.name[0].first
                                    },
                                    'zip': {
                                        'prefix': perfObj.address[0].zip
                                    }
                                });
                            }
                            searchArr.push({
                                'last_name': {
                                    'eq': perfObj.name[0].last
                                },
                                'first_name': {
                                    'eq': perfObj.name[0].first
                                }
                            });
                        }
                    }
                }
                cb();
            },
            function (cb) {
                console.log('search array:');
                console.dir(searchArr);
                cb();
            },
            function (cb) {
                var check = true;
                if (searchArr.length > 0) {
                    async.each(searchArr, function (searchObj, cb2) {
                        if (check) {
                            bloomClient.search('usgov.hhs.npi', searchObj, {
                                'offset': 0, //debug
                                'limit': 10 //debug
                            }, function (error, response) {
                                if (error) return console.log(error.stack);
                                console.log("Search Object");
                                console.dir(searchObj);
                                console.log("Response length: " + response.length);
                                console.dir(response);
                                console.log("End Response");
                                if (response.length > 0) {
                                    check = false;
                                }
                                cb2();
                            })
                        } else {
                            cb2();
                        }

                    }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        cb();
                    })
                } else {
                    cb();
                }
            }
        ],
        function (err, results) {
            callback(null, perfObj);
        })
}

function compileProviders(mHR, callback) {
    var providers = [];

    var singlePerformer = ['medications', 'immunizations'];
    for (var m = 0; m < singlePerformer.length; m++) {
        if (mHR[singlePerformer[m]] != null) {
            console.log(singlePerformer[m]);
            for (var k = 0; k < mHR[singlePerformer[m]].length; k++) {
                if (mHR[singlePerformer[m]][k]["performer"] != null) {
                    processPerformer(mHR[singlePerformer[m]][k]["performer"], function (err, provider) {
                        if (err) {
                            console.log("err" + err);
                        } else {
                            providers.push(provider);
                        }
                    })
                }
            }
        }
    }

    var multiplePerformers = ['encounters', 'procedures']; //these are arrays
    for (var m = 0; m < multiplePerformers.length; m++) {
        if (mHR[multiplePerformers[m]] != null) {
            console.log(multiplePerformers[m]);
            for (var k = 0; k < mHR[multiplePerformers[m]].length; k++) {
                if (mHR[multiplePerformers[m]][k]["performers"] != null) {
                    for (var j = 0; j < mHR[multiplePerformers[m]][k]["performers"].length; j++) {
                        if (Array.isArray(mHR[multiplePerformers[m]][k]["performers"][j])) {
                            for (var x = 0; x < mHR[multiplePerformers[m]][k]["performers"][j].length; x++) {
                                processPerformer(mHR[multiplePerformers[m]][k]["performers"][j][x], function (err, provider) {
                                    if (err) {
                                        console.log("err" + err);
                                    } else {
                                        providers.push(provider);
                                    }
                                })
                            }
                        } else {
                            processPerformer(mHR[multiplePerformers[m]][k]["performers"][j], function (err, provider) {
                                if (err) {
                                    console.log("err" + err);
                                } else {
                                    providers.push(provider);
                                }
                            })
                        }
                    }
                }
            }
        }
    }
    callback(mHR);
}

function getNPI(callback) {

}

function updateProvider(start_provider, callback) {
    //check if start_provider already has an NPI... if not getNPI
}

module.exports.compileProviders = compileProviders;
module.exports.getNPI = getNPI;
module.exports.updateProvider = updateProvider;

/*
bloomClient.search('usgov.hhs.npi', {
'last_name':{
    'eq':'DENNIS'
},
'first_name':{
    'eq':'HANK'
},
'practice_address.zip':{
    'prefix':'44718'
}
}, {
'offset': 0,
'limit': 10
}, function(error, response) {
if (error) return console.log(error.stack);
console.dir(response);
});

var testObj = {
last_name:'DENNIS',
first_name:'LAURIE'
}

var searchObj = {};

for (var prop in testObj) {
searchObj[prop] = {'eq':testObj[prop]};
}

bloomClient.search('usgov.hhs.npi', searchObj, {
'offset': 0,
'limit': 10
}, function(error, response) {
if (error) return console.log(error.stack);
console.dir(response);
});

bloomClient.search('nucc.hcpt',{
'code': {
    'eq':'207RG0100X'
}
},function(error,response){
if (error) return console.log(error.stack);
console.dir(response);
});
*/

function process(inputRecord, callback) {

    var outputRecord = inputRecord;
    outputRecord.providers = [];
    //console.log("here in provider");
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

    if (inputRecord.medications != null) {
        for (var j = 0; j < inputRecord.medications.length; j++) {
            var med = inputRecord.medications[j];
            if (med.supply != null) {
                if (med.supply.author != null) {
                    //console.log("med supply author: " + JSON.stringify(med.supply.author, null, 4));
                    outputRecord.providers.push(med.supply.author);
                }
            }
            if (med.dispense != null) {
                if (med.dispense.performer != null) {
                    //console.log("med dispense performer: " + JSON.stringify(med.dispense.performer, null, 4));
                    outputRecord.providers.push(med.dispense.performer);
                }
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

    if (inputRecord.immunizations != null) {
        for (var j = 0; j < inputRecord.immunizations.length; j++) {
            var imm = inputRecord.immunizations[j];
            if (imm.performer != null) {
                //console.log("imm performer: " + JSON.stringify(imm.performer, null, 4));
                outputRecord.providers.push(imm.performer);
            }
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

    if (inputRecord.procedures != null) {
        for (var j = 0; j < inputRecord.procedures.length; j++) {
            var pro = inputRecord.procedures[j];
            if (pro.performers != null) {
                for (var k = 0; k < pro.performers.length; k++) {
                    //console.log("pro performer " + k + ": " + JSON.stringify(pro.performers[k], null, 4));
                    outputRecord.providers.push(pro.performers[k]);
                }
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