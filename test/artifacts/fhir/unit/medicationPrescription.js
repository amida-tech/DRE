"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "resource": {
        "id": "MedicationPrescription/mp-0-0",
        "resourceType": "MedicationPrescription",
        "status": "completed",
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
                "text": "Wheezing"
            }
        }],
        "text": {
            "status": "generated",
            "div": "Albuterol 0.09 MG/ACTUAT inhalant solution"
        },
        "medication": {
            "reference": "Medication/mp-0-1"
        }
    }
}, {
    "resource": {
        "id": "Medication/mp-0-1",
        "resourceType": "Medication",
        "text": {
            "status": "generated",
            "div": "<div><p><br/><b>Generated Narrative</b></p><br/><p><b>name</b>: Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]</p><br/><p><b>code</b>:<span title=\"Codes: {http://www.nlm.nih.gov/research/umls/rxnorm 351656}\">Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]</span></p><br/><p><b>isBrand</b>:true</p><br/><p><b>kind</b>: product</p><br/><p><b>product</b></p><br/><p><b>form</b>: <span title=\"Codes: {http://www.nlm.nih.gov/research/umls/rxnorm 346161}\">Inhalant Solution</span> </p></div>"
        },
        "name": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]",
        "code": {
            "coding": [{
                "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                "code": "351656",
                "display": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]"
            }],
            "text": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]"
        },
        "isBrand": true,
        "kind": "product",
        "product": {
            "form": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "346161",
                    "display": "Inhalant Solution"
                }]
            }
        }
    }
}];

cases[0].input = cases[0].resources[0];

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
    "status": "Prescribed",
    "sig": "Albuterol 0.09 MG/ACTUAT inhalant solution",
    "product": {
        "product": {
            "name": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]",
            "code": "351656",
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

cases[1] = {};

cases[1].resources = [{
    "resource": {
        "id": "MedicationPrescription/mp-1-0",
        "resourceType": "MedicationPrescription",
        "status": "active",
        "patient": na,
        "dateWritten": "2014-10-03T03:59:00.000Z",
        "dosageInstruction": [{
            "timingDateTime": "2014-10-03T03:59:00.000Z"
        }],
        "contained": [{
            "resourceType": "Medication",
            "id": "med",
            "name": "0-Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "573621",
                    "display": "0-Albuterol 0.09 MG/ACTUAT inhalant solution"
                }],
                "text": "0-Albuterol 0.09 MG/ACTUAT inhalant solution"
            }
        }],
        "medication": {
            "reference": "#med",
            "display": "0-Albuterol 0.09 MG/ACTUAT inhalant solution"
        }
    }
}];

cases[1].input = cases[1].resources[0];

cases[1].result = {
    "date_time": {
        "point": {
            "date": "2014-10-03T03:59:00.000Z",
            "precision": "second"
        }
    },
    "status": "Prescribed",
    "product": {
        "product": {
            "name": "0-Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": "573621",
            "code_system_name": "RXNORM"
        }
    }
};

cases[2] = {};

cases[2].resources = [{
    "resource": {
        "id": "MedicationPrescription/mp-2-0",
        "resourceType": "MedicationPrescription",
        "status": "completed",
        "patient": na,
        "dateWritten": "2012-08-06",
        "dosageInstruction": [{
            "timingSchedule": {
                "event": [{
                    "start": "2012-08-06"
                }],
                "repeat": {
                    "when": "HS",
                    "end": "2012-08-30",
                    "duration": 1,
                    "units": "s"
                }
            }
        }],
        "contained": [{
            "resourceType": "Medication",
            "id": "med",
            "name": "7-Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "573621",
                    "display": "7-Albuterol 0.09 MG/ACTUAT inhalant solution"
                }],
                "text": "7-Albuterol 0.09 MG/ACTUAT inhalant solution"
            }
        }],
        "medication": {
            "reference": "#med",
            "display": "7-Albuterol 0.09 MG/ACTUAT inhalant solution"
        }
    }
}];

cases[2].input = cases[2].resources[0];

cases[2].result = {
    "date_time": {
        "low": {
            "date": "2012-08-06T00:00:00.000Z",
            "precision": "day"
        },
        "high": {
            "date": "2012-08-30T00:00:00.000Z",
            "precision": "day"
        }
    },
    "status": "Prescribed",
    "product": {
        "product": {
            "name": "7-Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": "573621",
            "code_system_name": "RXNORM"
        }
    },
    "administration": {
        "interval": {
            "event": "at bedtime"
        }
    }
};

cases[3] = {};

cases[3].resources = [{
    "resource": {
        "id": "MedicationPrescription/mp-3-0",
        "resourceType": "MedicationPrescription",
        "status": "active",
        "patient": na,
        "dateWritten": "2012-08-06",
        "dosageInstruction": [{
            "timingPeriod": {
                "start": "2012-08-06",
                "end": "2012-08-30"
            }
        }],
        "contained": [{
            "resourceType": "Medication",
            "id": "med",
            "name": "1-Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "573621",
                    "display": "1-Albuterol 0.09 MG/ACTUAT inhalant solution"
                }],
                "text": "1-Albuterol 0.09 MG/ACTUAT inhalant solution"
            }
        }],
        "medication": {
            "reference": "#med",
            "display": "1-Albuterol 0.09 MG/ACTUAT inhalant solution"
        }
    }
}];

cases[3].input = cases[3].resources[0];

cases[3].result = {
    "date_time": {
        "low": {
            "date": "2012-08-06T00:00:00.000Z",
            "precision": "day"
        },
        "high": {
            "date": "2012-08-30T00:00:00.000Z",
            "precision": "day"
        }
    },
    "status": "Prescribed",
    "product": {
        "product": {
            "name": "1-Albuterol 0.09 MG/ACTUAT inhalant solution",
            "code": "573621",
            "code_system_name": "RXNORM"
        }
    }
};
