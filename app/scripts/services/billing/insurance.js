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

        var tmpMetaData = {
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': 'I should make sure I let my aunt know about this!',
                'date': '2005-05-01T00:12:00Z',
                'starred': true
            }, {
                'comment': 'Remember Macrolides are a good alternative.',
                'date': '2009-05-18T00:08:00Z',
                'starred': false
            }]
        };

        var tmpInsurance = [{
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

        var getRecordMeta = function (callback) {
            callback(null, tmpMetaData);
        }

        this.getRecordMeta = getRecordMeta;

        this.getRecord = function (callback) {

            var returnArray = [];

            _.each(tmpInsurance, function (entry) {

                var tmpReturn = {
                    'metadata': angular.copy(tmpMetaData),
                    'data': entry
                };

                returnArray.push(tmpReturn);

            });

            callback(null, returnArray);
        }
    });