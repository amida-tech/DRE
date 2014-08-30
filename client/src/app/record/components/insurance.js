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

angular.module('dre.record.insurance', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/insurance', {
      templateUrl: 'templates/record/components/insurance.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('insuranceCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.insurance = [];
    $scope.displayInsurance = false;
    $scope.insurancePredicate = "-date_weight";

    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/insurance'
      }).
      success(function(data, status, headers, config) {
        $scope.insurance = data.insurance;
        if ($scope.insurance.length > 0) {
          $scope.displayInsurance = true;
          $scope.updateFields();
        } else {
          $scope.displayInsurance = false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.updateFields = function() {
      for (var i in $scope.insurance) {
        recordFunctions.extractName($scope.insurance[i], "insurance");
        recordFunctions.formatDateTime($scope.insurance[i].date_time);
        $scope.insurance[i].date_weight = $scope.insurance[i].date_time;
        $scope.insurance[i].name = recordFunctions.truncateName($scope.insurance[i].name);
        if ($scope.insurance[i].addresses) {
          for (var perAddr in $scope.insurance[i].addresses) {
            recordFunctions.formatAddress($scope.insurance[i].addresses[perAddr]);
          }
        }
  }
    };

    $scope.getRecord();
    //$scope.getStub();

  }
]);
