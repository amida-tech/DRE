"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "resource": {
        "id": "Observation/ov-0-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8302-2",
                "display": "Height"
            }],
            "text": "Height"
        },
        "valueQuantity": {
            "value": 71,
            "units": "[in_us]",
            "code": "[in_us]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-05-15",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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
    "vital": {
        "name": "Height",
        "code": "8302-2",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-05-15T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 71,
    "unit": "[in_us]"
};

cases[1] = {};

cases[1].resources = [{
    "resource": {
        "id": "Observation/ov-1-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "3141-9",
                "display": "Patient Body Weight - Measured"
            }],
            "text": "Patient Body Weight - Measured"
        },
        "valueQuantity": {
            "value": 160,
            "units": "[lb_av]",
            "code": "[lb_av]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-05-15",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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

cases[1].input = cases[1].resources[0];

cases[1].result = {
    "vital": {
        "name": "Patient Body Weight - Measured",
        "code": "3141-9",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-05-15T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 160,
    "unit": "[lb_av]"
};

cases[2] = {};

cases[2].resources = [{
    "resource": {
        "id": "Observation/ov-2-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "39156-5",
                "display": "BMI (Body Mass Index)"
            }],
            "text": "BMI (Body Mass Index)"
        },
        "valueQuantity": {
            "value": 22.32,
            "units": "kg/m2",
            "code": "kg/m2",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-05-15",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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

cases[2].input = cases[2].resources[0];

cases[2].result = {
    "vital": {
        "name": "BMI (Body Mass Index)",
        "code": "39156-5",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-05-15T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 22.32,
    "unit": "kg/m2"
};

cases[3] = {};

cases[3].resources = [{
    "resource": {
        "id": "Observation/ov-3-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8480-6",
                "display": "BP Systolic"
            }],
            "text": "BP Systolic"
        },
        "valueQuantity": {
            "value": 120,
            "units": "mm[Hg]",
            "code": "mm[Hg]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-05-15",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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

cases[3].input = cases[3].resources[0];

cases[3].result = {
    "vital": {
        "name": "BP Systolic",
        "code": "8480-6",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-05-15T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 120,
    "unit": "mm[Hg]"
};

cases[4] = {};

cases[4].resources = [{
    "resource": {
        "id": "Observation/ov-4-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8480-6",
                "display": "BP Systolic"
            }],
            "text": "BP Systolic"
        },
        "valueQuantity": {
            "value": 150,
            "units": "mm[Hg]",
            "code": "mm[Hg]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-06-16",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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

cases[4].input = cases[4].resources[0];

cases[4].result = {
    "vital": {
        "name": "BP Systolic",
        "code": "8480-6",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-06-16T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 150,
    "unit": "mm[Hg]"
};

cases[5] = {};

cases[5].resources = [{
    "resource": {
        "id": "Observation/ov-5-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8462-4",
                "display": "BP Diastolic"
            }],
            "text": "BP Diastolic"
        },
        "valueQuantity": {
            "value": 75,
            "units": "mm[Hg]",
            "code": "mm[Hg]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-06-16",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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

cases[5].input = cases[5].resources[0];

cases[5].result = {
    "vital": {
        "name": "BP Diastolic",
        "code": "8462-4",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-06-16T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 75,
    "unit": "mm[Hg]"
};

cases[6] = {};

cases[6].resources = [{
    "resource": {
        "id": "Observation/ov-6-0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8462-4",
                "display": "BP Diastolic"
            }],
            "text": "BP Diastolic"
        },
        "valueQuantity": {
            "value": 70,
            "units": "mm[Hg]",
            "code": "mm[Hg]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-05-15",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
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

cases[6].input = cases[6].resources[0];

cases[6].result = {
    "vital": {
        "name": "BP Diastolic",
        "code": "8462-4",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-05-15T00:00:00.000Z",
            "precision": "day"
        }
    },
    "interpretations": [
        "Normal"
    ],
    "value": 70,
    "unit": "mm[Hg]"
};

cases[7] = {};

cases[7].resources = [{
    "resource": {
        "id": "Observation/0",
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8284-2",
                "display": "Whole body Maximum circumference"
            }],
            "text": "Whole body Maximum circumference"
        },
        "valueQuantity": {
            "value": 51.5,
            "units": "[in_us]",
            "code": "[in_us]",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2014-05-15",
        "status": "final",
        "reliability": "ok",
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "8716-3",
                "display": "Vital signs",
                "system": "http://loinc.org"
            }
        }],
        "subject": {
            "reference": "Patient/add70d80-2f87-11e4-a02b-699a62c7658f",
            "display": "PAC-PATRU TESTPATRU X"
        }
    }
}];

cases[7].input = cases[7].resources[0];

cases[7].result = {
    "vital": {
        "name": "Whole body Maximum circumference",
        "code": "8284-2",
        "code_system_name": "LOINC"
    },
    "date_time": {
        "point": {
            "date": "2014-05-15T00:00:00.000Z",
            "precision": "day"
        }
    },
    "value": 51.5,
    "unit": "[in_us]"
};
