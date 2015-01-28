'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('AccountCtrl', function ($scope, $location, profile) {
    
    $scope.resetPassword = function () {
    	$location.path('/home');

    };

    function showUserInfo() {
        profile.getProfile(function(err, profileInfo) {
            $scope.user_first = profileInfo.name.first;
            $scope.user_last = profileInfo.name.last;
            $scope.user_email = profileInfo.email[0].email;
            $scope.user_dob = profileInfo.dob;
        });
    }

    showUserInfo();

  });
