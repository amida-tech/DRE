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

angular.module('dre.record.claims', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/claims', {
      templateUrl: 'templates/record/components/claims.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('claimsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.claims = [];
    $scope.displayClaims = false;
    $scope.claimsPredicate = "-date_weight";


    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/claims'
      }).
      success(function(data, status, headers, config) {
        $scope.claims = data.claims;
        if ($scope.claims.length > 0) {
          $scope.displayClaims = true;
          $scope.updateFields();
        } else {
          $scope.displayClaims= false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.updateFields = function() {
      for (var i in $scope.claims) {
        recordFunctions.extractName($scope.claims[i]);

        var claim = $scope.claims[i];
        console.log(claim);
        if(claim.start_date){
            //format date for Details section
            recordFunctions.formatDate(claim.start_date);
            //prepare the date that is going to be displayed in accordion
            claim.titleDate = claim.start_date;
        }
        if(claim.end_date){
            recordFunctions(formatDate(claim.end_date));
            claim.titleDate = claim.end_date;
        }
        if(claim.titleDate){
            recordFunctions.formatDate(claim.titleDate);
        }
        //assign date weight if titleDate was defined from above
        if(claim.titleDate){
            claim.date_weight = claim.titleDate.date;
        }
        //just assign UTC 1970 to claim date weight so it's at the bottom of the section
        else{
            claim.date_weight = (new Date(0)).toISOString();
        }
      }
    };

    $scope.getStub = function() {
      $scope.displayclaims = true;
      $scope.claims = [{}];
      $scope.updateFields();
    };

    $scope.getRecord();
    //$scope.getStub();

  }
]);
