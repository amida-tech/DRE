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

angular.module('phix.enrollCtrl', ['bt.forms', 'phix.authenticationService'])
  .controller('EnrollCtrl', ['$scope', '$http', '$location', 'AuthenticationService',
    function($scope, $http, $location, AuthenticationService) {
      $scope.data = {};

      $scope.dateformat = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19\d{2}|[2]\d{3})$/;
      $scope.ssnformat = /^\d{3}-?\d{2}-?\d{4}$/;

      $scope.zipcodeformat = /^\d{5}$/;
      $scope.phoneformat = /^\d{10}$/;

      var statesAbbr = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
      $scope.states = statesAbbr;

      $scope.enroll = function(callback) {

        var enrollmentJSON = {
          firstname: $scope.data.firstname,
          middlename: $scope.data.middlename,
          lastname: $scope.data.lastname,
          birthdate: $scope.data.birthdate,
          ssn: $scope.data.ssn,
          gender: $scope.data.gender,
          address: $scope.data.address,
          address2: $scope.data.address2,
          city: $scope.data.city,
          state: $scope.data.state,
          zipcode: $scope.data.zipcode,
          phone: $scope.data.phone,
          phonetype: $scope.data.phonetype
        };

        $http.put('/profile', enrollmentJSON).success(function(data) {
          AuthenticationService.currentUser(function(response) {
            $location.path('/' + response.username + '/pending');
          });
        }).error(function(data) {
          $scope.enroll.serverError = data;
        });
      };
    }
  ]);