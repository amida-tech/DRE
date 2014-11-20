'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesUploadCtrl
 * @description
 * # FilesUploadCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('FilesUploadCtrl', function ($scope, $location) {
    
  	$scope.uploadStep = 0;

  	$scope.incrementStep = function () {
  		$scope.uploadStep++;
  	}

  	$scope.return = function () {
  		$location.path('/files');
  	}

  });
