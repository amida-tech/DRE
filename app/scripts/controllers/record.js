'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordCtrl', function ($scope, record) {
    
  	record.getRecord(function(err, results) {
  		$scope.masterRecord = results;
  	});

  });
