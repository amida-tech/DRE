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

angular.module('phix.pendingCtrl', [])
  .controller('PendingCtrl', ['$scope', '$http', 'AuthenticationService',
    function($scope, $http, AuthenticationService) {

      $scope.closest = {
        address: {
          address: "3118 Washington Boulevard",
          address2: "",
          city: "Arlington",
          state: "VA",
          zipcode: "22201"
        },
        lat: "38.885879",
        lng: "-77.09519"
      };
      $scope.nearby = {
        locations: [{
          address: '235 N Glebe Rd',
          city: 'Arlington',
          state: 'VA',
          zipcode: '22201'
        }, {
          address: '2200 N George Mason Dr',
          city: 'Arlington',
          state: 'VA',
          zipcode: '22201'
        }, {
          address: '1101 Wilson Blvd #1',
          city: 'Arlington',
          state: 'VA',
          zipcode: '22201'
        }]
      };

      $scope.token = '';

      $http.get('/account').success(function(data) {
        $scope.token = data.token;
      }).error(function(data) {
        console.log(data);
      });

    }
  ]);