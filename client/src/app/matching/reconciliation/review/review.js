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

angular.module('dre.match.review', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation/review', {
            templateUrl: 'templates/matching/reconciliation/review/review.tpl.html',
            controller: 'reviewCtrl'
        });

        $routeProvider.when('/match/reconciliation/review/:section/:index/:src_id/:dest_id', {
            templateUrl: 'templates/matching/reconciliation/review/review.tpl.html',
            controller: 'reviewCtrl'
        });

    }
])

.controller('reviewCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', '$rootScope', 'recordFunctions', 'getNotifications',
    function($scope, $http, $location, $route, $routeParams, $rootScope, recordFunctions, getNotifications) {
        $scope.notifications = {};

        $scope.modified=false;


        getNotifications.getUpdate(function(err, notifications) {
          $scope.notifications = notifications;
        });

        //set to false to hide JSON debug output in UI/templates
        $scope.debug=false;

        $scope.section = $routeParams["section"];
        $scope.index = $routeParams["index"];
        //$scope.match_element = {};
        $scope.src_id = $routeParams["src_id"];
        $scope.dest_id = $routeParams["dest_id"];
        $scope.dest_el = {};
        $scope.dest_copy_el = {}; //copy of master for reset purposes (in merge)
        $scope.src_el = {};
        $scope.partial_matches = {};
        $scope.diff = {};

    $scope.convertTense = function(inputSection) {
        var lookup = {
            'allergy': 'allergies',
            'encounter': 'encounters',
            'immunization': 'immunizations',
            'result': 'results',
            'medication': 'medications',
            'problem': 'problems',
            'procedure': 'procedures',
            'vital': 'vitals',
            'demographic': 'demographics',
            'social': 'socialHistory'
        };
        return lookup[inputSection];

    };

     $scope.navPath = "templates/nav/nav.tpl.html";

    $scope.dynamicTemplatePath = "templates/matching/reconciliation/review/components/"+$scope.convertTense($scope.section)+".tpl.html";

    $scope.getMatch = function(matchSection) {
        console.log(">>",matchSection);
            $http({
                method: 'GET',
                url: '/api/v1/matches/' + matchSection
            }).
            success(function(data, status, headers, config) {
                for (var i in data.matches) {
                    if (data.matches[i]._id === $scope.index) {
                        $scope.partial_matches = data.matches[i];
                        $scope.diff=$scope.partial_matches.diff;
                        //console.log($scope.partial_matches);
                    }
                }
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });

    };

    //console.log($scope.convertTense($scope.section));
    $scope.getMatch($scope.convertTense($scope.section));

        //load partials and pull right one from url string param.
        function getPartialSections(loadsec) {
            console.log(loadsec);
            $http({
                method: 'GET',
                url: '/api/v1/record/partial/' + loadsec
            }).
            success(function(data, status, headers, config) {
                for (var i in data[loadsec]) {
                    console.log(data[loadsec][i]._id);
                    //console.log($scope.dest_id);
                    if (data[loadsec][i]._id === $scope.dest_id) {
                            $scope.src_el = data[loadsec][i];    
                    }
                }
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        function getMasterSections(loadsec) {
            //console.log(loadsec);
            $http({
                method: 'GET',
                url: '/api/v1/record/' + loadsec
            }).
            success(function(data, status, headers, config) {
                for (var i in data[loadsec]) {
                    //console.log(data[loadsec][i]._id);
                    //console.log($scope.dest_id);
                    if (data[loadsec][i]._id === $scope.src_id) {
                        $scope.dest_el = data[loadsec][i];
                        $scope.dest_copy_el = angular.copy($scope.dest_el);
                    }
                }
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        getPartialSections($scope.convertTense($scope.section));
        getMasterSections($scope.convertTense($scope.section));

        $scope.saveReview = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.convertTense($scope.section);

            $http({
                method: 'POST',
                url: '/api/v1/matches/' + updateSection + '/' + $scope.partial_matches._id,
                data: {determination: 'merged'}
            }).
            success(function(data, status, headers, config) {
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.ignoreReview = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.convertTense($scope.section);

            $http({
                method: 'POST',
                url: '/api/v1/matches/' + updateSection + '/' + $scope.partial_matches._id,
                data: {determination: 'ignored'}
            }).
            success(function(data, status, headers, config) {
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.cancelReview = function() {
            $location.path("match/reconciliation");
        };

        //merges fields from New Entry into Master Record
        $scope.merge = function(name){
            console.log(name);
            $scope.dest_el[name]=$scope.src_el[name];
            $scope.modified=true;
        };

        //merges fields from New Entry into Master Record
        $scope.merge_date = function(date, index){
            $scope.dest_el[date][index]=$scope.src_el[date][index];
            $scope.modified=true;
        };

        //resets Master Record from copy
        $scope.reset = function(){
            $scope.dest_el=angular.copy($scope.dest_copy_el);
            $scope.modified=false;
        };


        //merges fields from New Entry into Master Record
        $scope.merge_sub = function(name, index){
            console.log(name, index);
            $scope.dest_el[name].push($scope.src_el[name][index]);
            $scope.modified=true;
        };
        $scope.remove_sub = function(name, index){
            console.log(name, index);
            $scope.dest_el[name].splice(index,1);
            $scope.modified=true;
        };


        $scope.reconciliationClick = function() {
            $location.path("match/reconciliation");
        };

    }
]);
