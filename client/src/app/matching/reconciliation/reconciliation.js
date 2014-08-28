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

angular.module('dre.match.reconciliation', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation', {
            templateUrl: 'templates/matching/reconciliation/reconciliation.tpl.html',
            controller: 'reconciliationCtrl'
        });
    }
])

.controller('reconciliationCtrl', ['$scope', '$http', '$location', '$rootScope', 'recordFunctions',
    function($scope, $http, $location, $rootScope, recordFunctions) {

        $scope.reviewClick = function(match) {
            //alert(JSON.stringify(match));
            console.log("Review Match Click!");
            console.log(JSON.stringify(match,null,4));

            //pass section name and _id of the match object only
            $location.path("match/reconciliation/review/" + match.entry_type + "/" + match._id);
        };

        $scope.matches = {};

        $scope.capitalize = function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        };

        $scope.getMatches = function() {
            var sections = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems', 'insurance', 'claims'];
            //var sections = ['allergies'];

            function getMatchSections(loadsec) {
                //console.log(loadsec);
                $http({
                    method: 'GET',
                    url: '/api/v1/matches/' + loadsec
                }).
                success(function(data, status, headers, config) {
                    //console.log(data.matches);

                    for (var iM in data.matches) {

                        data.matches[iM].entry = recordFunctions.extractName(data.matches[iM].entry, loadsec);
                        data.matches[iM].singular_section = recordFunctions.singularizeSection(data.matches[iM].entry_type);
                        //console.log(data.matches[iM]);

                    }

                    $scope.matches[loadsec] = data.matches;
                    //console.log(JSON.stringify($scope.masterMatch, null, 10));
                }).
                error(function(data, status, headers, config) {
                    console.log('error');
                });
            }

            for (var i in sections) {
                getMatchSections(sections[i]);
            }
        };

        $scope.getMatches();



    }
]);
