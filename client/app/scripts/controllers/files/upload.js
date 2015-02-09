'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesUploadCtrl
 * @description
 * # FilesUploadCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('FilesUploadCtrl', function($scope, $location, $route, upload) {

        $scope.uploadStep = 0;
        var myFile;

        $scope.incrementStep = function() {
            var uploadFile = $scope.myFile;
            console.log("uploading file", uploadFile);

            upload.uploadRecord(uploadFile, function(err, results) {
                //do something
                $location.path('/files');
                $route.reload();
            });

            // $scope.uploadStep++;
        }

        $scope.return = function() {
            $location.path('/files');
        }

        $scope.importAndSave = function() {
            var uploadFile = $scope.myFile;
            console.log("uploading file", uploadFile);

            upload.uploadRecord(uploadFile, function(err, results) {
                //do something
                $location.path('/files');
            });

        }


    });

angular.module('phrPrototypeApp')
    .directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            ngModel.$render = function () {
                ngModel.$setViewValue(el.val());
            };

            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$render();
                });
            });
        }
    };
});