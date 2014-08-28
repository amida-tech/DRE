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

angular.module('dre.record.results', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/results', {
      templateUrl: 'templates/record/components/results.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('resultsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.results = [];
    $scope.displayResults = false;
    $scope.resultPredicate = "-date_weight";


    function resultDate(inputObject) {

      //TODO:  Improve so takes highest accuracy over lowest value.
      var dateArray = [];

      for (var iResult in inputObject.results) {
        var currentResult = inputObject.results[iResult];
        if (currentResult.date) {
          for (var iDate in currentResult.date) {
            dateArray.push(currentResult.date[iDate]);
          }
        }
      }

      var minDateArray = [];

      minDateArray.push(recordFunctions.minDateFromArray(dateArray));

      inputObject.minDate = minDateArray;
      inputObject.date_weight = inputObject.minDate && inputObject.minDate[0] && inputObject.minDate[0].date;
    }

    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/results'
      }).
      success(function(data, status, headers, config) {
        $scope.results = data.results;
        if ($scope.results.length > 0) {
          $scope.displayResults = true;
          $scope.updateField();
        } else {
          $scope.displayResults = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.updateField = function() {
      for (var i in $scope.results) {

        recordFunctions.extractName($scope.results[i], "results");
        resultDate($scope.results[i]);

        recordFunctions.formatDate($scope.results[i].minDate);
        $scope.results[i].name = recordFunctions.truncateName($scope.results[i].name);

        for (var iRes in $scope.results[i].results) {
          recordFunctions.formatQuantity($scope.results[i].results[iRes]);
          recordFunctions.formatDate($scope.results[i].results[iRes].date);
        }

      }
    
    };

    $scope.getStub = function() {
      $scope.displayResults = true;
      $scope.results = [
            {
                "identifiers": [
                    {
                        "identifier": "7d5a02b0-67a4-11db-bd13-0800200c9a66"
                    }
                ],
                "results": [
                    {
                        "identifiers": [
                            {
                                "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                            }
                        ],
                        "date": [
                            {
                                "date": "2000-03-23T14:30:00.000Z",
                                "precision": "minute"
                            }
                        ],
                        "freeTextValue": "HGB (M 13-18 g/dl; F 12-16 g/dl)",
                        "interpretations": [
                            "Normal"
                        ],
                        "name": "HGB",
                        "code": "30313-1",
                        "code_system_name": "LOINC",
                        "value": 13.2,
                        "unit": "g/dl"
                    },
                    {
                        "identifiers": [
                            {
                                "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                            }
                        ],
                        "date": [
                            {
                                "date": "2000-03-23T14:30:00.000Z",
                                "precision": "minute"
                            }
                        ],
                        "freeTextValue": "WBC (4.3-10.8 10+3/ul)",
                        "interpretations": [
                            "Normal"
                        ],
                        "name": "WBC",
                        "code": "33765-9",
                        "code_system_name": "LOINC",
                        "value": 6.7,
                        "unit": "10+3/ul"
                    },
                    {
                        "identifiers": [
                            {
                                "identifier": "107c2dc0-67a5-11db-bd13-0800200c9a66"
                            }
                        ],
                        "date": [
                            {
                                "date": "2000-03-23T14:30:00.000Z",
                                "precision": "minute"
                            }
                        ],
                        "freeTextValue": "PLT (135-145 meq/l)",
                        "interpretations": [
                            "Low"
                        ],
                        "name": "PLT",
                        "code": "26515-7",
                        "code_system_name": "LOINC",
                        "value": 123,
                        "unit": "10+3/ul"
                    }
                ],
                "name": "CBC WO DIFFERENTIAL",
                "code": "43789009",
                "code_system_name": "SNOMED CT"
            }
        ];
      $scope.updateFields();
    };

    $scope.getRecord();
    //$scope.getStub();

  }
]);