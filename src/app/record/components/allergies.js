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

angular.module('dre.record.allergies', [])

.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.when('/record/allergies', {
      templateUrl: 'app/record/components/allergies.tpl.html',
      controller: 'recordsCtrl'
  });
}])

  .controller('allergiesCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {

      $scope.allergies = [];

      $http({method: 'GET', url: '/record/allergies'}).
    success(function(data, status, headers, config) {
      $scope.allergies = data.allergies;
    }).
    error(function(data, status, headers, config) {
      console.log('error');
    });





     
    }
  ]);