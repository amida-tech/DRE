"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "resource": {
        "id": "AdverseReaction/a-0-0",
        "resourceType": "AdverseReaction",
        "subject": na,
        "symptom": [{
            "severity": "minor",
            "code": {
                "coding": [{
                    "code": "267036007",
                    "system": "http://snomed.info/sct",
                    "display": "Shortness of Breath"
                }],
                "text": na
            }
        }],
        "didNotOccurFlag": false
    }
}, {
    "resource": {
        "id": "AllergyIntolerance/a-0-1",
        "resourceType": "AllergyIntolerance",
        "criticality": "medium",
        "sensitivityType": "allergy",
        "recordedDate": "2006-05-01",
        "status": "confirmed",
        "subject": na,
        "substance": {
            "reference": "Substance/a-0-2",
            "display": na
        },
        "reaction": [{
            "reference": "AdverseReaction/a-0-0",
            "display": na
        }]
    }
}, {
    "resource": {
        "id": "Substance/a-0-2",
        "resourceType": "Substance",
        "text": na,
        "type": {
            "coding": [{
                "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                "code": "2670",
                "display": "Codeine"
            }],
            "text": na
        }
    }
}];

cases[0].input = cases[0].resources[1];

cases[0].result = {
    "date_time": {
        "low": {
            "date": "2006-05-01T00:00:00.000Z",
            "precision": "day"
        }
    },
    "observation": {
        "allergen": {
            "name": "Codeine",
            "code": "2670",
            "code_system_name": "RXNORM"
        },
        "status": {
            "name": "Active",
            "code": "55561003",
            "code_system_name": "SNOMED CT"
        },
        "reactions": [{
            "reaction": {
                "name": "Shortness of Breath",
                "code": "267036007",
                "code_system_name": "SNOMED CT"
            },
            "severity": {
                "code": {
                    "name": "Mild",
                    "code": "255604002",
                    "code_system_name": "SNOMED CT"
                }
            }
        }],
        "severity": {
            "code": {
                "name": "Moderate",
                "code": "6736007",
                "code_system_name": "SNOMED CT"
            }
        }
    }
};

cases[1] = {};

cases[1].resources = [{
    "resource": {
        "id": "AdverseReaction/a-1-0",
        "resourceType": "AdverseReaction",
        "subject": na,
        "symptom": [{
            "severity": "minor",
            "code": {
                "coding": [{
                    "code": "267036007",
                    "system": "http://snomed.info/sct",
                    "display": "Shortness of Breath"
                }],
                "text": "Shortness of Breath"
            }
        }],
        "didNotOccurFlag": false
    }
}, {
    "resource": {
        "id": "AllergyIntolerance/a-1-1",
        "resourceType": "AllergyIntolerance",
        "criticality": "medium",
        "sensitivityType": "allergy",
        "recordedDate": "2006-05-01",
        "status": "confirmed",
        "subject": na,
        "substance": {
            "reference": "#allergen",
            "display": "Codeine"
        },
        "contained": [{
            "resourceType": "Substance",
            "id": "allergen",
            "type": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "DUMMY_CODE",
                    "display": "Codeine"
                }],
                "text": "Codeine"
            }
        }],
        "reaction": [{
            "reference": "AdverseReaction/a-1-0",
            "display": "Shortness of Breath"
        }]
    }
}];

cases[1].input = cases[1].resources[1];

cases[1].result = {
    "date_time": {
        "low": {
            "date": "2006-05-01T00:00:00.000Z",
            "precision": "day"
        }
    },
    "observation": {
        "allergen": {
            "name": "Codeine",
            "code": "DUMMY_CODE",
            "code_system_name": "RXNORM"
        },
        "status": {
            "name": "Active",
            "code": "55561003",
            "code_system_name": "SNOMED CT"
        },
        "reactions": [{
            "reaction": {
                "name": "Shortness of Breath",
                "code": "267036007",
                "code_system_name": "SNOMED CT"
            },
            "severity": {
                "code": {
                    "name": "Mild",
                    "code": "255604002",
                    "code_system_name": "SNOMED CT"
                }
            }
        }],
        "severity": {
            "code": {
                "name": "Moderate",
                "code": "6736007",
                "code_system_name": "SNOMED CT"
            }
        }
    }
};
