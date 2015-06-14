var express = require('express');
var app = module.exports = express();
var login = require('../login');
var async = require('async');

var fs = require('fs');
var bb = require("blue-button");
var bbcms = require("blue-button-cms");
var request = require("request");

var doseFormGroups = [
    '16 Hour Transdermal Patch',
    '24 Hour Transdermal Patch',
    '72 Hour Transdermal Patch',
    'Augmented Topical Cream',
    'Augmented Topical Gel',
    'Augmented Topical Lotion',
    'Augmented Topical Ointment',
    'Biweekly Transdermal Patch',
    'Medicated Pad',
    'Medicated Tape',
    'Patch',
    'Powder Spray',
    'Topical Cake',
    'Topical Cream',
    'Topical Foam',
    'Topical Gel',
    'Topical Lotion',
    'Topical Oil',
    'Topical Ointment',
    'Topical Powder',
    'Topical Solution',
    'Topical Spray',
    'Transdermal Patch ',
    'Weekly Transdermal Patch',
    'Dry Powder Inhaler',
    'Gas',
    'Gas for Inhalation',
    'Inhalant',
    'Inhalant Powder',
    'Inhalant Solution',
    'Metered Dose Inhaler',
    'Nasal Inhalant',
    'Nasal Inhaler',
    'Nasal Spray',
    'Medicated Pad',
    'Medicated Tape',
    'Douche',
    'Vaginal Cream',
    'Vaginal Foam',
    'Vaginal Gel',
    'Vaginal Ointment',
    'Vaginal Powder',
    'Vaginal Ring',
    'Vaginal Spray',
    'Vaginal Suppository',
    'Vaginal Tablet',
    'Injectable Solution',
    'Injectable Suspension',
    'Intramuscular Solution',
    'Intramuscular Suspension',
    'Intrathecal Suspension',
    'Intravenous Solution',
    'Intravenous Suspension',
    'Prefilled Syringe',
    'Enema',
    'Rectal Cream',
    'Rectal Foam',
    'Rectal Gel',
    'Rectal Ointment',
    'Rectal Powder',
    'Rectal Solution',
    'Rectal Spray',
    'Rectal Suppository',
    'Rectal Suspension',
    'Mucosal Spray',
    'Mucous Membrane Topical Solution',
    'Nasal Cream',
    'Nasal Gel',
    'Nasal Inhalant',
    'Nasal Inhaler',
    'Nasal Ointment',
    'Nasal Solution',
    'Nasal Spray',
    'Nasal Suspension',
    'Bar',
    'Buccal Film',
    'Buccal Tablet',
    'Chewable Bar',
    'Chewable Tablet',
    'Chewing Gum',
    'Crystals',
    'Disintegrating Tablet',
    'Elixir',
    'Enteric Coated Capsule',
    'Enteric Coated Tablet',
    'Extended Release Capsule',
    'Extended Release Enteric Coated Capsule',
    'Extended Release Enteric Coated Tablet',
    'Extended Release Suspension',
    'Extended Release Tablet',
    'Flakes',
    'Granules',
    'Lozenge',
    'Oral Capsule',
    'Oral Cream',
    'Oral Foam',
    'Oral Gel',
    'Oral Ointment',
    'Oral Paste',
    'Oral Powder',
    'Oral Solution',
    'Oral Spray',
    'Oral Strip',
    'Oral Suspension',
    'Oral Tablet',
    'Pellet',
    'Pudding',
    'Sublingual Tablet',
    'Sustained Release Buccal Tablet',
    'Wafer',
    'Mouthwash',
    'Toothpaste',
    'Buccal Tablet',
    'Chewable Tablet',
    'Disintegrating Tablet',
    'Enteric Coated Capsule',
    'Enteric Coated Tablet',
    'Extended Release Capsule',
    'Extended Release Enteric Coated Capsule',
    'Extended Release Enteric Coated Tablet',
    'Extended Release Tablet',
    'Oral Capsule',
    'Oral Tablet',
    'Sublingual Tablet',
    'Sustained Release Buccal Tablet',
    'Otic Cream',
    'Otic Ointment',
    'Otic Solution ',
    'Otic Suspension',
    'Ophthalmic Cream',
    'Ophthalmic Gel',
    'Ophthalmic Irrigation Solution',
    'Ophthalmic Ointment',
    'Ophthalmic Solution',
    'Ophthalmic Suspension',
    'Drug Implant',
    'Vaginal Ring',
    'Elixir',
    'Extended Release Suspension',
    'Mouthwash',
    'Oral Solution',
    'Oral Spray',
    'Oral Suspension ',
    'Intraperitoneal Solution',
    'Irrigation Solution',
    'Oral Paste',
    'Paste',
    'Toothpaste',
    'Prefilled Applicator',
    'Urethral Suppository',
    'Urethral Gel',
    'Crystals',
    'Buccal Film',
    'Buccal Tablet',
    'Sustained Release Buccal Tablet',
    'Lozenge',
    'Mouthwash',
    'Oral Ointment',
    'Oral Cream',
    'Sublingual Tablet',
    'Toothpaste',
    'Granules',
    'Oral Foam',
    'Oral Paste',
    'Toothpaste',
    'Oral Powder',
    'Wafer',
    'Disintegrating Tablet',
    'Pellet',
    'Medicated Shampoo',
    'Chewable Bar',
    'Chewable Tablet',
    'Chewing Gum',
    'Flakes',
    'Oral Spray',
    'Pudding',
    'Oral Strip',
    'Bar Soap',
    'Medicated Bar Soap',
    'Medicated Liquid Soap',
    'Oral Gel',
    'Transdermal Patch'
];

