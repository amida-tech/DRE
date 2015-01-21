'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('MainCtrl', function ($scope, $location, login) {

  	$scope.login = function (isValid) {
      console.log("main controller, login()", isValid);
  		login.login($scope.inputLogin, $scope.inputPassword, function(err) {
  			if (err) {
  				$scope.error = err;
  			} else {
  				$location.path('/home');
  			}
 		});
  	};

  });
