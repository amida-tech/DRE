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

.controller('matchCtrl', ['$scope', '$http', '$location', 'getNotifications',
  function($scope, $http, $location, getNotifications) {

    $scope.navPath = "templates/nav/nav.tpl.html";

    $scope.notifications = {};
    getNotifications.getUpdate(function(err, notifications) {
      $scope.notifications = notifications;
    });

    $scope.new_merges = [];
    $scope.duplicate_merges = [];

    $scope.predicate = "-merged";
    $scope.displayMerges = false;

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
        if (data.merges[i].merge_reason === "new") {
          $scope.new_merges.push(data.merges[i]);
        } else if (data.merges[i].merge_reason === "duplicate") {
          $scope.duplicate_merges.push(data.merges[i]);
        }
      }

    }).
    error(function(data, status, headers, config) {
      console.log('error');
    });


  }
]);