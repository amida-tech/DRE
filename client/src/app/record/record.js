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

var supportedComponents = ['demographics', 'allergies', 'encounters', 'immunizations', 'medications', 'problems', 'procedures', 'results', 'social_history', 'vitals'];

angular.module('dre.record', ['dre.record.allergies', 'dre.record.medications', 'dre.record.encounters', 'dre.record.procedures', 'dre.record.immunizations', 'dre.record.problems', 'dre.record.results', 'dre.record.vitals'])

.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.when('/record', {
      templateUrl: 'templates/record/record.tpl.html',
      controller: 'recordCtrl'
  });
}])

  .controller('recordCtrl', ['$scope', '$filter', '$http', '$q', '$location', 'fileDownload', 'getNotifications', 
    function($scope, $filter, $http, $q, $location, fileDownload, getNotifications) {

      $scope.navPath = "templates/nav/nav.tpl.html";
      $scope.medicationsPath = "templates/record/components/medications.tpl.html";
      $scope.allergiesPath = "templates/record/components/allergies.tpl.html";
      $scope.encountersPath = "templates/record/components/encounters.tpl.html";
      $scope.proceduresPath = "templates/record/components/procedures.tpl.html";
      $scope.immunizationsPath = "templates/record/components/immunizations.tpl.html";
      $scope.problemsPath = "templates/record/components/problems.tpl.html";
      $scope.resultsPath = "templates/record/components/results.tpl.html";
      $scope.vitalsPath = "templates/record/components/vitals.tpl.html";

      $scope.dismissModal = function(index) {
        $("#myModal" + index).on("hidden.bs.modal", function (e) {
            $location.path("/storage");
            $scope.$apply();
        });
      };

      // var aggregatedResponse = {};
      // function getSectionForDownload(i) {
      //    var downloadUrl = "api/v1/record/" + supportedComponents[i];
      //     fileDownload.downloadFile(downloadUrl, function(err, res) {
      //       if (err) {
      //         console.log(err);
      //         return err;
      //       } else {
      //         $.extend(aggregatedResponse, res);
      //       }
      //     });
      //     return aggregatedResponse;
      // }

      // function getEachSectionForDownload() {
      //   var deferred = $q.defer();
      //   var response = {};
      //   for (i = 0; i < supportedComponents.length; i++) {
      //     response = getSectionForDownload(i);
      //   }
      //   if (typeof response !== "object") {
      //     deferred.reject('Failed');
      //   } else {
      //     deferred.resolve(response);
      //   }
      //   return deferred.promise;
      // }

      // $scope.downloadData = function() {
      //   var promise = getEachSectionForDownload();
      //   promise.then(function(result) {
      //     console.log('Success');
      //     console.log(result);

      //     /* now generate ccda with result for download */
      //     var CCDA = JSON.stringify(result);
      //     var blob = new Blob([ CCDA ], { type : 'text/plain' });
      //     $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
      //   }, function(reason) {
      //     console.log("Error: " + reason);
      //   });
      // };

      $scope.downloadData = function() {
        var downloadUrl = "api/v1/ccda/";
        var promise = fileDownload.downloadFile(downloadUrl, function(err, res) {
          if (err) {
            console.log(err);
          }
          /* now generate ccda with result for download */
          var blob = new Blob([ res.toString() ], { type : 'text/xml' });
          $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
        });
      };

      $scope.notifications = {};
        getNotifications.getUpdate(function(err, notifications) {
        $scope.notifications = notifications;
      });

      

    }
  ]);