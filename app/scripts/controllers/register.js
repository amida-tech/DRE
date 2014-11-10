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

      if ($scope.step === 0) {
        if ($scope.inputPassword === $scope.inputRepeatPassword) {
          $scope.step = $scope.step + 1;
        } else {
           $scope.error = "Entered Passwords did not match";
           return;
        }
      } else { 
    	 $scope.step = $scope.step + 1;
       console.log($scope.step);
      }

    };

    $scope.finish = function () {
    	$location.path('/home');
    };
    
  });
