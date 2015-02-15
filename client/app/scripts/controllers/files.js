'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesCtrl
 * @description
 * # FilesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('FilesCtrl', function ($scope, files) {

        $scope.fileList = [];

        files.getFiles(function (err, results) {
            $scope.fileList = results;
            console.log(results);
        });

        $scope.predicate = "file_name";

        $scope.nameSort = function () {
            if ($scope.predicate === "file_name") {
                $scope.predicate = "-file_name";
            } else {
                $scope.predicate = "file_name";
            }
        };

        $scope.typeSort = function () {
            if ($scope.predicate === "file_class") {
                $scope.predicate = "-file_class";
            } else {
                $scope.predicate = "file_class";
            }
        };

        $scope.modifiedSort = function () {
            if ($scope.predicate === "file_upload_date") {
                $scope.predicate = "-file_upload_date";
            } else {
                $scope.predicate = "file_upload_date";
            }
        };

    });
