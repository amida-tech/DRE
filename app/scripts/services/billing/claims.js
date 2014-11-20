'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.billing/claims
 * @description
 * # billing/claims
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('claims', function claims() {

        this.getRecord = function(callback) {

                var tmpClaims = [{

                    "payer": [
                        "medicare"
                    ],
                    "number": "1234567890000",
                    "date_time": {
                        "low": {
                            "date": "2012-10-18T00:00:00Z",
                            "precision": "day"
                        }
                    },
                    "lines": [{
                        "line": "1",
                        "date_time": {
                        	"low": {
                            	"date": "2012-10-18T00:00:00Z",
                            	"precision": "day"
                        	},
	                        "high": {
	                            "date": "2012-10-18T00:00:00Z",
	                            "precision": "day"
	                        }
	                    },
                        "procedure": {
                            "code": "98941",
                            "description": "Chiropractic Manipulative Treatment (Cmt); Spinal, Three To Four Regions"
                        },
                        "quantity": 1,
                        "modifiers": [{
                            "code": "98941",
                            "description": "Chiropractic Manipulative Treatment (Cmt); Spinal, Three To Four Regions"
                        }],
                        "charges": {
                            "price_billed": "$60.00",
                            "insurance_paid": "$34.00"
                        },
                        "place": {
                            "code": "11",
                            "name": "Office"
                        },
                        "type": {
                            "code": "1",
                            "name": "Medical Care"
                        },
                        "rendering_provider": {
                            "number": "0000001",
                            "npi": "123456789"
                        }
                    }],
                    "charges": {
                        "price_billed": "$60.00",
                        "provider_paid": "$27.20",
                        "patient_responsibility": "$6.80"
                    },
                    "type": [
                        "medicare PartB"
                    ],
                    "diagnoses": [{
                        "code": "3534"
                    }, {
                        "code": "7393"
                    }, {
                        "code": "7392"
                    }, {
                        "code": "3533"
                    }],
                    "provider": {
                        "name": "No Information Available"
                    }
                }];

                callback(null, tmpClaims);

            }
            // AngularJS will instantiate a singleton by calling "new" on this function
    });
