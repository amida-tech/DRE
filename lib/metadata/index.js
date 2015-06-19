var express = require('express');
var app = module.exports = express();
var _ = require('lodash');
var login = require('../login');

var bb = require('blue-button');
var record = require('blue-button-record');
var dre2fhir = require('blue-button-gen-fhir');

app.get('/fhir/Patient',
    login.passport.authenticate('bearer', {
        session: false
    }),
    function (req, res) {
        var user = req.user.username;
        record.getSection('demographics', user, function (err, savedObj) {
            if (err) {
                res.send(err);
            } else {
                var entry = dre2fhir.sectionToFHIR(['demographics'], savedObj);

                // Wrap to a bundle header
                var bundle = {
                    resourceType: "Bundle",
                    title: "FHIR Atom Feed",
                    id: req.protocol + '://' + req.get('host') + req.originalUrl,
                    totalResults: entry.entry.length,
                    updated: (new Date()).toISOString()
                };
                _.merge(bundle, entry);
                //console.log(JSON.stringify(bundle, null, 2));
                res.send(JSON.stringify(bundle, null, 2));
            }
        });
    });

app.get('/fhir/MedicationPrescription',
    login.passport.authenticate('bearer', {
        session: false
    }),
    function (req, res) {
        var user = req.user.username;
        record.getSection('medications', user, function (err, savedObj) {
            if (err) {
                res.send(err);
            } else {
                var entry = dre2fhir.sectionToFHIR(['medications'], savedObj);
                // Wrap to a bundle header
                var bundle = {
                    resourceType: "Bundle",
                    title: "FHIR Atom Feed",
                    id: req.protocol + '://' + req.get('host') + req.originalUrl,
                    totalResults: entry.entry.length,
                    updated: (new Date()).toISOString(),
                };
                _.merge(bundle, entry);
                res.send(JSON.stringify(bundle, null, 2));
            }
        });
    });

app.get(
    '/fhir/Observation',
    login.passport.authenticate('bearer', {
        session: false
    }),
    function (req, res) {
        res.send(

            {
                "resourceType": "Observation",
                "text": {
                    "status": "generated",
                    "div": "<div>\n      <p>\n        <b>Generated Narrative</b>\n      </p>\n      <p>\n        <b>name</b>: \n        <span title=\"Codes: {http://snomed.info/sct 60621009}, {http://loinc.org 39156-5}\">BMI</span>\n      </p>\n      <p>\n        <b>value[x]</b>: 31.31 null\n      </p>\n      <p>\n        <b>interpretation</b>: \n        <span title=\"Codes: {http://snomed.info/sct 75540009}, {http://hl7.org/fhir/v2/0078 H}\">High</span>\n      </p>\n      <p>\n        <b>issued</b>: 4-Apr 2013 13:27\n      </p>\n      <p>\n        <b>status</b>: final_\n      </p>\n      <p>\n        <b>reliability</b>: ok\n      </p>\n      <p>\n        <b>bodySite</b>: \n        <span title=\"Codes: {http://snomed.info/sct 38266002}\">Entire body as a whole</span>\n      </p>\n      <p>\n        <b>method</b>: \n        <span title=\"Codes: {http://snomed.info/sct 122869004}\">Measurement - action</span>\n      </p>\n      <p>\n        <b>subject</b>: Roel\n      </p>\n      <p>\n        <b>performer</b>: \n        <a href=\"practitioner-example-f201-ab.html\">UZI-nummer = 12345678901 (official); Dokter Bronsig(official); Male; birthDate: 24-Dec 1956; Implementation of planned interventions; Medical oncologist</a>\n      </p>\n      <h3>ReferenceRanges</h3>\n      <table class=\"grid\">\n        <tr>\n          <td>\n            <b>Low</b>\n          </td>\n          <td>\n            <b>High</b>\n          </td>\n          <td>\n            <b>Meaning</b>\n          </td>\n          <td>\n            <b>Age</b>\n          </td>\n        </tr>\n        <tr>\n          <td> </td>\n          <td>20 null</td>\n          <td>\n            <span title=\"Codes: {http://snomed.info/sct 310252000}\">Low BMI</span>\n          </td>\n          <td> </td>\n        </tr>\n        <tr>\n          <td>20 null</td>\n          <td>25 null</td>\n          <td>\n            <span title=\"Codes: {http://snomed.info/sct 412768003}\">Normal BMI</span>\n          </td>\n          <td> </td>\n        </tr>\n        <tr>\n          <td>25 null</td>\n          <td>30 null</td>\n          <td>\n            <span title=\"Codes: {http://snomed.info/sct 162863004}\">Overweight</span>\n          </td>\n          <td> </td>\n        </tr>\n        <tr>\n          <td>30 null</td>\n          <td>40 null</td>\n          <td>\n            <span title=\"Codes: {http://snomed.info/sct 162864005}\">Obesity</span>\n          </td>\n          <td> </td>\n        </tr>\n        <tr>\n          <td>40 null</td>\n          <td> </td>\n          <td>\n            <span title=\"Codes: {http://snomed.info/sct 162864005}\">Severe obesity</span>\n          </td>\n          <td> </td>\n        </tr>\n      </table>\n      <h3>Relateds</h3>\n      <table class=\"grid\">\n        <tr>\n          <td>\n            <b>Type</b>\n          </td>\n          <td>\n            <b>Target</b>\n          </td>\n        </tr>\n        <tr>\n          <td>derivedfrom</td>\n          <td>Length; 182 centimeter; final_; ok</td>\n        </tr>\n        <tr>\n          <td>derivedfrom</td>\n          <td>Weight; 103.7 kilogram; final_; ok</td>\n        </tr>\n      </table>\n    </div>"
                },
                "contained": [{
                    "resourceType": "Observation",
                    "id": "length",
                    "name": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "410667008",
                            "display": "Length"
                        }]
                    },
                    "valueQuantity": {
                        "value": 182,
                        "units": "centimeter",
                        "system": "http://snomed.info/sct",
                        "code": "258672001"
                    },
                    "status": "final",
                    "reliability": "ok"
                }, {
                    "resourceType": "Observation",
                    "id": "weight",
                    "name": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "60621009",
                            "display": "Weight"
                        }]
                    },
                    "valueQuantity": {
                        "value": 103.7,
                        "units": "kilogram",
                        "system": "http://snomed.info/sct",
                        "code": "258683005"
                    },
                    "status": "final",
                    "reliability": "ok"
                }],
                "name": {
                    "coding": [{
                        "system": "http://snomed.info/sct",
                        "code": "60621009",
                        "display": "Body mass index"
                    }, {
                        "system": "http://loinc.org",
                        "code": "39156-5",
                        "display": "Body mass index (BMI) [Ratio]"
                    }],
                    "text": "BMI"
                },
                "valueQuantity": {
                    "value": 31.31
                },
                "interpretation": {
                    "coding": [{
                        "system": "http://snomed.info/sct",
                        "code": "75540009",
                        "display": "High"
                    }, {
                        "system": "http://hl7.org/fhir/v2/0078",
                        "code": "H"
                    }]
                },
                "issued": "2013-04-04T13:27:00+01:00",
                "status": "final",
                "reliability": "ok",
                "bodySite": {
                    "coding": [{
                        "system": "http://snomed.info/sct",
                        "code": "38266002",
                        "display": "Entire body as a whole"
                    }]
                },
                "method": {
                    "coding": [{
                        "system": "http://snomed.info/sct",
                        "code": "122869004",
                        "display": "Measurement - action"
                    }]
                },
                "subject": {
                    "reference": "Patient/f201",
                    "display": "Roel"
                },
                "performer": [{
                    "reference": "Practitioner/f201"
                }],
                "referenceRange": [{
                    "high": {
                        "value": 20
                    },
                    "meaning": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "310252000",
                            "display": "Low BMI"
                        }]
                    }
                }, {
                    "low": {
                        "value": 20
                    },
                    "high": {
                        "value": 25
                    },
                    "meaning": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "412768003",
                            "display": "Normal BMI"
                        }]
                    }
                }, {
                    "low": {
                        "value": 25
                    },
                    "high": {
                        "value": 30
                    },
                    "meaning": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "162863004",
                            "display": "Overweight"
                        }]
                    }
                }, {
                    "low": {
                        "value": 30
                    },
                    "high": {
                        "value": 40
                    },
                    "meaning": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "162864005",
                            "display": "Obesity"
                        }]
                    }
                }, {
                    "low": {
                        "value": 40
                    },
                    "meaning": {
                        "coding": [{
                            "system": "http://snomed.info/sct",
                            "code": "162864005",
                            "display": "Severe obesity"
                        }]
                    }
                }],
                "related": [{
                    "type": "derived-from",
                    "target": {
                        "reference": "#length"
                    }
                }, {
                    "type": "derived-from",
                    "target": {
                        "reference": "#weight"
                    }
                }]
            }

        );
    });

