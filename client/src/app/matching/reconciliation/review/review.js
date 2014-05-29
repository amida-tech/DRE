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

.controller('reviewCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', '$rootScope', 'recordFunctions',
    function($scope, $http, $location, $route, $routeParams, $rootScope, recordFunctions) {

        //set to false to hide JSON debug output in UI/templates
        $scope.debug=true;

        $scope.section = $routeParams["section"];
        $scope.index = $routeParams["index"];
        //$scope.match_element = {};
        $scope.src_id = $routeParams["src_id"];
        $scope.dest_id = $routeParams["dest_id"];
        $scope.dest_el = {};
        $scope.src_el = {};
        $scope.partial_matches = {};

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
            'demographics': 'demographics',
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

        $scope.merge = function(name){
            console.log(name);
            $scope.new_el[name]=$scope.src_el[name];
        };

        $scope.reconciliationClick = function() {
            $location.path("match/reconciliation");
        };
/*

        


        if ($scope.src_id==="undefined") {$scope.src_id=0;}
        if ($scope.dest_id==="undefined") {$scope.dest_id=0;}

        //HACK: loaded everything form rootScope
        $scope.matches = $rootScope.matches;
        $scope.partial_matches = $rootScope.partial_matches;
        $scope.src = $rootScope.src;
        $scope.dest = $rootScope.dest;
        $scope.lookup = $rootScope.lookup;

        if ($scope.section==="demographics"){
            $scope.src_el=$scope.src[$scope.section];
            //$scope.dest_el=$scope.dest[$scope.section];
            $scope.new_el=_.clone($scope.dest[$scope.section]);
        }

        $scope.encounter = $scope.src[$scope.section][$scope.src_id];



       */


    }
]);
