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
        $scope.selectedItems.reaction = [];
        //$scope.selectedItems.allergen = {};

        $scope.newTemplatePath = "templates/matching/matching_new/templates/allergies_new.tpl.html";
        $scope.recordTemplatePath = "templates/matching/matching_new/templates/allergies_record.tpl.html";

        //TODO:  Inject reaction severity into display from object.

        $scope.selectField = function (entry, entry_index, entry_status) {

            //Don't process hidden items.
            if (entry_status) {
                return;
            }

            if (entry_index >= 0 && entry_index !== null) {
                if (!$scope.selectedItems[entry][entry_index]) {
                    $scope.selectedItems[entry][entry_index] = true;
                    $scope.update_entry[entry][entry_index] = $scope.new_entry[entry][entry_index];
                } else {
                    $scope.selectedItems[entry][entry_index] = false;
                    if ($scope.current_entry[entry][entry_index] !== undefined) {
                        $scope.update_entry[entry][entry_index] = $scope.current_entry[entry][entry_index];    
                    } else {
                        $scope.update_entry[entry].splice([entry_index], 1);
                    }
                }

            } else {
                if (!$scope.selectedItems[entry]) {
                    $scope.selectedItems[entry] = true;
                    $scope.update_entry[entry] = $scope.new_entry[entry];
                } else {
                    $scope.selectedItems[entry] = false;
                    $scope.update_entry[entry] = $scope.current_entry[entry];
                }

            }

        };

        $scope.selectClick = function (selected, selection) {

            console.log(selected);
            console.log(selection);

            console.log($scope.selected);
            console.log('asdf');

        };

        $scope.panelSwitch = function (input) {
            $scope.panelId = input;
        };

        $scope.entryType = function (input) {
            var response = 'str';
            if (angular.isObject(input)) {
                response = 'obj';
            }
            if (angular.isArray(input)) {
                response = 'arr';
            }
            return response;
        };

        $scope.new_entry = {
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
            }, {
                "severity": "Mild",
                "reaction": {
                    "name": "Nausea",
                    "code": "56018004",
                    "code_system_name": "SNOMED CT",
                    "translations": []
                }
            }],
            "severity": "Severe",
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

        $scope.update_entry = {
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

        $scope.sample_match = {
            "match": "partial",
            "percent": 50,
            "subelements": {
                "reaction": [{
                    "match": "new",
                    "percent": 0,
                    "src_id": "1",
                    "dest_id": "0",
                    "dest": "dest"
                }]
            },
            "diff": {
                "date_time": "duplicate",
                "identifiers": "duplicate",
                "allergen": "duplicate",
                "severity": "new",
                "status": "duplicate",
                "reaction": "new"
            },
            "src_id": "0",
            "dest_id": "0",
            "dest": "dest"
        };

        for (var i in $scope.new_entry.reaction) {
            $scope.selectedItems.reaction.push(false);
        }


        //Restructure diff object booleans.
        $scope.match_diff = $scope.sample_match.diff;
        for (var diff in $scope.match_diff) {
            if ($scope.match_diff[diff] === "duplicate") {
                $scope.match_diff[diff] = true;
            } else {
                $scope.match_diff[diff] = false;
            }
        }

        //Build out sub-diff objects.
        var max_src = 0;
        var max_dest = 0;
        for (var maxi in $scope.sample_match.subelements.reaction) {
            if ($scope.sample_match.subelements.reaction[maxi].src_id > max_src) {
                max_src = $scope.sample_match.subelements.reaction[maxi].src_id;
            }
            if ($scope.sample_match.subelements.reaction[maxi].dest_id > max_dest) {
                max_dest = $scope.sample_match.subelements.reaction[maxi].dest_id;
            }
        }


        //Inject subelement reactions to diff.
        for (var reaction in $scope.sample_match.subelements.reaction) {

            if ($scope.sample_match.subelements.reaction[reaction].match === 'new') {

                //console.log($scope.sample_match.subelements.reaction[reaction]);

            }
        }

        recordFunctions.formatDate($scope.new_entry.date);
        recordFunctions.formatDate($scope.current_entry.date);

    }
]);