/**
 * Returns 
 * See <a href="http://hl7.org/implement/standards/fhir/2015Jan/conformance.profile.json.html">here</a>
 */
app.get('/fhir/metadata', function (req, res) {

    //var baseUri = ((req.connection.encrypted)? "https": "http") + "://" + req.headers.host;
    var baseUri = "https://" + req.headers.host;

    res.send(

        {
            "resourceType": "Conformance",
            "text": {
                "status": "generated",
                "div": "<div>Generated Conformance Statement -- see structured representation.</div>"
            },
            "identifier": "https://fhir-api.smarthealthit.org/conformance",
            "version": "0.0.82.????",
            "name": "SMART on FHIR Conformance Statement",
            "publisher": "SMART on FHIR",
            "telecom": [{
                "system": "url",
                "value": baseUri + "/fhir"
            }],
            "description": "Describes capabilities of this SMART on FHIR server",
            "status": "draft",
            "date": "2015-05-05T21:24:11.550-00:00",
            "fhirVersion": "0.0.82",
            "acceptUnknown": false,
            "format": [
                "xml",
                "json"
            ],
            "rest": [{
                "mode": "server",
                "documentation": "All the functionality defined in FHIR",
                "security": {
                    "extension": [{
                        "url": "http://fhir-registry.smarthealthit.org/Profile/oauth-uris#register",
                        "valueUri": baseUri + "/oauth2/register"
                    }, {
                        "url": "http://fhir-registry.smarthealthit.org/Profile/oauth-uris#authorize",
                        "valueUri": baseUri + "/oauth2/authorize"
                    }, {
                        "url": "http://fhir-registry.smarthealthit.org/Profile/oauth-uris#token",
                        "valueUri": baseUri + "/oauth2/token"
                    }],
                    "service": [{
                        "coding": [{
                            "system": "http://hl7.org/fhir/vs/restful-security-service",
                            "code": "OAuth2"
                        }],
                        "text": "OAuth version 2 (see oauth.net)."
                    }],
                    "description": "SMART on FHIR uses OAuth2 for authorization"
                },
                "resource": [{
                    "type": "AdverseReaction",
                    "profile": {
                        "reference": "http://hl7.org/fhir/AdverseReaction"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "substance",
                        "definition": "http://hl7.org/fhir/profiles/AdverseReaction",
                        "type": "reference",
                        "documentation": "The name or code of the substance that produces the sensitivity"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/AdverseReaction",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/AdverseReaction",
                        "type": "reference",
                        "documentation": "The subject that the sensitivity is about"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/AdverseReaction",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/AdverseReaction",
                        "type": "date",
                        "documentation": "The date of the reaction"
                    }, {
                        "name": "symptom",
                        "definition": "http://hl7.org/fhir/profiles/AdverseReaction",
                        "type": "token",
                        "documentation": "One of the symptoms of the reaction"
                    }]
                }, {
                    "type": "Alert",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Alert"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Alert",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Alert",
                        "type": "reference",
                        "documentation": "The identity of a subject to list alerts for"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Alert",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }]
                }, {
                    "type": "AllergyIntolerance",
                    "profile": {
                        "reference": "http://hl7.org/fhir/AllergyIntolerance"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "substance",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "reference",
                        "documentation": "The name or code of the substance that produces the sensitivity"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "token",
                        "documentation": "The status of the sensitivity"
                    }, {
                        "name": "recorder",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "reference",
                        "documentation": "Who recorded the sensitivity"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "reference",
                        "documentation": "The subject that the sensitivity is about"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "date",
                        "documentation": "Recorded date/time."
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/AllergyIntolerance",
                        "type": "token",
                        "documentation": "The type of sensitivity"
                    }]
                }, {
                    "type": "CarePlan",
                    "profile": {
                        "reference": "http://hl7.org/fhir/CarePlan"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "activitycode",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "token",
                        "documentation": "Detail type of activity"
                    }, {
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "reference",
                        "documentation": "Who care plan is for"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "condition",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "reference",
                        "documentation": "Health issues this plan addresses"
                    }, {
                        "name": "activitydetail",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "reference",
                        "documentation": "Activity details defined in specific resource"
                    }, {
                        "name": "activitydate",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "date",
                        "documentation": "Specified date occurs within period specified by CarePlan.activity.timingSchedule"
                    }, {
                        "name": "participant",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "reference",
                        "documentation": "Who is involved"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/CarePlan",
                        "type": "date",
                        "documentation": "Time period plan covers"
                    }]
                }, {
                    "type": "Composition",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Composition"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "author",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "reference",
                        "documentation": "Who and/or what authored the composition"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "attester",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "reference",
                        "documentation": "Who attested the composition"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "reference",
                        "documentation": "Who and/or what the composition is about"
                    }, {
                        "name": "section-content",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "reference",
                        "documentation": "The actual data for the section"
                    }, {
                        "name": "context",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "Code(s) that apply to the event being documented"
                    }, {
                        "name": "class",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "Categorization of Composition"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "section-type",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "Classification of section (recommended)"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "date",
                        "documentation": "Composition editing time"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "Kind of composition (LOINC if possible)"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Composition",
                        "type": "token",
                        "documentation": "Logical identifier of composition (version-independent)"
                    }]
                }, {
                    "type": "ConceptMap",
                    "profile": {
                        "reference": "http://hl7.org/fhir/ConceptMap"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "dependson",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "Reference to element/field/valueset provides the context"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "Status of the concept map"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "date",
                        "documentation": "The concept map publication date"
                    }, {
                        "name": "version",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "The version identifier of the concept map"
                    }, {
                        "name": "publisher",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "string",
                        "documentation": "Name of the publisher of the concept map"
                    }, {
                        "name": "product",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "Reference to element/field/valueset provides the context"
                    }, {
                        "name": "system",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "The system for any destination concepts mapped by this map"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "source",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "reference",
                        "documentation": "The system for any concepts mapped by this concept map"
                    }, {
                        "name": "description",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "string",
                        "documentation": "Text search in the description of the concept map"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "string",
                        "documentation": "Name of the concept map"
                    }, {
                        "name": "target",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "reference",
                        "documentation": "Provides context to the mappings"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/ConceptMap",
                        "type": "token",
                        "documentation": "The identifier of the concept map"
                    }]
                }, {
                    "type": "Condition",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Condition"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "asserter",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "reference",
                        "documentation": "Person who asserts this condition"
                    }, {
                        "name": "location",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "Location - may include laterality"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "The status of the condition"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "reference",
                        "documentation": "Who has the condition?"
                    }, {
                        "name": "onset",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "date",
                        "documentation": "When the Condition started (if started on a date)"
                    }, {
                        "name": "evidence",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "Manifestation/symptom"
                    }, {
                        "name": "severity",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "The severity of the condition"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "Code for the condition"
                    }, {
                        "name": "encounter",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "reference",
                        "documentation": "Encounter when condition first asserted"
                    }, {
                        "name": "date-asserted",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "date",
                        "documentation": "When first detected/suspected/entered"
                    }, {
                        "name": "stage",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "Simple summary (disease specific)"
                    }, {
                        "name": "related-code",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "Relationship target by means of a predefined code"
                    }, {
                        "name": "category",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "The category of the condition"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "related-item",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "reference",
                        "documentation": "Relationship target resource"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Condition",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }]
                }, {
                    "type": "Conformance",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Conformance"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "The current status of the conformance statement"
                    }, {
                        "name": "resource",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "Name of a resource mentioned in a conformance statement"
                    }, {
                        "name": "security",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "Information about security of implementation"
                    }, {
                        "name": "format",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "formats supported (xml | json | mime type)"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "date",
                        "documentation": "The conformance statement publication date"
                    }, {
                        "name": "mode",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "Mode - restful (server/client) or messaging (sender/receiver)"
                    }, {
                        "name": "version",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "The version identifier of the conformance statement"
                    }, {
                        "name": "publisher",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "string",
                        "documentation": "Name of the publisher of the conformance statement"
                    }, {
                        "name": "software",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "string",
                        "documentation": "Part of a the name of a software application"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "event",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "Event code in a conformance statement"
                    }, {
                        "name": "description",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "string",
                        "documentation": "Text search in the description of the conformance statement"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "string",
                        "documentation": "Name of the conformance statement"
                    }, {
                        "name": "supported-profile",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "reference",
                        "documentation": "Profiles supported by the system"
                    }, {
                        "name": "fhirversion",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "The version of FHIR"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "token",
                        "documentation": "The identifier of the conformance statement"
                    }, {
                        "name": "profile",
                        "definition": "http://hl7.org/fhir/profiles/Conformance",
                        "type": "reference",
                        "documentation": "A profile id invoked in a conformance statement"
                    }]
                }, {
                    "type": "Device",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Device"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "organization",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "reference",
                        "documentation": "The organization responsible for the device"
                    }, {
                        "name": "model",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "string",
                        "documentation": "The model of the device"
                    }, {
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "reference",
                        "documentation": "Patient information, if the resource is affixed to a person"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "location",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "reference",
                        "documentation": "A location, where the resource is found"
                    }, {
                        "name": "manufacturer",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "string",
                        "documentation": "The manufacturer of the device"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "udi",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "string",
                        "documentation": "FDA Mandated Unique Device Identifier"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "token",
                        "documentation": "The type of the device"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Device",
                        "type": "token",
                        "documentation": "Instance id from manufacturer, owner and others"
                    }]
                }, {
                    "type": "DeviceObservationReport",
                    "profile": {
                        "reference": "http://hl7.org/fhir/DeviceObservationReport"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "observation",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "reference",
                        "documentation": "The data for the metric"
                    }, {
                        "name": "source",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "reference",
                        "documentation": "Identifies/describes where the data came from"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "reference",
                        "documentation": "Subject of the measurement"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "token",
                        "documentation": "The compatment code"
                    }, {
                        "name": "channel",
                        "definition": "http://hl7.org/fhir/profiles/DeviceObservationReport",
                        "type": "token",
                        "documentation": "The channel code"
                    }]
                }, {
                    "type": "DiagnosticOrder",
                    "profile": {
                        "reference": "http://hl7.org/fhir/DiagnosticOrder"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "orderer",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "reference",
                        "documentation": "Who ordered the test"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "requested | received | accepted | in progress | review | completed | suspended | rejected | failed"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "reference",
                        "documentation": "Who and/or what test is about"
                    }, {
                        "name": "item-status",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "requested | received | accepted | in progress | review | completed | suspended | rejected | failed"
                    }, {
                        "name": "event-status",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "requested | received | accepted | in progress | review | completed | suspended | rejected | failed"
                    }, {
                        "name": "actor",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "reference",
                        "documentation": "Who recorded or did this"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "Code to indicate the item (test or panel) being ordered"
                    }, {
                        "name": "encounter",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "reference",
                        "documentation": "The encounter that this diagnostic order is associated with"
                    }, {
                        "name": "item-past-status",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "requested | received | accepted | in progress | review | completed | suspended | rejected | failed"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "bodysite",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "Location of requested test (if applicable)"
                    }, {
                        "name": "item-date",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "date",
                        "documentation": "The date at which the event happened"
                    }, {
                        "name": "specimen",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "reference",
                        "documentation": "If the whole order relates to specific specimens"
                    }, {
                        "name": "event-status-date",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "composite",
                        "documentation": "A combination of past-status and date"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "event-date",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "date",
                        "documentation": "The date at which the event happened"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "token",
                        "documentation": "Identifiers assigned to this order"
                    }, {
                        "name": "item-status-date",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticOrder",
                        "type": "composite",
                        "documentation": "A combination of item-past-status and item-date"
                    }]
                }, {
                    "type": "DiagnosticReport",
                    "profile": {
                        "reference": "http://hl7.org/fhir/DiagnosticReport"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "result",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "reference",
                        "documentation": "Link to an atomic result (observation resource)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "The status of the report"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "reference",
                        "documentation": "The subject of the report"
                    }, {
                        "name": "issued",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "date",
                        "documentation": "When the report was issued"
                    }, {
                        "name": "diagnosis",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "A coded diagnosis on the report"
                    }, {
                        "name": "image",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "reference",
                        "documentation": "Reference to the image source"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "date",
                        "documentation": "The clinically relevant time of the report"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "request",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "reference",
                        "documentation": "What was requested"
                    }, {
                        "name": "specimen",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "reference",
                        "documentation": "The specimen details"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "The name of the report (e.g. the code for the report as a whole, as opposed to codes for the atomic results, which are the names on the observation resource referred to from the result)"
                    }, {
                        "name": "service",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "Which diagnostic discipline/department created the report"
                    }, {
                        "name": "performer",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "reference",
                        "documentation": "Who was the source of the report (organization)"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/DiagnosticReport",
                        "type": "token",
                        "documentation": "An identifier for the report"
                    }]
                }, {
                    "type": "DocumentManifest",
                    "profile": {
                        "reference": "http://hl7.org/fhir/DocumentManifest"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "content",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "reference",
                        "documentation": "Contents of this set of documents"
                    }, {
                        "name": "author",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "reference",
                        "documentation": "Who and/or what authored the document"
                    }, {
                        "name": "supersedes",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "reference",
                        "documentation": "If this document manifest replaces another"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "token",
                        "documentation": "current | superceded | entered in error"
                    }, {
                        "name": "created",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "date",
                        "documentation": "When this document manifest created"
                    }, {
                        "name": "confidentiality",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "token",
                        "documentation": "Sensitivity of set of documents"
                    }, {
                        "name": "description",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "string",
                        "documentation": "Human-readable description (title)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "reference",
                        "documentation": "The subject of the set of documents"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "token",
                        "documentation": "What kind of document set this is"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "token",
                        "documentation": "Unique Identifier for the set of documents"
                    }, {
                        "name": "recipient",
                        "definition": "http://hl7.org/fhir/profiles/DocumentManifest",
                        "type": "reference",
                        "documentation": "Intended to get notified about this set of documents"
                    }]
                }, {
                    "type": "DocumentReference",
                    "profile": {
                        "reference": "http://hl7.org/fhir/DocumentReference"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "location",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "string",
                        "documentation": "Where to access the document"
                    }, {
                        "name": "indexed",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "date",
                        "documentation": "When this document reference created"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "current | superceded | entered in error"
                    }, {
                        "name": "relatesto",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "reference",
                        "documentation": "Target of the relationship"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "reference",
                        "documentation": "Who|what is the subject of the document"
                    }, {
                        "name": "relation",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "replaces | transforms | signs | appends"
                    }, {
                        "name": "class",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "Categorization of Document"
                    }, {
                        "name": "format",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "Format/content rules for the document"
                    }, {
                        "name": "period",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "date",
                        "documentation": "Time of service that is being documented"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "What kind of document this is (LOINC if possible)"
                    }, {
                        "name": "authenticator",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "reference",
                        "documentation": "Who/What authenticated the document"
                    }, {
                        "name": "size",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "number",
                        "documentation": "Size of the document in bytes"
                    }, {
                        "name": "relationship",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "composite",
                        "documentation": "Combination of relation and relatesTo"
                    }, {
                        "name": "author",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "reference",
                        "documentation": "Who and/or what authored the document"
                    }, {
                        "name": "custodian",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "reference",
                        "documentation": "Org which maintains the document"
                    }, {
                        "name": "facility",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "Kind of facility where patient was seen"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "created",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "date",
                        "documentation": "Document creation time"
                    }, {
                        "name": "event",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "Main Clinical Acts Documented"
                    }, {
                        "name": "confidentiality",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "Sensitivity of source document"
                    }, {
                        "name": "description",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "string",
                        "documentation": "Human-readable description (title)"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "language",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "The marked primary language for the document"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/DocumentReference",
                        "type": "token",
                        "documentation": "Master Version Specific Identifier"
                    }]
                }, {
                    "type": "Encounter",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Encounter"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "location",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "reference",
                        "documentation": "Location the encounter takes place"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "token",
                        "documentation": "planned | in progress | onleave | finished | cancelled"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "reference",
                        "documentation": "The patient present at the encounter"
                    }, {
                        "name": "indication",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "reference",
                        "documentation": "Reason the encounter takes place (resource)"
                    }, {
                        "name": "length",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "number",
                        "documentation": "Length of encounter in days"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "date",
                        "documentation": "A date within the period the Encounter lasted"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "token",
                        "documentation": "Identifier(s) by which this encounter is known"
                    }, {
                        "name": "location-period",
                        "definition": "http://hl7.org/fhir/profiles/Encounter",
                        "type": "date",
                        "documentation": "Time period during which the patient was present at the location"
                    }]
                }, {
                    "type": "FamilyHistory",
                    "profile": {
                        "reference": "http://hl7.org/fhir/FamilyHistory"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/FamilyHistory",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/FamilyHistory",
                        "type": "reference",
                        "documentation": "The identity of a subject to list family history items for"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/FamilyHistory",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }]
                }, {
                    "type": "Group",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Group"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "member",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "reference",
                        "documentation": "Who is in group"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "characteristic-value",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "composite",
                        "documentation": "A composite of both characteristic and value"
                    }, {
                        "name": "value",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "Value held by characteristic"
                    }, {
                        "name": "actual",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "Descriptive or actual"
                    }, {
                        "name": "exclude",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "Group includes or excludes"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "The kind of resources contained"
                    }, {
                        "name": "characteristic",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "Kind of characteristic"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "The type of resources the group contains"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Group",
                        "type": "token",
                        "documentation": "Unique id"
                    }]
                }, {
                    "type": "ImagingStudy",
                    "profile": {
                        "reference": "http://hl7.org/fhir/ImagingStudy"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "uid",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "Formal identifier for this instance (0008,0018)"
                    }, {
                        "name": "series",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "The series id for the image"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "bodysite",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "Body part examined (Map from 0018,0015)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "reference",
                        "documentation": "Who the study is about"
                    }, {
                        "name": "accession",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "The accession id for the image"
                    }, {
                        "name": "study",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "The study id for the image"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "modality",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "The modality of the image"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "date",
                        "documentation": "The date the study was done was taken"
                    }, {
                        "name": "dicom-class",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "token",
                        "documentation": "DICOM class type (0008,0016)"
                    }, {
                        "name": "size",
                        "definition": "http://hl7.org/fhir/profiles/ImagingStudy",
                        "type": "number",
                        "documentation": "The size of the image in MB - may include > or < in the value"
                    }]
                }, {
                    "type": "Immunization",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Immunization"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "reaction",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "reference",
                        "documentation": "Additional information on reaction"
                    }, {
                        "name": "requester",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "reference",
                        "documentation": "The practitioner who ordered the vaccination"
                    }, {
                        "name": "dose-sequence",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "number",
                        "documentation": "What dose number within series?"
                    }, {
                        "name": "vaccine-type",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "Vaccine Product Type Administered"
                    }, {
                        "name": "location",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "reference",
                        "documentation": "The service delivery location or facility in which the vaccine was / was to be administered"
                    }, {
                        "name": "reason",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "Why immunization occurred"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "reference",
                        "documentation": "The subject of the vaccination event / refusal"
                    }, {
                        "name": "reaction-date",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "date",
                        "documentation": "When did reaction start?"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "date",
                        "documentation": "Vaccination  Administration / Refusal Date"
                    }, {
                        "name": "lot-number",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "string",
                        "documentation": "Vaccine Lot Number"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "manufacturer",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "reference",
                        "documentation": "Vaccine Manufacturer"
                    }, {
                        "name": "performer",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "reference",
                        "documentation": "The practitioner who administered the vaccination"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "refused",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "Was immunization refused?"
                    }, {
                        "name": "refusal-reason",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "Explanation of refusal / exemption"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Immunization",
                        "type": "token",
                        "documentation": "Business identifier"
                    }]
                }, {
                    "type": "ImmunizationRecommendation",
                    "profile": {
                        "reference": "http://hl7.org/fhir/ImmunizationRecommendation"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "information",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "reference",
                        "documentation": "Patient observations supporting recommendation"
                    }, {
                        "name": "dose-sequence",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "token",
                        "documentation": "Number of dose within sequence"
                    }, {
                        "name": "support",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "reference",
                        "documentation": "Past immunizations supporting recommendation"
                    }, {
                        "name": "vaccine-type",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "token",
                        "documentation": "Vaccine recommendation applies to"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "token",
                        "documentation": "Vaccine administration status"
                    }, {
                        "name": "dose-number",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "number",
                        "documentation": "Recommended dose number"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "reference",
                        "documentation": "Who this profile is for"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "date",
                        "documentation": "Date recommendation created"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/ImmunizationRecommendation",
                        "type": "token",
                        "documentation": "Business identifier"
                    }]
                }, {
                    "type": "List",
                    "profile": {
                        "reference": "http://hl7.org/fhir/List"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "source",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "reference",
                        "documentation": "Who and/or what defined the list contents"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "reference",
                        "documentation": "If all resources have the same subject"
                    }, {
                        "name": "item",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "reference",
                        "documentation": "Actual entry"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "token",
                        "documentation": "What the purpose of this list is"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "date",
                        "documentation": "When the list was prepared"
                    }, {
                        "name": "empty-reason",
                        "definition": "http://hl7.org/fhir/profiles/List",
                        "type": "token",
                        "documentation": "Why list is empty"
                    }]
                }, {
                    "type": "Location",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Location"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "near",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "The coordinates expressed as [lat],[long] (using KML, see notes) to find locations near to (servers may search using a square rather than a circle for efficiency)"
                    }, {
                        "name": "partof",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "reference",
                        "documentation": "The location of which this location is a part"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "Searches for locations with a specific kind of status"
                    }, {
                        "name": "address",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "string",
                        "documentation": "A (part of the) address of the location"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "string",
                        "documentation": "A (portion of the) name of the location"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "near-distance",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "A distance quantity to limit the near search to locations within a specific distance"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "A code for the type of location"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Location",
                        "type": "token",
                        "documentation": "Unique code or number identifying the location to its users"
                    }]
                }, {
                    "type": "Media",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Media"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "reference",
                        "documentation": "Who/What this Media is a record of"
                    }, {
                        "name": "subtype",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "token",
                        "documentation": "The type of acquisition equipment/process"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "view",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "token",
                        "documentation": "Imaging view e.g Lateral or Antero-posterior"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "date",
                        "documentation": "When the media was taken/recorded (end)"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "token",
                        "documentation": "photo | video | audio"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "token",
                        "documentation": "Identifier(s) for the image"
                    }, {
                        "name": "operator",
                        "definition": "http://hl7.org/fhir/profiles/Media",
                        "type": "reference",
                        "documentation": "The person who generated the image"
                    }]
                }, {
                    "type": "Medication",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Medication"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "content",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "reference",
                        "documentation": "A product in the package"
                    }, {
                        "name": "form",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "token",
                        "documentation": "powder | tablets | carton +"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "container",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "token",
                        "documentation": "E.g. box, vial, blister-pack"
                    }, {
                        "name": "manufacturer",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "reference",
                        "documentation": "Manufacturer of the item"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "string",
                        "documentation": "Common / Commercial name"
                    }, {
                        "name": "ingredient",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "reference",
                        "documentation": "The product contained"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/Medication",
                        "type": "token",
                        "documentation": "Codes that identify this medication"
                    }]
                }, {
                    "type": "MedicationAdministration",
                    "profile": {
                        "reference": "http://hl7.org/fhir/MedicationAdministration"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "medication",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "reference",
                        "documentation": "Return administrations of this medication"
                    }, {
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "reference",
                        "documentation": "The identity of a patient to list administrations  for"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "token",
                        "documentation": "MedicationAdministration event status (for example one of active/paused/completed/nullified)"
                    }, {
                        "name": "prescription",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "reference",
                        "documentation": "The identity of a prescription to list administrations from"
                    }, {
                        "name": "device",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "reference",
                        "documentation": "Return administrations with this administration device identity"
                    }, {
                        "name": "notgiven",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "token",
                        "documentation": "Administrations that were not made"
                    }, {
                        "name": "whengiven",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "date",
                        "documentation": "Date of administration"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "encounter",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "reference",
                        "documentation": "Return administrations that share this encounter"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/MedicationAdministration",
                        "type": "token",
                        "documentation": "Return administrations with this external identity"
                    }]
                }, {
                    "type": "MedicationDispense",
                    "profile": {
                        "reference": "http://hl7.org/fhir/MedicationDispense"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "medication",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "reference",
                        "documentation": "Returns dispenses of this medicine"
                    }, {
                        "name": "prescription",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "reference",
                        "documentation": "The identity of a prescription to list dispenses from"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "token",
                        "documentation": "Status of the dispense"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "token",
                        "documentation": "Return all dispenses of a specific type"
                    }, {
                        "name": "destination",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "reference",
                        "documentation": "Return dispenses that should be sent to a secific destination"
                    }, {
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "reference",
                        "documentation": "The identity of a patient to list dispenses  for"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "responsibleparty",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "reference",
                        "documentation": "Return all dispenses with the specified responsible party"
                    }, {
                        "name": "dispenser",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "reference",
                        "documentation": "Return all dispenses performed by a specific indiividual"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "token",
                        "documentation": "Return dispenses with this external identity"
                    }, {
                        "name": "whenprepared",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "date",
                        "documentation": "Date when medication prepared"
                    }, {
                        "name": "whenhandedover",
                        "definition": "http://hl7.org/fhir/profiles/MedicationDispense",
                        "type": "date",
                        "documentation": "Date when medication handed over to patient (outpatient setting), or supplied to ward or clinic (inpatient setting)"
                    }]
                }, {
                    "type": "MedicationPrescription",
                    "profile": {
                        "reference": "http://hl7.org/fhir/MedicationPrescription"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "medication",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "reference",
                        "documentation": "Code for medicine or text in medicine name"
                    }, {
                        "name": "datewritten",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "date",
                        "documentation": "Return prescriptions written on this date"
                    }, {
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "reference",
                        "documentation": "The identity of a patient to list dispenses  for"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "token",
                        "documentation": "Status of the prescription"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "encounter",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "reference",
                        "documentation": "Return prescriptions with this encounter identity"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/MedicationPrescription",
                        "type": "token",
                        "documentation": "Return prescriptions with this external identity"
                    }]
                }, {
                    "type": "MedicationStatement",
                    "profile": {
                        "reference": "http://hl7.org/fhir/MedicationStatement"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "medication",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "reference",
                        "documentation": "Code for medicine or text in medicine name"
                    }, {
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "reference",
                        "documentation": "The identity of a patient to list administrations  for"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "device",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "reference",
                        "documentation": "Return administrations with this administration device identity"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "when-given",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "date",
                        "documentation": "Date of administration"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/MedicationStatement",
                        "type": "token",
                        "documentation": "Return administrations with this external identity"
                    }]
                }, {
                    "type": "MessageHeader",
                    "profile": {
                        "reference": "http://hl7.org/fhir/MessageHeader"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/MessageHeader",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/MessageHeader",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }]
                }, {
                    "type": "Observation",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Observation"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "value-string",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "string",
                        "documentation": "The value of the observation, if the value is a string, and also searches in CodeableConcept.text"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "The status of the observation"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "reference",
                        "documentation": "The subject that the observation is about"
                    }, {
                        "name": "value-concept",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "The value of the observation, if the value is a CodeableConcept"
                    }, {
                        "name": "reliability",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "The reliability of the observation"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "date",
                        "documentation": "Obtained date/time. If the obtained element is a period, a date that falls in the period"
                    }, {
                        "name": "name-value-[x]",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "composite",
                        "documentation": "Both name and one of the value parameters"
                    }, {
                        "name": "related-target",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "reference",
                        "documentation": "Observation that is related to this one"
                    }, {
                        "name": "related",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "composite",
                        "documentation": "Related Observations - search on related-type and related-target together"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "specimen",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "reference",
                        "documentation": "Specimen used for this observation"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "The name of the observation type"
                    }, {
                        "name": "related-type",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "has-component | has-member | derived-from | sequel-to | replaces | qualified-by | interfered-by"
                    }, {
                        "name": "performer",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "reference",
                        "documentation": "Who and/or what performed the observation"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "value-quantity",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "quantity",
                        "documentation": "The value of the observation, if the value is a Quantity, or a SampledData (just search on the bounds of the values in sampled data)"
                    }, {
                        "name": "value-date",
                        "definition": "http://hl7.org/fhir/profiles/Observation",
                        "type": "date",
                        "documentation": "The value of the observation, if the value is a Period"
                    }]
                }, {
                    "type": "OperationOutcome",
                    "profile": {
                        "reference": "http://hl7.org/fhir/OperationOutcome"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/OperationOutcome",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/OperationOutcome",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }]
                }, {
                    "type": "Order",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Order"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "authority",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "reference",
                        "documentation": "If required by policy"
                    }, {
                        "name": "detail",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "reference",
                        "documentation": "What action is being ordered"
                    }, {
                        "name": "source",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "reference",
                        "documentation": "Who initiated the order"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "reference",
                        "documentation": "Patient this order is about"
                    }, {
                        "name": "when",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "date",
                        "documentation": "A formal schedule"
                    }, {
                        "name": "target",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "reference",
                        "documentation": "Who is intended to fulfill the order"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "when_code",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "token",
                        "documentation": "Code specifies when request should be done. The code may simply be a priority code"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Order",
                        "type": "date",
                        "documentation": "When the order was made"
                    }]
                }, {
                    "type": "OrderResponse",
                    "profile": {
                        "reference": "http://hl7.org/fhir/OrderResponse"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "fulfillment",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "reference",
                        "documentation": "Details of the outcome of performing the order"
                    }, {
                        "name": "request",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "reference",
                        "documentation": "The order that this is a response to"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "token",
                        "documentation": "pending | review | rejected | error | accepted | cancelled | replaced | aborted | complete"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "date",
                        "documentation": "When the response was made"
                    }, {
                        "name": "who",
                        "definition": "http://hl7.org/fhir/profiles/OrderResponse",
                        "type": "reference",
                        "documentation": "Who made the response"
                    }]
                }, {
                    "type": "Organization",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Organization"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "phonetic",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "string",
                        "documentation": "A portion of the organization's name using some kind of phonetic matching algorithm"
                    }, {
                        "name": "partof",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "reference",
                        "documentation": "Search all organizations that are part of the given organization"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "string",
                        "documentation": "A portion of the organization's name"
                    }, {
                        "name": "active",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "token",
                        "documentation": "Whether the organization's record is active"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "token",
                        "documentation": "A code for the type of organization"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Organization",
                        "type": "token",
                        "documentation": "Any identifier for the organization (not the accreditation issuer's identifier)"
                    }]
                }, {
                    "type": "Other",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Other"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Other",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "created",
                        "definition": "http://hl7.org/fhir/profiles/Other",
                        "type": "date",
                        "documentation": "When created"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Other",
                        "type": "reference",
                        "documentation": "Identifies the"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Other",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/Other",
                        "type": "token",
                        "documentation": "Kind of Resource"
                    }]
                }, {
                    "type": "Patient",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Patient"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "animal-breed",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "The breed for animal patients"
                    }, {
                        "name": "phonetic",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "string",
                        "documentation": "A portion of either family or given name using some kind of phonetic matching algorithm"
                    }, {
                        "name": "link",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "reference",
                        "documentation": "All patients linked to the given patient"
                    }, {
                        "name": "provider",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "reference",
                        "documentation": "The organization at which this person is a patient"
                    }, {
                        "name": "animal-species",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "The species for animal patients"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "given",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "string",
                        "documentation": "A portion of the given name of the patient"
                    }, {
                        "name": "address",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "string",
                        "documentation": "An address in any kind of address/part of the patient"
                    }, {
                        "name": "family",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "string",
                        "documentation": "A portion of the family name of the patient"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "string",
                        "documentation": "A portion of either family or given name of the patient"
                    }, {
                        "name": "telecom",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "string",
                        "documentation": "The value in any kind of telecom details of the patient"
                    }, {
                        "name": "birthdate",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "date",
                        "documentation": "The patient's date of birth"
                    }, {
                        "name": "active",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "Whether the patient record is active"
                    }, {
                        "name": "gender",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "Gender of the patient"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "language",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "Language code (irrespective of use value)"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Patient",
                        "type": "token",
                        "documentation": "A patient identifier"
                    }]
                }, {
                    "type": "Practitioner",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Practitioner"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "organization",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "reference",
                        "documentation": "The identity of the organization the practitioner represents / acts on behalf of"
                    }, {
                        "name": "phonetic",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "string",
                        "documentation": "A portion of either family or given name using some kind of phonetic matching algorithm"
                    }, {
                        "name": "given",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "string",
                        "documentation": "A portion of the given name"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "address",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "string",
                        "documentation": "An address in any kind of address/part"
                    }, {
                        "name": "family",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "string",
                        "documentation": "A portion of the family name"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "string",
                        "documentation": "A portion of either family or given name"
                    }, {
                        "name": "telecom",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "string",
                        "documentation": "The value in any kind of contact"
                    }, {
                        "name": "gender",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "token",
                        "documentation": "Gender of the practitioner"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Practitioner",
                        "type": "token",
                        "documentation": "A practitioner's Identifier"
                    }]
                }, {
                    "type": "Procedure",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Procedure"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Procedure",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Procedure",
                        "type": "reference",
                        "documentation": "The identity of a patient to list procedures  for"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Procedure",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Procedure",
                        "type": "date",
                        "documentation": "The date the procedure was performed on"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Procedure",
                        "type": "token",
                        "documentation": "Type of procedure"
                    }]
                }, {
                    "type": "Profile",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Profile"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "The current status of the profile"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "A code for the profile in the format uri::code (server may choose to do subsumption)"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "Type of resource that is constrained in the profile"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "date",
                        "documentation": "The profile publication date"
                    }, {
                        "name": "version",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "The version identifier of the profile"
                    }, {
                        "name": "publisher",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "string",
                        "documentation": "Name of the publisher of the profile"
                    }, {
                        "name": "extension",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "An extension code (use or definition)"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "valueset",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "reference",
                        "documentation": "A vocabulary binding code"
                    }, {
                        "name": "description",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "string",
                        "documentation": "Text search in the description of the profile"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "string",
                        "documentation": "Name of the profile"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Profile",
                        "type": "token",
                        "documentation": "The identifier of the profile"
                    }]
                }, {
                    "type": "Provenance",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Provenance"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "location",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "reference",
                        "documentation": "Where the activity occurred, if relevant"
                    }, {
                        "name": "start",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "date",
                        "documentation": "Starting time with inclusive boundary"
                    }, {
                        "name": "partytype",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "token",
                        "documentation": "e.g. Resource | Person | Application | Record | Document +"
                    }, {
                        "name": "target",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "reference",
                        "documentation": "Target resource(s) (usually version specific)"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "party",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "token",
                        "documentation": "Identity of agent (urn or url)"
                    }, {
                        "name": "end",
                        "definition": "http://hl7.org/fhir/profiles/Provenance",
                        "type": "date",
                        "documentation": "End time with inclusive boundary, if not ongoing"
                    }]
                }, {
                    "type": "Query",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Query"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "response",
                        "definition": "http://hl7.org/fhir/profiles/Query",
                        "type": "token",
                        "documentation": "Links response to source query"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Query",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Query",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Query",
                        "type": "token",
                        "documentation": "Links query and its response(s)"
                    }]
                }, {
                    "type": "Questionnaire",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Questionnaire"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "author",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "reference",
                        "documentation": "The author of the questionnaire"
                    }, {
                        "name": "authored",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "date",
                        "documentation": "When the questionnaire was authored"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "token",
                        "documentation": "The status of the questionnaire"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "reference",
                        "documentation": "The subject of the questionnaire"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "token",
                        "documentation": "Name of the questionnaire"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "encounter",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "reference",
                        "documentation": "Encounter during which questionnaire was authored"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Questionnaire",
                        "type": "token",
                        "documentation": "An identifier for the questionnaire"
                    }]
                }, {
                    "type": "RelatedPerson",
                    "profile": {
                        "reference": "http://hl7.org/fhir/RelatedPerson"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "reference",
                        "documentation": "The patient this person is related to"
                    }, {
                        "name": "phonetic",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "string",
                        "documentation": "A portion of name using some kind of phonetic matching algorithm"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "address",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "string",
                        "documentation": "An address in any kind of address/part"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "string",
                        "documentation": "A portion of name in any name part"
                    }, {
                        "name": "telecom",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "string",
                        "documentation": "The value in any kind of contact"
                    }, {
                        "name": "gender",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "token",
                        "documentation": "Gender of the person"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/RelatedPerson",
                        "type": "token",
                        "documentation": "A patient Identifier"
                    }]
                }, {
                    "type": "SecurityEvent",
                    "profile": {
                        "reference": "http://hl7.org/fhir/SecurityEvent"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "site",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Logical source location within the enterprise"
                    }, {
                        "name": "desc",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "string",
                        "documentation": "Instance-specific descriptor for Object"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Type/identifier of event"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "date",
                        "documentation": "Time when the event occurred on source"
                    }, {
                        "name": "reference",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "reference",
                        "documentation": "Specific instance of resource (e.g. versioned)"
                    }, {
                        "name": "identity",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Specific instance of object (e.g. versioned)"
                    }, {
                        "name": "altid",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Alternative User id e.g. authentication"
                    }, {
                        "name": "patientid",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "The id of the patient (one of multiple kinds of participations)"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "source",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "The id of source where event originated"
                    }, {
                        "name": "address",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Identifier for the network access point of the user device"
                    }, {
                        "name": "subtype",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "More specific type/id for the event"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "string",
                        "documentation": "Human-meaningful name for the user"
                    }, {
                        "name": "action",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Type of action performed during the event"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "object-type",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Object type being audited"
                    }, {
                        "name": "user",
                        "definition": "http://hl7.org/fhir/profiles/SecurityEvent",
                        "type": "token",
                        "documentation": "Unique identifier for the user"
                    }]
                }, {
                    "type": "Specimen",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Specimen"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Specimen",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "subject",
                        "definition": "http://hl7.org/fhir/profiles/Specimen",
                        "type": "reference",
                        "documentation": "The subject of the specimen"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Specimen",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }]
                }, {
                    "type": "Substance",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Substance"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "substance",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "reference",
                        "documentation": "A component of the substance"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "quantity",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "number",
                        "documentation": "Amount of substance in the package"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "type",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "token",
                        "documentation": "The type of the substance"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "token",
                        "documentation": "Identifier of the package/container"
                    }, {
                        "name": "expiry",
                        "definition": "http://hl7.org/fhir/profiles/Substance",
                        "type": "date",
                        "documentation": "When no longer valid to use"
                    }]
                }, {
                    "type": "Supply",
                    "profile": {
                        "reference": "http://hl7.org/fhir/Supply"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "patient",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "reference",
                        "documentation": "Patient for whom the item is supplied"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "requested | dispensed | received | failed | cancelled"
                    }, {
                        "name": "dispenseid",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "External identifier"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "Unique identifier"
                    }, {
                        "name": "supplier",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "reference",
                        "documentation": "Dispenser"
                    }, {
                        "name": "kind",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "The kind of supply (central, non-stock, etc)"
                    }, {
                        "name": "dispensestatus",
                        "definition": "http://hl7.org/fhir/profiles/Supply",
                        "type": "token",
                        "documentation": "in progress | dispensed | abandoned"
                    }]
                }, {
                    "type": "ValueSet",
                    "profile": {
                        "reference": "http://hl7.org/fhir/ValueSet"
                    },
                    "operation": [{
                        "code": "read"
                    }, {
                        "code": "vread"
                    }, {
                        "code": "update"
                    }, {
                        "code": "history-instance"
                    }, {
                        "code": "history-type"
                    }, {
                        "code": "create"
                    }, {
                        "code": "search-type"
                    }],
                    "searchParam": [{
                        "name": "system",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "The system for any codes defined by this value set"
                    }, {
                        "name": "_id",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "The logical resource id associated with the resource (must be supported by all servers)"
                    }, {
                        "name": "status",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "The status of the value set"
                    }, {
                        "name": "description",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "string",
                        "documentation": "Text search in the description of the value set"
                    }, {
                        "name": "name",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "string",
                        "documentation": "The name of the value set"
                    }, {
                        "name": "_language",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "The language of the resource"
                    }, {
                        "name": "code",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "A code defined in the value set"
                    }, {
                        "name": "date",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "date",
                        "documentation": "The value set publication date"
                    }, {
                        "name": "identifier",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "The identifier of the value set"
                    }, {
                        "name": "reference",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "A code system included or excluded in the value set or an imported value set"
                    }, {
                        "name": "publisher",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "string",
                        "documentation": "Name of the publisher of the value set"
                    }, {
                        "name": "version",
                        "definition": "http://hl7.org/fhir/profiles/ValueSet",
                        "type": "token",
                        "documentation": "The version identifier of the value set"
                    }]
                }],
                "operation": [{
                    "code": "transaction"
                }, {
                    "code": "history-system"
                }]
            }]
        }

    );
});
