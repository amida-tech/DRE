'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RegisterCtrl', function ($scope, $location) {

  	$scope.step = 0;

    $scope.registration = {};


    $scope.nextStep = function () {
    	$scope.step = $scope.step + 1;
    };

    $scope.finish = function () {
    	$location.path('/home');
    };
    
  });
