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
        console.log(data.claims);
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

        //this variable is used to prevent id colllisions in claims HTML.
        var claimCount = 0;


      for (var i in $scope.claims) {
        recordFunctions.extractName($scope.claims[i], "claims");
        var claim = $scope.claims[i];
        //id for claims, since all claims may not have claim.number
        claim.count = i;

        if(claim.name === "unknown"){
            claim.name = undefined;
        }

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
        if(claim.service_date){
            recordFunctions(formatDate(claim.service_date));
            if(claim.titleDate === undefined){
                claim.titleDate = claim.service_date;
            }

        }
        //assign date weight if titleDate was defined from above
        if(claim.titleDate){
            claim.date_weight = claim.titleDate.date;
        }
        //just assign UTC 1970 to claim date weight so it's at the bottom of the section
        else{
            claim.date_weight = (new Date(0)).toISOString();
        }

        for(var x in claim.lines){
            var line = claim.lines[x];
            if(line.start_date){
                recordFunctions.formatDate(line.start_date);
            }
            if(line.end_date){
                recordFunctions.formatDate(line.end_date);
            }
            if(line.service_date){
                recordFunctions.formatDate(line.service_date);
            }
        }


        /*
        if ($scope.immunizations[i].performer.address) {
              for (var perAddr in $scope.immunizations[i].performer.address) {
                recordFunctions.formatAddress($scope.immunizations[i].performer.address[perAddr]);
              }
          }
        */

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
/* Scrap from tests


claim.provider = {};
claim.provider.name = 'ostrich';
claim.provider.identifiers = [];
var sampleIdentifier = {'identifier': '12345' ,'identifier_type': 'cms'};
var sampleIdentifier2 = {'identifier': '12345' ,'identifier_type': 'cms'};
claim.provider.identifiers.push(sampleIdentifier);
claim.provider.identifiers.push(sampleIdentifier2);

*/

