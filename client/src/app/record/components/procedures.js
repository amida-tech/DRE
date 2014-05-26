/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular.module('dre.record.procedures', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/procedures', {
      templateUrl: 'templates/record/components/procedures.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('proceduresCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.procedures = [];
    $scope.displayProcedures = false;
    $scope.procedurePredicate = "status";


    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/procedures'
      }).
      success(function(data, status, headers, config) {
        $scope.procedures = data.procedures;
        if ($scope.procedures.length > 0) {
          $scope.displayProcedures = true;
          $scope.updateFields();
        } else {
          $scope.displayProcedures = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };
    
    $scope.updateFields = function() {
      for (var i in $scope.procedures) {
        recordFunctions.formatDate($scope.procedures[i].date);
        for (var proloc in $scope.procedures[i].providers) {
          recordFunctions.formatAddress($scope.procedures[i].providers[proloc].address);
        }
        for (var sloc in $scope.procedures[i].locations) {
          recordFunctions.formatAddress($scope.procedures[i].locations[sloc].addresses[0]);
        }
      }
    };

    $scope.getStub = function() {
      $scope.displayProcedures = true;
      $scope.procedures = [
        {
            "identifiers": [
                {
                    "identifier": "d68b7e32-7810-4f5b-9cc2-acd54b0fd85d"
                }
            ],
            "status": "Completed",
            "date": [
                {
                    "date": "2012-05-12T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "bodysite": [
                {
                    "name": "colon",
                    "code": "appropriate_code",
                    "code_system_name": "OID 2.16.840.1.113883.3.88.12.3221.8.9"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "1001 Village Avenue"
                        ],
                        "city": "Portland",
                        "state": "OR",
                        "zip": "99123",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "555-555-5000",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals",
                        "address": {
                            "streetLines": [
                                "1001 Village Avenue"
                            ],
                            "city": "Portland",
                            "state": "OR",
                            "zip": "99123",
                            "country": "US"
                        },
                        "telecom": {
                            "value": "555-555-5000",
                            "use": "work place"
                        }
                    }
                }
            ],
            "proc_type": "procedure",
            "name": "Colonoscopy",
            "code": "73761001",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "2.16.840.1.113883.19",
                    "identifier_type": "123456789"
                }
            ],
            "status": "Aborted",
            "date": [
                {
                    "date": "2011-02-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "bodysite": [
                {
                    "name": "Abdomen and pelvis",
                    "code": "416949008",
                    "code_system_name": "SNOMED CT"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "(555)555-555-1234",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals"
                    }
                }
            ],
            "locations": [
                {
                    "name": "Community Gastroenterology Clinic",
                    "loc_type": {
                        "name": "Gastroenterology Clinic",
                        "code": "1118-9",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "proc_type": "observation",
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        },
        {
            "identifiers": [
                {
                    "identifier": "1.2.3.4.5.6.7.8",
                    "identifier_type": "1234567"
                }
            ],
            "status": "Completed",
            "date": [
                {
                    "date": "2011-02-03T00:00:00.000Z",
                    "precision": "day"
                }
            ],
            "providers": [
                {
                    "address": {
                        "streetLines": [
                            "17 Daws Rd."
                        ],
                        "city": "Blue Bell",
                        "state": "MA",
                        "zip": "02368",
                        "country": "US"
                    },
                    "telecom": {
                        "value": "(555)555-555-1234",
                        "use": "work place"
                    },
                    "organization": {
                        "name": "Community Health and Hospitals"
                    }
                }
            ],
            "locations": [
                {
                    "name": "Community Gastroenterology Clinic",
                    "loc_type": {
                        "name": "Gastroenterology Clinic",
                        "code": "1118-9",
                        "code_system_name": "HealthcareServiceLocation"
                    },
                    "addresses": [
                        {
                            "streetLines": [
                                "17 Daws Rd."
                            ],
                            "city": "Blue Bell",
                            "state": "MA",
                            "zip": "02368",
                            "country": "US"
                        }
                    ]
                }
            ],
            "proc_type": "act",
            "name": "Colonic polypectomy",
            "code": "274025005",
            "code_system_name": "SNOMED CT"
        }
    ];
      $scope.updateFields();
    };

    $scope.getRecord();
    //$scope.getStub();

  }
]);