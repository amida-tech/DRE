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

        var tmpMetaData = [{
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [],
            'type': 'insurance'
        },{
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [],
            'type': 'insurance'
        },{
            'attribution': [{
                'source': 'blue-button.xml',
                'status': 'new',
                'merged': '2007-05-01T00:00:00Z'
            }],
            'comments': [{
                'comment': "This insurance is no longer valid since I don't work for the state anymore.",
                'date': '2014-05-03T00:12:00Z',
                'starred': true
            }],
            'type': 'insurance'
        }];

        var tmpInsurance = [{
            "plan_id": "H9999/9999",
            "name": "Medicare",
            "type": [
                "medicare",
                "A Medicare Plan Plus (HMO)",
                "3 - Coordinated Care Plan (HMO, PPO, PSO, SNP)"
            ]
        }, {
            "plan_id": "S9999/000",
            "name": "Blue Cross/Blue Shield",
            "type": [
                "BCBS",
                "Blue Cross Blue Shield Silver (PPO)",
                "9 - Silver Plan"
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

            _.each(tmpInsurance, function (entry, entryIndex) {

                var tmpReturn = {
                    'metadata': angular.copy(tmpMetaData[entryIndex]),
                    'data': entry
                };

                returnArray.push(tmpReturn);

            });

            callback(null, returnArray);
        }
    });