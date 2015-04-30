var express = require('express');
var app = module.exports = express();
var login = require('../login');

var fs = require('fs');
var bb = require("blue-button");
var bbcms = require("blue-button-cms");
var request = require("request");

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
};

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
};

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
    console.log("medcode: " + medcode);
    request('http://rximage.nlm.nih.gov/api/rximage/1/rxnav?rxcui=' + medcode, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
};

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

function queryRxNorm(medname, callback) {
    console.log("Medname: " + medname);
    request('http://rxnav.nlm.nih.gov/REST/rxcui.json?name=' + medname, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(null, response.body);
        }
    });
};
//example: http://rxnav.nlm.nih.gov/REST/rxcui?name=lipitor
//returns: 
// <rxnormdata>
// 	<idGroup>
// 		<name>lipitor</name>
// 		<rxnormId>153165</rxnormId>
// 	</idGroup>
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
};
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

app.post('/api/v1/rximage', login.checkAuth, function (req, res) {
    queryRxImageCode(req.body.rxcui, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data)
        }
    });
});

app.post('/api/v1/rxnorm', login.checkAuth, function (req, res) {
    queryRxNorm(req.body.medname, function (err, data) {
        if (err) {
            console.log("error: " + err);
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data);
        }
    });
});

app.post('/api/v1/openfdaname', login.checkAuth, function (req, res) {
    queryfdaName(req.body.medname, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data)
        }
    });
});

app.post('/api/v1/openfdacode', login.checkAuth, function (req, res) {
    queryfdaCode(req.body.rxcui, function (err, data) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(200).send(data)
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
