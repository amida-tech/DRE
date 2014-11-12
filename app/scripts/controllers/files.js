'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesCtrl
 * @description
 * # FilesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('FilesCtrl', function ($scope, files, breadcrumb) {



  	$scope.fileList = [];

  	files.getFiles(function (err, results) {
  		$scope.fileList = results;
  	});




  	$scope.predicate = "name";

    $scope.nameSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "name") {
          $scope.predicate = "name";
        } else {
          $scope.predicate = "-name";
        }
      } else {
        $scope.predicate = "-name";
      }
    };

    $scope.typeSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "type") {
          $scope.predicate = "type";
        } else {
          $scope.predicate = "-type";
        }
      } else {
        $scope.predicate = "-type";
      }
    };

    $scope.modifiedSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "modified") {
          $scope.predicate = "modified";
        } else {
          $scope.predicate = "-modified";
        }
      } else {
        $scope.predicate = "-modified";
      }
    };

  });
