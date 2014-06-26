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
        $scope.added_subelements={};

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
        $scope.src_copy_el = {}; //copy of new entry for reset purposes (in merge)
        $scope.partial_matches = {};
        $scope.diff = {};

    $scope.navPath = "templates/nav/nav.tpl.html";

    $scope.dynamicTemplatePath = "templates/matching/reconciliation/review/components/"+$scope.section+".tpl.html";

    $scope.getMatch = function(matchSection) {
        //console.log(">>",matchSection);
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

    $scope.getMatch($scope.section);

        //load partials and pull right one from url string param.
        function getPartialSections(loadsec) {
            //console.log(loadsec);
            $http({
                method: 'GET',
                url: '/api/v1/record/partial/' + loadsec
            }).
            success(function(data, status, headers, config) {
                for (var i in data[loadsec]) {

                    recordFunctions.extractName(data[loadsec][i]);
                    //console.log(data[loadsec][i]);
                    //console.log($scope.dest_id);
                    if (data[loadsec][i]._id === $scope.dest_id) {
                            $scope.src_el = data[loadsec][i];    
                            $scope.src_copy_el = angular.copy($scope.src_el);

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
                    recordFunctions.extractName(data[loadsec][i]);
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

        getPartialSections($scope.section);
        getMasterSections($scope.section);


        //close match, save new entry as separate entry from master entry
        $scope.createNew = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.section;

            $http({
                method: 'POST',
                url: '/api/v1/matches/' + updateSection + '/' + $scope.partial_matches._id,
                data: {determination: 'added'}
            }).
            success(function(data, status, headers, config) {
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        //close match, ignore new entry, update master entry with user's changes (based on new entry)
        $scope.saveUpdate = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.section;

            $http({
                method: 'POST',
                url: '/api/v1/matches/' + updateSection + '/' + $scope.partial_matches._id,
                data: {determination: 'merged', updated_entry: $scope.dest_el} //TODO: need value for update entry (using dest_el for now)
            }).
            success(function(data, status, headers, config) {
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        //close match, ignore new entry, keep master entry same
        $scope.ignoreUpdate = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.section;

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
        
        //This call is discontinued in favor of cancelReview, createNew, ignoreUpdate, saveUpdate
        $scope.saveReview = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.section;

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

        //This call is discontinued in favor of cancelReview, createNew, ignoreUpdate, saveUpdate
        $scope.ignoreReview = function() {
            //console.log($scope.partial_matches._id);
            var updateSection = $scope.section;

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

        //go back to list of all partial matches
        $scope.cancelReview = function() {
            $location.path("match/reconciliation");
        };

        //merges fields from New Entry into Master Record
        $scope.merge = function(name){
            $scope.dest_el[name]=$scope.src_el[name];
            $scope.modified=true;
        };

        //custom social history merger.
        $scope.mergeSocial = function(section, component) {
            //console.log(section);
            //console.log($scope.src_el[section][0][component]);
            $scope.dest_el[section][0][component]=$scope.src_el[section][0][component];
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
            $scope.src_el=angular.copy($scope.src_copy_el);
            $scope.modified=false;
            $scope.added_subelements={};
        };


        //merges fields from New Entry into Master Record
        $scope.merge_sub = function(name, index){
            //console.log(name, index);
            $scope.dest_el[name].push($scope.src_el[name][index]);
            $scope.modified=true;
            $scope.added_subelements[index]=true;

        };
        $scope.remove_sub = function(name, index){
            //console.log(name, index);
            $scope.dest_el[name].splice(index,1);
            $scope.modified=true;
        };

        //return info about subelements, e.g. if index is new or duplicate
        $scope.is_new=function(index){
            return _.where($scope.partial_matches.subelements,{src_id:""+index})[0].match;
        };

        $scope.reconciliationClick = function() {
            $location.path("match/reconciliation");
        };

    }
]);
