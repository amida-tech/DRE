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

angular.module('dre.storage', ['directives.fileModel'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/storage', {
      templateUrl: 'templates/storage/storage.tpl.html',
      controller: 'storageCtrl'
    });
  }
])

.controller('storageCtrl', ['$rootScope', '$scope', '$route', '$http', '$location', 'fileUpload', 'getNotifications',
  function($rootScope, $scope, $route, $http, $location, fileUpload, getNotifications) {

    $scope.predicate = "-file_upload_date";

    $scope.nameSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "file_name") {
          $scope.predicate = "file_name";
        } else {
          $scope.predicate = "-file_name";
        }
      } else {
        $scope.predicate = "-file_name";
      }
    };

    $scope.dateSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "file_upload_date") {
          $scope.predicate = "file_upload_date";
        } else {
          $scope.predicate = "-file_upload_date";
        }
      } else {
        $scope.predicate = "-file_upload_date";
      }
    };

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
      error(function(data, status, headers, config) {
      });
    };

    $scope.refreshRecords();

      $scope.dismissModal = function() {
        $("#uploadModal").on("hidden.bs.modal", function (e) {
            $location.path("/storage");
            $scope.$apply();
        });
      };


    //File upload.
    $scope.uploadRecord = function() {

      var uploadFile = $scope.myFile;
      var uploadUrl = "/api/v1/storage";
      fileUpload.uploadFileToUrl(uploadFile, uploadUrl, function(err, res) {
        if (err) {
          console.log(err);
        }



        $scope.myFile = null;
        $scope.refreshRecords();
        $route.reload();
      });

    };

  }
]);
