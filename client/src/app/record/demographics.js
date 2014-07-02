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

angular.module('dre.demographics', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/profile', {
      templateUrl: 'templates/record/demographics.tpl.html',
      controller: 'demographicsCtrl'
    });
  }
])

.controller('demographicsCtrl', ['$scope', '$http', '$q', '$location', 'getNotifications', 'recordFunctions',
  function($scope, $http, $q, $location, getNotifications, recordFunctions) {

    $scope.demographics = [];
    $scope.displayDemographics = false;
    $scope.demographicsPredicate = "-severity_weight";

    $scope.notifications = {};
    getNotifications.getUpdate(function(err, notifications) {
      $scope.notifications = notifications;
    });

    $scope.getRecord = function() {
      $q.all([
        $http({
          method: 'GET',
          url: '/api/v1/record/demographics'
        }), 
        $http({
          method: 'GET',
          url: '/api/v1/record/social_history'
        })]).then(function(response) {
        var data = response[0].data;
        $scope.demographics = data.demographics[0];
        if (data.demographics.length > 0) {
          $scope.displayDemographics = true;
        } else {
          $scope.displayDemographics = false;
        }
        //console.log(response[1].data);
        var socialData = response[1].data;
        $scope.demographics.smoking_status = socialData.social_history[0].smoking_statuses[0].value;
        
      }, function(response) {
        console.log('error');
      });
    };

    $scope.getStub = function() {
      $scope.displayDemographics = true;
      $scope.demographics = {
        "name": {
          "middle": [
            "Isa"
          ],
          "last": "Jones",
          "first": "Isabella"
        },
        "dob": [{
          "date": "1975-05-01T00:00:00.000Z",
          "precision": "day"
        }],
        "gender": "Female",
        "identifiers": [{
          "identifier": "2.16.840.1.113883.19.5.99999.2",
          "identifier_type": "998991"
        }, {
          "identifier": "2.16.840.1.113883.4.1",
          "identifier_type": "111-00-2330"
        }],
        "marital_status": "Married",
        "addresses": [{
          "streetLines": [
            "1357 Amber Drive"
          ],
          "city": "Beaverton",
          "state": "OR",
          "zip": "97867",
          "country": "US",
          "use": "primary home"
        }],
        "phone": [{
          "number": "(816)276-6909",
          "type": "primary home"
        }],
        "race_ethnicity": "White",
        "languages": [{
          "language": "en",
          "preferred": true,
          "mode": "Expressed spoken",
          "proficiency": "Good"
        }],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
          "city": "Beaverton",
          "state": "OR",
          "zip": "97867",
          "country": "US"
        },
        "guardians": [{
          "relation": "Parent",
          "addresses": [{
            "streetLines": [
              "1357 Amber Drive"
            ],
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US",
            "use": "primary home"
          }],
          "names": [{
            "last": "Jones",
            "first": "Ralph"
          }],
          "phone": [{
            "number": "(816)276-6909",
            "type": "primary home"
          }]
        }]
      };

    };

    $scope.getRecord();
    //$scope.getStub();


  }
]);