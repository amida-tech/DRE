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

angular.module('dre.match_new', ['directives.matchingObjects'])

.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/match_new', {
            templateUrl: 'templates/matching/matching_new/matching.tpl.html',
            controller: 'matchNewCtrl'
        });
    }
])

.controller('matchNewCtrl', ['$scope', '$http', '$location', 'getNotifications', 'recordFunctions',
    function ($scope, $http, $location, getNotifications, recordFunctions) {

        $scope.navPath = "templates/nav/nav.tpl.html";
        $scope.panelId = 1;

        //Need to initialize selection array.  May be able to walk original to build.
        $scope.selectedItems = {};
        $scope.selectedItems.allergen = {};

        //TODO:  Rewrite loop to create shell object for each entry.
        $scope.selectedItems.reaction = [{}];

        $scope.templatePath = "templates/matching/matching_new/templates/allergies.tpl.html";

        //TODO:  Inject reaction severity into display from object.

        $scope.selectAllClick = function (status) {
            if (status === true) {

            }

        };

        $scope.selectClick = function(selected, selection) {

            console.log(selected);
            console.log(selection);

            console.log($scope.selected);
            console.log('asdf');


        };

        $scope.panelSwitch = function(input) {
          $scope.panelId = input;
        };

        $scope.entryType = function(input) {
            var response = 'str';
            if (angular.isObject(input)) {
                response = 'obj';
            }
            if (angular.isArray(input)) {
                response = 'arr';
            }
            return response;
        };

        $scope.entry = {
            "allergen": {
                "name": "Codeine",
                "code": "2670",
                "code_system_name": "RXNORM",
                "translations": []
            },
            "date": [{
                "date": "2006-05-01T00:00:00.000Z",
                "precision": "day"
            }],
            "identifiers": [{
                "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
            }],
            "reaction": [{
                "severity": "Mild",
                "reaction": {
                    "name": "Wheezing",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT",
                    "translations": []
                }
            }],
            "severity": "Moderate",
            "status": "Active"
        };

        $scope.current_entry = {
            "allergen": {
                "name": "Codeine",
                "code": "2670",
                "code_system_name": "RXNORM",
                "translations": []
            },
            "date": [{
                "date": "2005-05-01T00:00:00.000Z",
                "precision": "day"
            }],
            "identifiers": [{
                "identifier": "4adc1020-7b14-11db-9fe1-0800200c9a66"
            }],
            "reaction": [{
                "severity": "Mild",
                "reaction": {
                    "name": "Wheezing",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT",
                    "translations": []
                }
            }],
            "severity": "Moderate",
            "status": "Active"
        };


        recordFunctions.formatDate($scope.entry.date);

    }
]);