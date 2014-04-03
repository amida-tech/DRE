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

angular.module('dre.storage', [])

.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.when('/storage', {
      templateUrl: 'app/storage/storage.tpl.html',
      controller: 'storageCtrl'
  });
}])

  .controller('storageCtrl', ['$scope', '$http', '$location', 
    function($scope, $http, $location) {

      $scope.data = {};

      $scope.dateformat = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19\d{2}|[2]\d{3})$/;
      $scope.ssnformat = /^\d{3}-?\d{2}-?\d{4}$/;

      $scope.zipcodeformat = /^\d{5}$/;
      $scope.phoneformat = /^\d{10}$/;

      var statesAbbr = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
      $scope.states = statesAbbr;

    }
  ]);