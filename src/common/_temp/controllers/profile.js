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

angular.module('phix.profileCtrl', ['bt.forms'])
  .controller('ProfileCtrl', ['$scope', '$location', '$http',
    function($scope, $location, $http) {
      $scope.data = {};

      $scope.dateformat = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19\d{2}|[2]\d{3})$/;
      $scope.ssnformat = /^\d{3}-?\d{2}-?\d{4}$/;

      $scope.zipcodeformat = /^\d{5}$/;
      $scope.phoneformat = /^\d{10}$/;

      var endpoint = "/";

      //Manage account information.
      $scope.userAccount = {};

      //Manage profile information.
      $scope.userProfile = {};


      function retrieveProfile() {
        $http.get(endpoint + 'profile').success(function(data) {
          $scope.userProfile = data;
          $scope.userProfile.phone = $scope.userProfile.phone.replace(/-/g, '');
        }).error(function(data) {
          console.log(data);
        });
      }

      function retrieveAccount() {
        $http.get(endpoint + 'account').success(function(data) {
          $scope.userAccount = data;
        }).error(function(data) {
          console.log(data);
        });
      }

      retrieveProfile();
      retrieveAccount();


      //Need update account for email.

      $scope.updateProfile = function() {

        var requestJSON = {};

        if ($scope.userProfile.address) {
          requestJSON.address = $scope.userProfile.address;
        }
        if ($scope.userProfile.address2) {
          requestJSON.address2 = $scope.userProfile.address2;
        }
        if ($scope.userProfile.city) {
          requestJSON.city = $scope.userProfile.city;
        }
        if ($scope.userProfile.state) {
          requestJSON.state = $scope.userProfile.state;
        }
        if ($scope.userProfile.zipcode) {
          requestJSON.zipcode = $scope.userProfile.zipcode;
        }
        if ($scope.userProfile.phone) {
          requestJSON.phone = $scope.userProfile.phone;
        }
        if ($scope.userProfile.phonetype) {
          requestJSON.phonetype = $scope.userProfile.phonetype;
        }

        $http.post(endpoint + 'profile', requestJSON).success(function(data) {
          //console.log(data);
        }).error(function(data) {
          console.log(data);
        });

        var accountJSON = {};

        if ($scope.userAccount.email) {
          accountJSON.email = $scope.userAccount.email;
        }

        $http.post(endpoint + 'account', accountJSON).success(function(data) {
          //console.log(data);
        }).error(function(data) {
          console.log(data);
        });
      };


      var statesAbbr = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
      $scope.states = statesAbbr;

    }
  ]);