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

angular.module('dre.match', ['dre.match.reconciliation'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/match', {
      templateUrl: 'templates/matching/matching.tpl.html',
      controller: 'matchCtrl'
    });
  }
])

.controller('matchCtrl', ['$scope', '$http', '$location', 'getNotifications', 'recordFunctions',
  function($scope, $http, $location, getNotifications, recordFunctions) {

    $scope.navPath = "templates/nav/nav.tpl.html";
    $scope.notifications = {};


    getNotifications.getUpdate(function(err, notifications) {
      $scope.notifications = notifications;
    });

    $scope.new_merges = [];
    $scope.duplicate_merges = [];
    $scope.predicate = "-merged";
    $scope.displayMerges = false;

    $scope.updateSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "entry_type") {
          $scope.predicate = "entry_type";
        } else {
          $scope.predicate = "-entry_type";
        }
      } else {
        $scope.predicate = "-entry_type";
      }
    };

    $scope.elementSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "entry_id.name") {
          $scope.predicate = "entry_id.name";
        } else {
          $scope.predicate = "-entry_id.name";
        }
      } else {
        $scope.predicate = "-entry_id.name";
      }
    };

    $scope.dateSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "merged") {
          $scope.predicate = "merged";
        } else {
          $scope.predicate = "-merged";
        }
      } else {
        $scope.predicate = "-merged";
      }
    };

    $scope.getUnresolvedUpdates = function() {

      //Will need to flag source record data.
      var placeholderJSON = {
        //2 Allergies are awaiting your review.  

      };


    };

    function formatMerges (inputMerge) {
      var trimLength = 35;
      for (var iMerge in inputMerge) {
        //Give Immunizations a name
        if (inputMerge[iMerge].entry_type === 'immunization') {
          if (inputMerge[iMerge].entry_id.product.name) {
            inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.product.name;
          }
        }
        //Give Medications a name
        if (inputMerge[iMerge].entry_type === 'medication') {
          if (inputMerge[iMerge].entry_id.product.name) {
            inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.product.name;
          }
        }
        //Give Socials a name
        if (inputMerge[iMerge].entry_type === 'social') {
          if (inputMerge[iMerge].entry_id.value) {
            inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.value;
          }
        }
        //Give Demographics a name
        if (inputMerge[iMerge].entry_type === 'demographic') {
          if (inputMerge[iMerge].entry_id.name) {
            var tmpName = recordFunctions.formatName(inputMerge[iMerge].entry_id.name).displayName;
            inputMerge[iMerge].entry_id.name = tmpName;
          }
        }
        //Trim long strings.
        if (inputMerge[iMerge].entry_id.name && typeof inputMerge[iMerge].entry_id.name === 'string') {
          if (inputMerge[iMerge].entry_id.name.length > trimLength) {
                inputMerge[iMerge].entry_id.name = inputMerge[iMerge].entry_id.name.substring(0, trimLength) + "...";
          }
        }
      }
    }



    //This is going away.
    $scope.reconciliationClick = function() {
      $location.path("match/reconciliation");
    };

    $http({
      method: 'GET',
      url: '/api/v1/merges'
    }).
    success(function(data, status, headers, config) {

      if (data.merges.length > 0) {
        $scope.displayMerges = true;
      } else {
        $scope.displayMerges = false;
      }


      for (var i = 0; i < data.merges.length; i++) {
        //console.log(data.merges);
        if (data.merges[i].merge_reason === "duplicate") {
          $scope.duplicate_merges.push(data.merges[i]);
        } else {
          $scope.new_merges.push(data.merges[i]);
        }
      }

      formatMerges($scope.new_merges);

    }).
    error(function(data, status, headers, config) {
      console.log('error');
    });


  }
]);