// search adverse events for drugs using RxNorm
function queryfdaCode(medcode, callback) {
    request('https://api.fda.gov/drug/event.json?search=patient.drug.openfda.rxcui:' + medcode + '&count=patient.reaction.reactionmeddrapt.exact',
        function (error, response, body) {
            if (error) {
                callback(error);
            } else {
                callback(null, response.body);
            }
        });
}

// search adverse events for drugs with the same brand or generic name
function queryfdaName(medname, callback) {
    request('https://api.fda.gov/drug/event.json?search=patient.drug.openfda.generic_name:' + medname + '+brand_name:' + medname + '&count=patient.reaction.reactionmeddrapt.exact',
        function (error, response, body) {
            if (error) {
                callback(error);
            } else {
                callback(null, response.body);
            }
        });
}

// example: https://api.fda.gov/drug/event.json?search=patient.drug.openfda.rxcui:"318272"&count=patient.reaction.reactionmeddrapt.exact
// response:
// meta: {
//         disclaimer: "openFDA is a beta research project and not for clinical use. While we make every effort to ensure that data is accurate, you should assume all results are unvalidated.",
//         license: "http://open.fda.gov/license",
//         last_updated: "2015-01-21"
//     },
//     results: [{
//             term: "FLUSHING",
//             count: 10017
//         }, {
//             term: "DYSPNOEA",
//             count: 9273
//         }, {
//             term: "NAUSEA",
//             count: 9105
//         }, {
//             term: "DIZZINESS",
//             count: 8347
//         }
//     }]

