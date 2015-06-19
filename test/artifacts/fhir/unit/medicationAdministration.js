"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "resource": {
        "id": "MedicationPrescription/ma-0-0",
        "resourceType": "MedicationPrescription",
        "status": "active",
        "patient": na,
        "dateWritten": "2012-08-06",
        "dosageInstruction": [{
            "route": {
                "coding": [{
                    "code": "C38216",
                    "system": "urn:oid:2.16.840.1.113883.3.26.1.1",
                    "display": "RESPIRATORY (INHALATION)"
                }],
                "text": "RESPIRATORY (INHALATION)"
            },
            "doseQuantity": {
                "value": 0.09,
                "units": "mg/actuat",
                "code": "mg/actuat",
                "system": "http://unitsofmeasure.org"
            },
            "timingSchedule": {
                "event": [{
                    "start": "2012-08-06"
                }],
                "repeat": {
                    "frequency": 1,
                    "duration": 12,
                    "units": "h",
                    "end": "2012-08-13"
                }
            },
            "asNeededCodeableConcept": {
                "coding": [{
                    "system": "http://snomed.info/sct",
                    "code": "56018004",
                    "display": "Wheezing"
                }],
                "text": na
            }
        }],
        "text": {
            "status": "generated",
            "div": "Albuterol 0.09 MG/ACTUAT inhalant solution"
        },
        "contained": [{
            "resourceType": "Medication",
            "id": "med",
            "name": "Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "573621",
                    "display": "Albuterol 0.09 MG/ACTUAT inhalant solution"
                }],
                "text": na
            }
        }],
        "medication": {
            "reference": "#med",
            "display": "Albuterol 0.09 MG/ACTUAT inhalant solution"
        }
    }
}, {
    "resource": {
        "id": "MedicationAdministration/ma-0-1",
        "resourceType": "MedicationAdministration",
        "status": "completed",
        "patient": na,
        "practitioner": {
            "reference": "Practitioner/unknown",
            "display": "Unknown"
        },
        "whenGiven": {
            "start": "2012-08-06",
            "end": "2012-08-13"
        },
        "dosage": [{
            "route": {
                "coding": [{
                    "code": "C38216",
                    "system": "urn:oid:2.16.840.1.113883.3.26.1.1",
                    "display": "RESPIRATORY (INHALATION)"
                }],
                "text": "RESPIRATORY (INHALATION)"
            },
            "quantity": {
                "value": 0.09,
                "units": "mg/actuat",
                "code": "mg/actuat",
                "system": "http://unitsofmeasure.org"
            },
            "timingPeriod": {
                "start": "2012-08-06",
                "end": "2012-08-13"
            },
            "asNeededCodeableConcept": {
                "coding": [{
                    "system": "http://snomed.info/sct",
                    "code": "56018004",
                    "display": "Wheezing"
                }],
                "text": na
            }
        }],
        "prescription": {
            "reference": "MedicationPrescription/ma-0-0",
            "display": "Albuterol 0.09 MG/ACTUAT inhalant solution"
        },
        "medication": {
            "reference": "#med",
            "display": "Albuterol 0.09 MG/ACTUAT inhalant solution"
        },
        "contained": [{
            "resourceType": "Medication",
            "id": "med",
            "name": "Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "573621",
                    "display": "Albuterol 0.09 MG/ACTUAT inhalant solution"
                }],
                "text": na
            }
        }]
    }
}];

cases[0].input = cases[0].resources[1];

cases[0].result = {
    "date_time": {
        "low": {
            "date": "2012-08-06T00:00:00.000Z",
            "precision": "day"
        },
        "high": {
            "date": "2012-08-13T00:00:00.000Z",
            "precision": "day"
        }
    },
    "sig": "Albuterol 0.09 MG/ACTUAT inhalant solution",
    "status": "Completed",
    "product": {
        "product": {
            "name": "Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": "573621",
            "code_system_name": "RXNORM"
        }
    },
    "administration": {
        "route": {
            "name": "RESPIRATORY (INHALATION)",
            "code": "C38216",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 0.09,
            "unit": "mg/actuat"
        },
        "interval": {
            "period": {
                "value": 12,
                "unit": "h"
            },
            "frequency": true
        }
    },
    "precondition": {
        "value": {
            "name": "Wheezing",
            "code": "56018004",
            "code_system_name": "SNOMED CT"
        }
    }
};
