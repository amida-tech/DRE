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

.controller('reviewCtrl', ['$scope', '$http', '$location', '$route', '$routeParams', '$rootScope',
    function($scope, $http, $location, $route, $routeParams, $rootScope) {





        $scope.section = $routeParams["section"];
        $scope.index = $routeParams["index"];
        $scope.src_id = $routeParams["src_id"];
        $scope.dest_id = $routeParams["dest_id"];

        if ($scope.src_id==="undefined") {$scope.src_id=0;}
        if ($scope.dest_id==="undefined") {$scope.dest_id=0;}

        //HACK: loaded everything form rootScope
        $scope.matches = $rootScope.matches;
        $scope.partial_matches = $rootScope.partial_matches;
        $scope.src = $rootScope.src;
        $scope.dest = $rootScope.dest;
        $scope.lookup = $rootScope.lookup;


        $scope.src_el=$scope.src[$scope.section][$scope.src_id];
        $scope.dest_el=$scope.dest[$scope.section][$scope.dest_id];

        if ($scope.section==="demographics"){
            $scope.src_el=$scope.src[$scope.section];
            $scope.dest_el=$scope.dest[$scope.section];
            $scope.new_el=_.clone($scope.dest[$scope.section]);
        }


        $scope.encounter = $scope.src[$scope.section][$scope.src_id];

        $scope.reconciliationClick = function() {
            $location.path("match/reconciliation");
        };

        $scope.navPath = "templates/nav/nav.tpl.html";

        $scope.dynamicTemplatePath = "templates/matching/reconciliation/review/components/"+$scope.section+".tpl.html";


        $scope.saveReview = function() {
            $location.path("match/reconciliation");
        };
        $scope.cancelReview = function() {
            $location.path("match/reconciliation");
        };

        $scope.merge = function(name){
            console.log(name);
            $scope.new_el[name]=$scope.src_el[name];
        };


    }
]);
