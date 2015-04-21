"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "resource": {
        "id": "Observation/ors-0-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "15218-1",
                "display": "Food Allerg Mix2 IgE Ql"
            }],
            "text": "Food Allerg Mix2 IgE Ql"
        },
        "valueString": "negative",
        "issued": "2012-08-10",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "11502-2",
                "display": "Laboratory report",
                "system": "http://loinc.org"
            }
        }],
        "interpretation": {
            "coding": [{
                "system": "http://hl7.org/fhir/v2/0078",
                "code": "N",
                "display": "Normal"
            }],
            "text": "Normal"
        }
    }
}];

cases[0].input = cases[0].resources[0];

cases[0].result = {
    "result_set": {
        "name": "Food Allerg Mix2 IgE Ql",
        "code": "15218-1",
        "code_system_name": "LOINC"
    },
    "results": [{
        "result": {
            "name": "Food Allerg Mix2 IgE Ql",
            "code": "15218-1",
            "code_system_name": "LOINC"
        },
        "date_time": {
            "point": {
                "date": "2012-08-10T00:00:00.000Z",
                "precision": "day"
            }
        },
        "status": "completed",
        "text": "negative",
        "interpretations": [
            "Normal"
        ]
    }]
};
