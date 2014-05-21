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

angular.module('dre.record.problems', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/problems', {
      templateUrl: 'templates/record/components/problems.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('problemsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.medications = [];
    $scope.displayProblems = false;
    $scope.procedurePredicate = "status";


    function problemStatus (inputObject) {

      if(inputObject.status.toLowerCase() === 'active') {
        inputObject.statusFlag = true;
      }

      if(inputObject.status.toLowerCase() === 'resolved') {
        inputObject.statusFlag = false;
      }

    }

    function onsetAge (inputObject) {
      if(inputObject.onset_age && inputObject.onset_age_unit) {
          if (inputObject.onset_age_unit.toLowerCase() === "year") {
            inputObject.onsetAgeDisplay = inputObject.onset_age; 
          } else {
            inputObject.onsetAgeDisplay = inputObject.onset_age + " " + inputObject.onset_age_unit; 
          }
          
      } else if (inputObject.onset_age) {
          inputObject.onsetAgeDisplay = inputObject.onset_age;
      }
    }

    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/problems'
      }).
      success(function(data, status, headers, config) {
        $scope.problems = data.problems;
        if ($scope.problems.length > 0) {
          $scope.displayProblems = true;
        } else {
          $scope.displayProblems = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.getStub = function() {
      $scope.displayProblems = true;
      $scope.problems = [{
        "date": [{
          "date": "2008-01-03T00:00:00.000Z",
          "precision": "day"
        }, {
          "date": "2008-01-03T00:00:00.000Z",
          "precision": "day"
        }],
        "identifiers": [{
          "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Resolved",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
          "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }],
        "name": "Pneumonia",
        "code": "233604007",
        "code_system_name": "SNOMED CT"
      }, {
        "date": [{
          "date": "2007-01-03T00:00:00.000Z",
          "precision": "day"
        }, {
          "date": "2008-01-03T00:00:00.000Z",
          "precision": "day"
        }],
        "identifiers": [{
          "identifier": "ab1791b0-5c71-11db-b0de-0800200c9a66"
        }],
        "negation_indicator": false,
        "onset_age": "57",
        "onset_age_unit": "Year",
        "status": "Active",
        "patient_status": "Alive and well",
        "source_list_identifiers": [{
          "identifier": "ec8a6ff8-ed4b-4f7e-82c3-e98e58b45de7"
        }],
        "name": "Asthma",
        "code": "195967001",
        "code_system_name": "SNOMED CT"
      }];
    };

    $scope.getRecord();
    //$scope.getStub();

    for (var i in $scope.problems) {
      problemStatus($scope.problems[i]);
      onsetAge($scope.problems[i]);
      recordFunctions.formatDate($scope.problems[i].date);
    }

  }
]);