function queryRxImageCode(medcode, callback) {
    //console.log("medcode: " + medcode);
    request('http://rximage.nlm.nih.gov/api/rximage/1/rxbase?rxcui=' + medcode + '&resolution=600', function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
}

// example: http://rximage.nlm.nih.gov/api/rximage/1/rxnav?rxcui=309114
// response:
// {
//     replyStatus: {
//         success: true,
//         imageCount: 4,
//         totalImageCount: 4,
//         date: "2015-04-27 11:03:15 GMT",
//         matchedTerms: {
//             rxcui: "309114"
//         }
//     },
//     nlmRxImages: [{
//             id: 185646439,
//             ndc11: "00093-3147-01",
//             part: 1,
//             relabelersNdc9: [{@
//                 sourceNdc9: "00093-3147",
//                 ndc9: [
//                     "10544-0020",
//                     "35356-0980",
//                     "42549-0565",
//                     "53808-0222",
//                     "55289-0058",
//                     "60429-0037",
//                     "66116-0255"
//                 ]
//             }],
//             status: "Former imprint",
//             rxcui: 309114,
//             splSetId: "19307ff0-71de-477b-965d-ea243e5ede3a",
//             acqDate: "12-02-2009",
//             name: "Cephalexin 500 MG Oral Capsule",
//             labeler: "Teva Pharmaceuticals USA Inc",
//             imageUrl: "http://rximage.nlm.nih.gov/image/images/gallery/original/00093-3147-01_RXNAVIMAGE10_24231258.jpg",
//             imageSize: 663359,
//             attribution: "National Library of Medicine | Lister Hill National Center for Biomedical Communications | Office of High Performance Computing and Communications | Medicos Consultants LLC"
//         }
//     }
// }

function drugFormList(drugs, callback) {
    var newDrugs = drugs;
    newDrugs.compiled = [];
    newDrugs.dfg = [];
    newDrugs.brand = [];
    var brandRegEx = /\[([^\]]+)\]/g; //retrieve between square brackets
    var packRegEx = /\{([^\}]+)\}/g; //retrieve between curly brackets

    async.series([
        function (cb) {
            if (newDrugs.drugGroup) {
                if (newDrugs.drugGroup.conceptGroup) {
                    async.each(newDrugs.drugGroup.conceptGroup, function (conceptGroup, cb2) {
                        if (conceptGroup.conceptProperties) {
                            async.each(conceptGroup.conceptProperties, function (drug, cb3) {
                                if (drug.tty === "GPCK" || drug.tty === "BPCK") {
                                    cb3();
                                } else {
                                    drug.dfg = [];
                                    newDrugs.compiled.push(drug);
                                    cb3();
                                }
                            }, function (err) {
                                cb2();
                            });
                        } else {
                            cb2();
                        }
                    }, function (err, results) {
                        cb();
                    });
                } else {
                    cb();
                }
            } else {
                cb();
            }
        },
        function (cb) {
            if (newDrugs.compiled) {
                async.each(drugs.compiled, function (drug, cb3) {
                    if (drug.tty === "GPCK" || drug.tty === "BPCK") {
                        cb3();
                    } else {
                        var possibleDrugFormList = [];
                        var possibleFormList = [];
                        var drugFormList = [];
                        var drugBrand = "Generic";
                        var modifiedName = drug.name;
                        async.series([function (cb4) {
                            for (var i = 0; i <= doseFormGroups.length; i++) {
                                if (i === doseFormGroups.length) {
                                    if (possibleFormList.length === 0) {
                                        possibleFormList.push('Other');
                                        possibleDrugFormList.push('Other');
                                    }
                                    cb4();
                                } else {
                                    if (drug.name.indexOf(doseFormGroups[i]) !== -1) {
                                        possibleFormList.push(doseFormGroups[i]);
                                        possibleDrugFormList.push(doseFormGroups[i]);
                                        modifiedName = modifiedName.replace(doseFormGroups[i], "");
                                    }
                                }
                            }
                        }, function (cb4) {
                            for (var i = 0; i <= doseFormGroups.length; i++) {
                                if (i === doseFormGroups.length) {
                                    if (possibleFormList.length === 0) {
                                        possibleFormList.push('Other');
                                        possibleDrugFormList.push('Other');
                                    }
                                    cb4();
                                } else {
                                    if (drug.synonym.indexOf(doseFormGroups[i]) !== -1) {
                                        possibleFormList.push(doseFormGroups[i]);
                                        possibleDrugFormList.push(doseFormGroups[i]);
                                    }
                                }
                            }
                        }, function (cb4) {
                            for (var i = 0; i <= possibleDrugFormList.length; i++) {
                                if (i === possibleDrugFormList.length) {
                                    cb4();
                                } else {
                                    if (drugFormList.indexOf(possibleDrugFormList[i]) === -1) {
                                        drugFormList.push(possibleDrugFormList[i]);
                                    }
                                }
                            }
                        }, function (cb4) {
                            for (var i = 0; i <= newDrugs.compiled.length; i++) {
                                if (i === newDrugs.compiled.length) {
                                    cb4();
                                } else {
                                    var tempBrand = drug.name.match(brandRegEx);
                                    if (tempBrand) {
                                        drugBrand = tempBrand[tempBrand.length - 1];
                                        drugBrand = drugBrand.replace("[", "").replace("]", "");
                                        if (newDrugs.brand.indexOf(drugBrand) === -1) {
                                            newDrugs.brand.push(drugBrand);
                                        }
                                    }
                                }
                            }
                        }, function (cb4) {
                            for (var i = 0; i <= newDrugs.compiled.length; i++) {
                                if (i === newDrugs.compiled.length) {
                                    cb4();
                                } else {
                                    if (newDrugs.compiled[i] === drug) {
                                        newDrugs.compiled[i].dfg = drugFormList;
                                        newDrugs.compiled[i].brand = drugBrand;
                                        newDrugs.compiled[i].modifiedname = modifiedName.replace("[" + drugBrand + "]", "");
                                    }
                                }
                            }
                        }], function (err, results) {
                            for (var i = 0; i <= possibleFormList.length; i++) {
                                if (i === possibleFormList.length) {
                                    cb3();
                                } else {
                                    if (newDrugs.dfg.indexOf(possibleFormList[i]) === -1) {
                                        newDrugs.dfg.push(possibleFormList[i]);
                                    }
                                }
                            }
                        });
                    }
                }, function (err) {
                    cb();
                });
            } else {
                cb();
            }
        }
    ], function (err, results) {
        callback(null, newDrugs);
    });
}

function queryRxNormGroup(medname, callback) {
    //console.log("Medname: " + medname);
    request('http://rxnav.nlm.nih.gov/REST/drugs.json?name=' + medname, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            drugFormList(JSON.parse(response.body), function (err, drugs) {
                if (err) {
                    console.log("Err: " + err);
                    callback(err);
                } else {
                    callback(null, drugs);
                }
            });
        }
    });
}

