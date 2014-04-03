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

angular.module('phix.verifyCtrl', ['bt.forms'])
  .controller('VerifyCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.data = {};
      $scope.verified = null;


      $scope.verify = function() {
        //Verify API call here
        //alert('verification in process: '+$scope.codeHolder);
        $http({
          method: 'GET',
          url: '/identity/account/' + $scope.codeHolder
        }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.data = data;
          $scope.verified = "inprocess";
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.data = data;
          $scope.verified = 'invalid';
        });

      };


      $scope.approve = function() {
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http({
          method: 'PUT',
          url: '/identity/validate/' + $scope.codeHolder,
          data: {
            verified: true
          }
        }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.data = data;
          $scope.verified = 'approved';
          $scope.codeHolder = "";
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.data = data;
          $scope.verified = 'approved';
          $scope.codeHolder = "";
        });

      };

      $scope.reject = function() {
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http({
          method: 'PUT',
          url: '/identity/validate/' + $scope.codeHolder,
          data: {
            verified: false
          }
        }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.data = data;
          $scope.verified = 'rejected';
          $scope.codeHolder = "";
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.data = data;
          $scope.verified = 'rejected';
          $scope.codeHolder = "";
        });

      };


    }
  ]);