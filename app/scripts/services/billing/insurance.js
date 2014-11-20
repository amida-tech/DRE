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
                "date_time": {
	                "low": {
	                    "date": "2011-01-01T00:00:00Z",
	                    "precision": "day"
	                }, 
	                "high": {
	                    "date": "2011-12-31T00:00:00Z",
	                    "precision": "day"
	                }
            	}
            }];

                callback(null, tmpInsurance);
    }
});
