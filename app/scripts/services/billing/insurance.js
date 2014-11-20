'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.billing/insurance
 * @description
 * # billing/insurance
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('insurance', function insurance() {

        this.getRecord = function(callback) {

            var tmpInsurance = [
            {
                "plan_id": "H9999/9999",
                "name": "HealthCare Payer",
                "type": [
                    "medicare",
                    "A Medicare Plan Plus (HMO)",
                    "3 - Coordinated Care Plan (HMO, PPO, PSO, SNP)"
                ]
            }, {
                "plan_id": "S9999/000",
                "name": "Another HealthCare Payer",
                "type": [
                    "medicare",
                    "A Medicare Rx Plan (PDP)",
                    "11 - Medicare Prescription Drug Plan"
                ]
            }, {
                "name": "STATE HEALTH BENEFITS PROGRAM",
                "type": [
                    "employer subsidy"
                ],
                "date": [{
                    "date": "2011-01-01T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2011-12-31T00:00:00Z",
                    "precision": "day"
                }]
            }, {
                "type": "medicare msp:End stage Renal Disease (ESRD)",
                "policy_number": "1234567890",
                "payer_name": "Insurer1",
                "date": [{
                    "date": "2011-01-01T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2011-09-30T00:00:00Z",
                    "precision": "day"
                }],
                "addresses": [{
                    "use": "primary",
                    "streetLines": [
                        "PO BOX 0000"
                    ],
                    "city": "Anytown",
                    "state": "CO",
                    "zip": "00002-0000",
                    "country": "United States"
                }]
            }, {
                "type": "medicare msp:End stage Renal Disease (ESRD)",
                "policy_number": "12345678901",
                "payer_name": "Insurer2",
                "date": [{
                    "date": "2010-01-01T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2010-12-31T00:00:00Z",
                    "precision": "day"
                }],
                "addresses": [{
                    "use": "primary",
                    "streetLines": [
                        "0000 Any ROAD"
                    ],
                    "city": "ANYWHERE",
                    "state": "VA",
                    "zip": "00000-0000",
                    "country": "United States"
                }]
            }, {
                "type": "medicare msp",
                "policy_number": "00001",
                "payer_name": "Insurer",
                "date": [{
                    "date": "1984-10-01T00:00:00Z",
                    "precision": "day"
                }, {
                    "date": "2008-11-30T00:00:00Z",
                    "precision": "day"
                }],
                "addresses": [{
                    "use": "primary",
                    "streetLines": [
                        "00 Address STREET"
                    ],
                    "city": "ANYWHERE",
                    "state": "PA",
                    "zip": "00000",
                    "country": "United States"
                }]
            }];

                callback(null, tmpInsurance);
    }
});
