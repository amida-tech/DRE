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

angular.module('phix.navbarCtrl', [
  'phix.authenticationService',
  'phix.tabService',
  'phix.request'
])
  .controller('NavbarCtrl', ['$scope', '$location', 'AuthenticationService', '$rootScope', 'TabService', 'InboxService',
    function($scope, $location, AuthenticationService, $rootScope, TabService, InboxService) {

      $scope.appConfig = $rootScope.appConfiguration.configuration;
      if ($scope.appConfig === 'clinician') {
        $scope.nodeLocation = $rootScope.appConfiguration.nodeLocation;
      }

      $scope.unreadCount = 0;
      InboxService.unreadCount(function(countResponse) {
        $scope.unreadCount = countResponse;

      });


      $scope.currentDelegate = AuthenticationService.currentDelegate();

      $scope.setDelegate = function(username) {
        AuthenticationService.currentDelegate(username, function() {
          $location.path('/' + username);
        });
      };

      if (!$scope.username) {
        AuthenticationService.currentUser(function(response) {
          //Should probably add an error handler here for if profile not found.
          $scope.username = response.username;
          $scope.name = response.fullname;
          $scope.directemail = response.directemail;
          $scope.verified = response.verified;
        });
      }

      $scope.tab = TabService.currentTab();

      //Not sure what this is doing.
      $scope.clinician = AuthenticationService.clinician();
      $scope.patient = !$scope.clinician;

      //This needs to be populated with a list of eligible delegates.  Remove this from auth service.
      //$scope.delegates = AuthenticationService.delegates();

      function refreshDelegates() {
        AuthenticationService.delegates(function(results) {
          var delegationArray = results.delegates;
          if (!delegationArray) {} else {
            for (var i = 0; i < delegationArray.length; i++) {
              if (delegationArray[i].middlename && delegationArray[i].middlename.length > 0) {
                delegationArray[i].name = delegationArray[i].firstname + ' ' + delegationArray[i].middlename + '. ' + delegationArray[i].lastname;
              } else {
                delegationArray[i].name = delegationArray[i].firstname + ' ' + delegationArray[i].lastname;
              }
            }
          }
          $scope.delegates = results.delegates;
        });
      }

      refreshDelegates();

      $scope.refreshDelegates = function() {
        refreshDelegates();
      };


      $scope.logout = function() {
        AuthenticationService.logout(function() {
          $location.path('/');
        });
      };
    }
  ]);