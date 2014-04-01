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

angular.module('phix.lookupCtrl', [])
  .controller('LookupCtrl', ['$scope', '$http',
    function($scope, $http) {


      var endpoint = "/";

      $scope.dateformat = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19\d{2}|[2]\d{3})$/;
      $scope.user = {};
      $scope.verified = false;

      $scope.resetForm = function() {
        $scope.toggleView = false;
        $scope.user = {};
        postJSON = {};
      };

      $scope.verify = function() {
        var postJSON = {};
        postJSON.firstname = $scope.user.firstname;
        postJSON.lastname = $scope.user.lastname;
        postJSON.birthdate = $scope.user.birthdate;
        postJSON.directemail = $scope.user.directemail;

        if ($scope.user.middlename) {
          postJSON.middlename = $scope.user.middlename;
        }

        $http.post(endpoint + 'verify', postJSON).success(function(data) {
          $scope.verified = data.verified;
          $scope.toggleView = true;

        }).error(function(data) {
          console.log(data);
        });
      };

    }
  ]);