/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular.module('dre.dashboard', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'templates/dashboard/dashboard.tpl.html',
            controller: 'dashboardCtrl'
        });
    }
])

.controller('dashboardCtrl', ['$rootScope', '$scope', '$route', '$http', '$location', 'fileUpload', 'getNotifications', 'recordFunctions',
    function($rootScope, $scope, $route, $http, $location, fileUpload, getNotifications, recordFunctions) {

        $scope.predicate = "-file_upload_date";
        $scope.new_merges = [];
        $scope.duplicate_merges = [];
        $scope.predicate = "-merged";
        $scope.displayMerges = false;

        $scope.updateSort = function() {
            if ($scope.predicate.substring(0, 1) === "-") {
                if ($scope.predicate.substring(1) === "entry_type") {
                    $scope.predicate = "entry_type";
                } else {
                    $scope.predicate = "-entry_type";
                }
            } else {
                $scope.predicate = "-entry_type";
            }
        };

        $scope.elementSort = function() {
            if ($scope.predicate.substring(0, 1) === "-") {
                if ($scope.predicate.substring(1) === "entry.name") {
                    $scope.predicate = "entry.name";
                } else {
                    $scope.predicate = "-entry.name";
                }
            } else {
                $scope.predicate = "-entry.name";
            }
        };


        $scope.nameSort = function() {
            if ($scope.predicate.substring(0, 1) === "-") {
                if ($scope.predicate.substring(1) === "file_name") {
                    $scope.predicate = "file_name";
                } else {
                    $scope.predicate = "-file_name";
                }
            } else {
                $scope.predicate = "-file_name";
            }
        };

        $scope.dateSort = function() {
            if ($scope.predicate.substring(0, 1) === "-") {
                if ($scope.predicate.substring(1) === "merged") {
                    $scope.predicate = "merged";
                } else {
                    $scope.predicate = "-merged";
                }
            } else {
                $scope.predicate = "-merged";
            }
        };

        function formatMerges(inputMerge) {
            var trimLength = 35;
            for (var iMerge in inputMerge) {
                if (inputMerge[iMerge].entry_type !== 'demographics') {
                    recordFunctions.extractName(inputMerge[iMerge].entry, inputMerge[iMerge].entry_type);
                }

                if (inputMerge[iMerge].entry_type === 'demographics') {
                    var tmpName = recordFunctions.formatName(inputMerge[iMerge].entry.name);
                    inputMerge[iMerge].entry.name = tmpName.displayName;
                }
            }
        }

        $scope.file_array = [];
        $scope.displayRecords = false;

        $scope.refreshRecords = function() {
            $http({
                method: 'GET',
                url: '/api/v1/storage'
            }).
            success(function(data, status, headers, config) {
                $scope.file_array = data.storage;
                getNotifications.getUpdate(function(err, notifications) {
                    $rootScope.notifications = notifications;
                });
                if ($scope.file_array.length > 0) {
                    $scope.displayRecords = true;
                } else {
                    $scope.displayRecords = false;
                }
            }).
            error(function(data, status, headers, config) {});
        };

        $scope.refreshRecords();

        //File upload.
        $scope.uploadRecord = function() {

            var uploadFile = $scope.myFile;
            var uploadUrl = "/api/v1/storage";
            fileUpload.uploadFileToUrl(uploadFile, uploadUrl, function(err, res) {
                if (err) {
                    console.log(err);
                }

                angular.element("div").removeClass("modal-backdrop fade in");
                $scope.myFile = null;
                $scope.refreshRecords();
                //$route.reload();
            });

        };



        $http({
            method: 'GET',
            url: '/api/v1/merges'
        }).
        success(function(data, status, headers, config) {
            if (data.merges.length > 0) {
                console.log('data merges on success');
                console.log(data.merges);
                $scope.displayMerges = true;
            } else {
                $scope.displayMerges = false;
            }


            for (var i = 0; i < data.merges.length; i++) {
                data.merges[i].section_singular = recordFunctions.singularizeSection(data.merges[i].entry_type);
                if (data.merges[i].merge_reason === "duplicate") {
                    $scope.duplicate_merges.push(data.merges[i]);
                } else {
                    $scope.new_merges.push(data.merges[i]);
                }
            }

            formatMerges($scope.new_merges);

        }).
        error(function(data, status, headers, config) {
            //console.log('error');
        });

    }
]);
