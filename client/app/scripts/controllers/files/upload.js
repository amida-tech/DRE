'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesUploadCtrl
 * @description
 * # FilesUploadCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('FilesUploadCtrl', function($scope, $location, upload) {

        $scope.uploadStep = 0;

        $scope.incrementStep = function() {
            $scope.uploadStep++;
        }

        $scope.return = function() {
            $location.path('/files');
        }

        $scope.importAndSave = function() {
            var file = $scope.myFile
            upload.uploadRecord(file, function(err, results) {
                //do something
                $location.path('/files');
            });

        }


    });
