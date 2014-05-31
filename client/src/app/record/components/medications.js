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

angular.module('dre.record.medications', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/medications', {
      templateUrl: 'templates/record/components/medications.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('medicationsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.medications = [];
    $scope.displayMedications = false;
    $scope.medicationPredicate = "-status";


    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/medications'
      }).
      success(function(data, status, headers, config) {
        $scope.medications = data.medications;
        if ($scope.medications.length > 0) {
          $scope.displayMedications = true;
          $scope.updateFields();
        } else {
          $scope.displayMedications = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.updateFields = function() {
      for (var i in $scope.medications) {
        $scope.medications[i].name = recordFunctions.truncateName($scope.medications[i].product.name);
        recordFunctions.formatDate($scope.medications[i].date);
      }
    };

    $scope.getStub = function() {
      $scope.displayMedications = true;
      $scope.medications = [{
        "date": [
          {
            "date": "2007-01-03T00:00:00.000Z",
            "precision": "day"
          }, {
            "date": "2012-05-15T00:00:00.000Z",
            "precision": "day"
          }
        ],
        "identifiers": [{
          "identifier": "cdbd33f0-6cde-11db-9fe1-0800200c9a66"
        }],
        "status": "Completed",
        "sig": "Proventil HFA\n\t\t\t\t\t\t\t\t\t\t\t",
        "product": {
          "name": "Proventil HFA",
          "code": "219483",
          "code_system_name": "RXNORM",
          "translations": [{
            "name": "Proventil 0.09 MG/ACTUAT inhalant solution",
            "code": "573621",
            "code_system_name": "RXNORM"
          }],
          "unencoded_name": "Proventil HFA\n\t\t\t\t\t\t\t\t\t\t\t",
          "identifers": {
            "identifier": "2a620155-9d11-439e-92b3-5d9815ff4ee8"
          }
        },
        "administration": {
          "route": {
            "name": "RESPIRATORY (INHALATION)",
            "code": "C38216",
            "code_system_name": "Medication Route FDA"
          },
          "form": {
            "name": "INHALANT",
            "code": "C42944",
            "code_system_name": "Medication Route FDA"
          },
          "dose": {
            "value": 1,
            "unit": "mg/actuat"
          },
          "rate": {
            "value": 90,
            "unit": "ml/min"
          }
        },
        "precondition": {
          "code": {
            "code": "ASSERTION",
            "code_system_name": "HL7ActCode"
          },
          "value": {
            "name": "Wheezing",
            "code": "56018004",
            "code_system_name": "SNOMED CT"
          }
        }
      }];
      $scope.updateFields();
    };

    $scope.getRecord();
    //$scope.getStub();

  }
]);