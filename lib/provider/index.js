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
                    for (var j = 0; j < searchArr.length; j++) {
                        if (check) {
                            bloomClient.search('usgov.hhs.npi', searchArr[j], {
                                'offset': 0, //debug
                                'limit': 10 //debug
                            }, function (error, response) {
                                if (error) return console.log(error.stack);
                                console.dir(searchArr[j]);
                                console.dir(response);
                                console.log("Response length: " + response.length);
                                if (response.length > 0) {
                                    check = false;
                                }
                            })
                        } else {
                            cb();
                        }
                    }
                    cb();
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

    var singlePerformer = ['medications', 'immunizations', 'procedures'];
    for (var m = 0; m < singlePerformer.length; m++) {
        if (mHR[singlePerformer[m]] != null) {
            console.log(singlePerformer[m]);
            for (var k = 0; k < mHR[singlePerformer[m]].length; k++) {
                if (mHR[singlePerformer[m]][k]["performer"] != null) {
                    if (Array.isArray(mHR[singlePerformer[m]][k]["performer"])) {
                        for (var x = 0; x < mHR[singlePerformer[m]][k]["performer"].length; x++) {
                            processPerformer(mHR[singlePerformer[m]][k]["performer"][x], function (err, provider) {
                                if (err) {
                                    console.log("err" + err);
                                } else {
                                    providers.push(provider);
                                }
                            })
                        }
                    } else {
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
    }

    var multiplePerformers = ['encounters'];
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
