'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('AccountCtrl', function ($scope, $location) {
    
    $scope.resetPassword = function () {
    	if ($scope.inputNewPassword === $scope.inputRepeatPassword) {
    		$scope.resetForm.$setPristine();
    		$scope.error = null;
    	} else {
    		$scope.error = "New passwords did not match";
    	}

    };


  });
