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
    	$location.path('/home');

    };

  });
