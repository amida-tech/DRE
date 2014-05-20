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

    $scope.medications = [];
    $scope.displayVitals = false;
    $scope.vitalPredicate = "status";


    function vitalDate(inputObject) {

      //TODO:  Improve so takes highest accuracy over lowest value.
      var dateArray = [];

      for (var iResult in inputObject.vitals) {
        var currentResult = inputObject.vitals[iResult];
        if (currentResult.measuredAt) {
          for (var iDate in currentResult.measuredAt) {
            dateArray.push(currentResult.measuredAt[iDate]);
          }
        }
      }

      var minDateArray = [];

      minDateArray.push(recordFunctions.minDateFromArray(dateArray));

      inputObject.minDate = minDateArray;

    }

    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/vitals'
      }).
      success(function(data, status, headers, config) {
        $scope.vitals = data.vitals;
        if ($scope.vitals.length > 0) {
          $scope.displayVitals = true;
        } else {
          $scope.displayVitals = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.getStub = function() {
      $scope.displayVitals = true;
      $scope.vitals = [{
        "panelName": {
          "name": "Vital signs",
          "code": "46680005",
          "code_system_name": "SNOMED CT"
        },
        "vitals": [{
          "vitalName": {
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC"
          },
          "measuredAt": [{
            "date": "1999-11-14T00:00:00.000Z",
            "precision": "day"
          }],
          "physicalQuantity": {
            "value": 177,
            "unit": "cm"
          },
          "freeTextValue": "177 cm",
          "interpretations": [
            "Normal"
          ]
        }, {
          "vitalName": {
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC"
          },
          "measuredAt": [{
            "date": "1999-11-14T00:00:00.000Z",
            "precision": "day"
          }],
          "physicalQuantity": {
            "value": 86,
            "unit": "kg"
          },
          "freeTextValue": "86 kg",
          "interpretations": [
            "Normal"
          ]
        }, {
          "vitalName": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
          },
          "measuredAt": [{
            "date": "1999-11-14T00:00:00.000Z",
            "precision": "day"
          }],
          "physicalQuantity": {
            "value": 132,
            "unit": "mm[Hg]"
          },
          "freeTextValue": "132/86 mmHg",
          "interpretations": [
            "Normal"
          ]
        }]
      }, {
        "panelName": {
          "name": "Vital signs",
          "code": "46680005",
          "code_system_name": "SNOMED CT"
        },
        "vitals": [{
          "vitalName": {
            "name": "Height",
            "code": "8302-2",
            "code_system_name": "LOINC"
          },
          "measuredAt": [{
            "date": "2000-04-07T00:00:00.000Z",
            "precision": "day"
          }],
          "physicalQuantity": {
            "value": 177,
            "unit": "cm"
          },
          "freeTextValue": "177 cm",
          "interpretations": [
            "Normal"
          ]
        }, {
          "vitalName": {
            "name": "Patient Body Weight - Measured",
            "code": "3141-9",
            "code_system_name": "LOINC"
          },
          "measuredAt": [{
            "date": "2000-04-07T00:00:00.000Z",
            "precision": "day"
          }],
          "physicalQuantity": {
            "value": 88,
            "unit": "kg"
          },
          "freeTextValue": "88 kg",
          "interpretations": [
            "Normal"
          ]
        }, {
          "vitalName": {
            "name": "Intravascular Systolic",
            "code": "8480-6",
            "code_system_name": "LOINC"
          },
          "measuredAt": [{
            "date": "2000-04-07T00:00:00.000Z",
            "precision": "day"
          }],
          "physicalQuantity": {
            "value": 145,
            "unit": "mm[Hg]"
          },
          "freeTextValue": "145/88 mmHg",
          "interpretations": [
            "Normal"
          ]
        }]
      }];
    };

    $scope.getRecord();
    //$scope.getStub();

    //Restructrure Object.
    var tmpVitals = [];
    for (var i in $scope.vitals) {
      for (var iVital in $scope.vitals[i].vitals) {
        tmpVitals.push($scope.vitals[i].vitals[iVital]);
      }
    }
    $scope.vitals = tmpVitals;

    for (var iRec in $scope.vitals) {
      recordFunctions.formatDate($scope.vitals[iRec].measuredAt);
      recordFunctions.formatQuantity($scope.vitals[iRec].physicalQuantity);

    }

    //recordFunctions.formatDate($scope.vitals[i].results[iRes].measuredAt);



  }
]);