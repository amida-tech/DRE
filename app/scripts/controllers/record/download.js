'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordDownloadCtrl
 * @description
 * # RecordDownloadCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordDownloadCtrl', function ($scope, $location) {
    
  	$scope.downloadClick = function () {


  		$location.path('/record');

  	};

  });
