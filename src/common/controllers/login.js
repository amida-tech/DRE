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

angular.module('phix.loginCtrl', ['phix.authenticationService'])
  .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'AuthenticationService', function ($scope, $rootScope, $http, $location, AuthenticationService) {
      
      console.log($rootScope.appConfiguration);
    $scope.user = {};
    $scope.check = function () {
      AuthenticationService.login($scope.user.username, $scope.user.password, function(err, res) {
        if (err) {
            $scope.login.serverError = 'Incorrect Username/Password.';
        } else {
            $scope.login.serverError = '';
            if (res.substring(0,7) === 'Profile') {
                $location.path('/' + $scope.user.username + '/enroll');
            } else {
              if ($rootScope.appConfiguration.configuration === 'clinician') {
                  AuthenticationService.currentUser(function (response) {
                    $location.path('/' + response.username + '/mail/inbox');
                  });  
              } else {
                AuthenticationService.currentUser(function (response) {
                    $location.path('/' + response.username);
                });
              }
            }
        }
      });
    };
  }]);
