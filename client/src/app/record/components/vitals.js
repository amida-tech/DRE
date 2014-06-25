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

angular.module('dre.record.vitals', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/vitals', {
      templateUrl: 'templates/record/components/vitals.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('vitalsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.vitals = [];
    $scope.displayVitals = false;
    $scope.vitalPredicate = "-date_weight";

    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/vitals'
      }).
      success(function(data, status, headers, config) {
        $scope.vitals = data.vitals;
        if ($scope.vitals.length > 0) {
          $scope.displayVitals = true;
          $scope.updateFields();
        } else {
          $scope.displayVitals = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.updateFields = function() {
        for (var iRec in $scope.vitals) {
            recordFunctions.extractName($scope.vitals[iRec]);
            $scope.vitals[iRec].name = recordFunctions.truncateName($scope.vitals[iRec].name);
            var d = $scope.vitals[iRec].date;
            recordFunctions.formatDate(d);
            $scope.vitals[iRec].date_weight = d && d[0] && d[0].date;
            recordFunctions.formatQuantity($scope.vitals[iRec]);
        }
    };

    $scope.getStub = function() {
      $scope.displayVitals = true;
      $scope.vitals = [
            {
                "identifiers": [
                    {
                        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                    }
                ],
                "status": "completed",
                "date": [
                    {
                        "date": "1999-11-14T00:00:00.000Z",
                        "precision": "day"
                    }
                ],
                "freeTextValue": "177 cm",
                "interpretations": [
                    "Normal"
                ],
                "name": "Height",
                "code": "8302-2",
                "code_system_name": "LOINC",
                "value": 177,
                "unit": "cm"
            },
            {
                "identifiers": [
                    {
                        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                    }
                ],
                "status": "completed",
                "date": [
                    {
                        "date": "1999-11-14T00:00:00.000Z",
                        "precision": "day"
                    }
                ],
                "freeTextValue": "86 kg",
                "interpretations": [
                    "Normal"
                ],
                "name": "Patient Body Weight - Measured",
                "code": "3141-9",
                "code_system_name": "LOINC",
                "value": 86,
                "unit": "kg"
            },
            {
                "identifiers": [
                    {
                        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                    }
                ],
                "status": "completed",
                "date": [
                    {
                        "date": "1999-11-14T00:00:00.000Z",
                        "precision": "day"
                    }
                ],
                "freeTextValue": "132/86 mmHg",
                "interpretations": [
                    "Normal"
                ],
                "name": "Intravascular Systolic",
                "code": "8480-6",
                "code_system_name": "LOINC",
                "value": 132,
                "unit": "mm[Hg]"
            },
            {
                "identifiers": [
                    {
                        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                    }
                ],
                "status": "completed",
                "date": [
                    {
                        "date": "2000-04-07T00:00:00.000Z",
                        "precision": "day"
                    }
                ],
                "freeTextValue": "177 cm",
                "interpretations": [
                    "Normal"
                ],
                "name": "Height",
                "code": "8302-2",
                "code_system_name": "LOINC",
                "value": 177,
                "unit": "cm"
            },
            {
                "identifiers": [
                    {
                        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                    }
                ],
                "status": "completed",
                "date": [
                    {
                        "date": "2000-04-07T00:00:00.000Z",
                        "precision": "day"
                    }
                ],
                "freeTextValue": "88 kg",
                "interpretations": [
                    "Normal"
                ],
                "name": "Patient Body Weight - Measured",
                "code": "3141-9",
                "code_system_name": "LOINC",
                "value": 88,
                "unit": "kg"
            },
            {
                "identifiers": [
                    {
                        "identifier": "c6f88321-67ad-11db-bd13-0800200c9a66"
                    }
                ],
                "status": "completed",
                "date": [
                    {
                        "date": "2000-04-07T00:00:00.000Z",
                        "precision": "day"
                    }
                ],
                "freeTextValue": "145/88 mmHg",
                "interpretations": [
                    "Normal"
                ],
                "name": "Intravascular Systolic",
                "code": "8480-6",
                "code_system_name": "LOINC",
                "value": 145,
                "unit": "mm[Hg]"
            }
        ];
        
        $scope.updateFields();
    };

    $scope.getRecord();
    //$scope.getStub();
  }
]);