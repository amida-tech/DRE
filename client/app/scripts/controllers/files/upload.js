'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesUploadCtrl
 * @description
 * # FilesUploadCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('FilesUploadCtrl', function($scope, $location, $route, upload, $http, format, record) {

        $scope.uploadStep = 0;
        var myFile;

        $scope.new_first = "";
        $scope.new_last = "";
        $scope.new_middle = "";
        $scope.new_dob = "";
        $scope.new_gender = "";

        $scope.incrementStep = function() {
            $scope.uploadStep = $scope.uploadStep + 1;

            if ($scope.uploadStep === 1) {



                var uploadFile = $scope.myFile;
                console.log("extracting demographics", uploadFile);

                upload.uploadRecord(uploadFile, true, function(err, results) {
                    //do something
                    console.log("file check ", results);

                    $scope.new_first = results.name.first;
                    $scope.new_last = results.name.last;
                    if (results.name.middle && results.name.middle[0]) {
                        $scope.new_middle = results.name.middle[0];
                    }
                    $scope.new_dob = format.formatDate(results.dob.point);
                    $scope.new_gender = results.gender;
                });


            }

            if ($scope.uploadStep === 2) {

                var uploadFile = $scope.myFile;
                console.log("uploading file", uploadFile);

                upload.uploadRecord(uploadFile, false, function(err, results) {
                    //do something
                    

                        $scope.uploadStep = 0;
                    $location.path('/files');
                    record.getData(function(err, data) { return; });
                    $route.reload();
                
                    
                });
            }

            // $scope.uploadStep++;
        }

        $scope.return = function() {
            $location.path('/files');
        }

        $scope.importAndSave = function() {
            var uploadFile = $scope.myFile;
            console.log("uploading file", uploadFile);

            upload.uploadRecord(uploadFile, false, function(err, results) {
                //do something
                $scope.uploadStep = 0;

                $location.path('/files');
            });

        }


    });

angular.module('phrPrototypeApp')
    .directive('validFile', function() {
        return {
            require: 'ngModel',
            link: function(scope, el, attrs, ngModel) {
                ngModel.$render = function() {
                    ngModel.$setViewValue(el.val());
                };

                el.bind('change', function() {
                    scope.$apply(function() {
                        ngModel.$render();
                    });
                });
            }
        };
    });