function queryRxNormName(medname, callback) {
    //console.log("Medname: " + medname);
    request('http://rxnav.nlm.nih.gov/REST/rxcui.json?name=' + medname, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
}

function queryRxNormSpelling(medname, callback) {
    //console.log("Medname: " + medname);
    request('http://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=' + medname, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
}

function queryRxNormApproximate(medname, maxEntries, callback) {
    if (!callback) {
        callback = maxEntries;
        maxEntries = 5;
    }
    //console.log("Medname: " + medname);
    request('http://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=' + medname + '&maxEntries=' + maxEntries, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
}

function queryRxNormDFG(rxcui, callback) {
    request('http://rxnav.nlm.nih.gov/REST/rxcui/' + rxcui + '/related.json?tty=DFG', function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
}
//example: http://rxnav.nlm.nih.gov/REST/rxcui?name=lipitor
//returns: 
// <rxnormdata>
//  <idGroup>
//      <name>lipitor</name>
//      <rxnormId>153165</rxnormId>
//  </idGroup>
// </rxnormdata>

// medlinePlus Connect, submit code, code system (RxNorm), and drug name
function queryMedlinePage(rxcui, medname, callback) {
    //request('http://apps.nlm.nih.gov/medlineplus/services/mpconnect_service.cfm&mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.c=' + rxcui + '&mainSearchCriteria.v.dn=' + medname + '&knowledgeResponseType=application/json',
    request('http://apps.nlm.nih.gov/medlineplus/services/mpconnect_service.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.c=' + rxcui + '&mainSearchCriteria.v.dn=&informationRecipient.languageCode.c=en&knowledgeResponseType=application/json',
        function (error, response, body) {
            if (error) {
                callback(error);
            } else {
                callback(null, response.body);
            }
        });
}
// example: http://apps2.nlm.nih.gov/medlineplus/services/mpconnect_service.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.c=637188&mainSearchCriteria.v.dn=Chantix%200.5%20MG%20Oral%20Tablet&informationRecipient.languageCode.c=en&knowledgeResponseType=application/json
// returns:
// {
//     feed: {
//         xsi: "http://www.w3.org/2001/XMLSchema-instance",
//         base: "http://www.nlm.nih.gov/medlineplus/",
//         lang: "en",
//         title: {},
//         subtitle: {},
//         author: {},
//         updated: {},
//         category: [],
//         id: {},
//         entry: [{
//             lang: "en",
//             title: {
//                 _value: "Varenicline",
//                 type: "text"
//             },
//             link: [{
//                 title: "Varenicline",
//                 rel: "alternate",
//                 type: "html",
//                 href: "http://www.nlm.nih.gov/medlineplus/druginfo/meds/a606024.html"
//             }],
//             id: {
//                 _value: "tag: nlm.nih.gov, 2015-30-04:/medlineplus/druginfo/meds/a606024.html"
//             },
//             updated: {
//                 _value: "2015-04-29T22:04:39Z"
//             },
//             summary: {
//                 _value: "",
//                 type: "html"
//             }
//         }]
//     }
// }

// app.get('/api/v1/rximage/:rxcui', login.checkAuth, function (req, res) {
//     queryRxImageCode(req.params.rxcui, function (err, data) {
//         if (err) {
//             res.status(400).send(err);
//         } else {
//             res.set('Content-Type', 'application/json');
//             res.status(200).send(data)
//         }
//     });
// });
/*
app.get('/api/v1/rxnorm/:medname', login.checkAuth, function (req, res) {
    queryRxNorm(req.params.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});
*/
app.post('/api/v1/rximage', login.checkAuth, function (req, res) {
    queryRxImageCode(req.body.rxcui, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/name', login.checkAuth, function (req, res) {
    queryRxNormName(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/spelling', login.checkAuth, function (req, res) {
    queryRxNormSpelling(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/approximate', login.checkAuth, function (req, res) {
    queryRxNormApproximate(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/group', login.checkAuth, function (req, res) {
    queryRxNormGroup(req.body.medname, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/rxnorm/dfg', login.checkAuth, function (req, res) {
    queryRxNormDFG(req.body.rxcui, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/openfda/name', login.checkAuth, function (req, res) {
    queryfdaName(req.body.medname, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/openfda/code', login.checkAuth, function (req, res) {
    queryfdaCode(req.body.rxcui, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/medlineplus', login.checkAuth, function (req, res) {
    queryMedlinePage(req.body.rxcui, req.body.medname, function (err, data) {
        if (err) {
            console.log("medline plus err: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});
