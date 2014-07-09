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

angular.module('dre.record', ['dre.record.allergies', 'dre.record.medications', 'dre.record.encounters', 'dre.record.procedures', 'dre.record.immunizations', 'dre.record.problems', 'dre.record.results', 'dre.record.vitals'])

.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.when('/record', {
      templateUrl: 'templates/record/record.tpl.html',
      controller: 'recordCtrl'
  });
}])

  .controller('recordCtrl', ['$scope', '$http', '$location', 'fileDownload', 'getNotifications', 
    function($scope, $http, $location, fileDownload, getNotifications) {

      $scope.navPath = "templates/nav/nav.tpl.html";
      $scope.medicationsPath = "templates/record/components/medications.tpl.html";
      $scope.allergiesPath = "templates/record/components/allergies.tpl.html";
      $scope.encountersPath = "templates/record/components/encounters.tpl.html";
      $scope.proceduresPath = "templates/record/components/procedures.tpl.html";
      $scope.immunizationsPath = "templates/record/components/immunizations.tpl.html";
      $scope.problemsPath = "templates/record/components/problems.tpl.html";
      $scope.resultsPath = "templates/record/components/results.tpl.html";
      $scope.vitalsPath = "templates/record/components/vitals.tpl.html";

      $scope.dismissModal = function (index) {
        $("#myModal" + index).on("hidden.bs.modal", function (e) {
            $location.path("/storage");
            $scope.$apply();
        });
      };

      $scope.downloadData = function() {
        /* generate ccda from master health record for download */
        var CCDA = "mock ccda";
        var blob = new Blob([ CCDA ], { type : 'text/plain' });
        $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
        
        var downloadUrl = "api/v1/storage";
        fileDownload.downloadFile(downloadUrl, function(err, res) {
          if (err) {
            console.log(err);
          }
          console.log("GETTING RESPONSE");
          console.log(res);
        });
      };

 

      $scope.notifications = {};
        getNotifications.getUpdate(function(err, notifications) {
        $scope.notifications = notifications;
      });

      

    }
  ]);