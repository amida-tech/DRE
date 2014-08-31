angular.module('dre.match.review_new', ['directives.matchingObjects'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation/review/:section/:match_id', {
            templateUrl: 'templates/matching/reconciliation/review/review.tpl.html',
            controller: 'matchReviewCtrl'
        });
    }
])

.controller('matchReviewCtrl', ['$scope', '$http', '$routeParams', '$location', 'getNotifications', 'recordFunctions',
    function($scope, $http, $routeParams, $location, getNotifications, recordFunctions) {

        //getting parameters from route/url
        $scope.section = $routeParams["section"];
        $scope.match_id = $routeParams["match_id"];

        //fetching match object based on id
        $scope.match = {};
        $scope.new_entry = {};
        $scope.current_entry = {};
        $scope.update_entry = {};
        $scope.selectedItems = {};

        if ($scope.section === 'allergies') {
            $scope.selectedItems.observation = {};
            $scope.selectedItems.observation.reactions = [];
        } else if ($scope.section === 'encounters') {
            $scope.selectedItems.findings = [];

        }



        var max_src = 0;
        var max_dest = 0;


        $scope.rotateMatch = function(new_dest_index) {
            setMatchEntry(new_dest_index);
        };

        function setMatchEntry(match_index) {

            $scope.current_match_index = match_index;
            $scope.current_entry = $scope.match.matches[$scope.current_match_index].match_entry;
            $scope.update_entry = angular.copy($scope.current_entry);
            $scope.current_match = $scope.match.matches[$scope.current_match_index].match_object;
            $scope.current_queue = $scope.match.matches.slice($scope.current_match_index + 1);
            $scope.match_diff = angular.copy($scope.current_match.diff);
            $scope.match_percent = $scope.current_match.percent;

            //Restructure diff object booleans.
            for (var diff in $scope.match_diff) {
                if ($scope.match_diff[diff] === "duplicate") {
                    $scope.match_diff[diff] = true;
                } else {
                    $scope.match_diff[diff] = false;
                }
            }

            var tempArrayDiff;

            if ($scope.section === 'allergies') {

                //Extend Diff Object to include subarray.
                $scope.match_diff.observation = {};
                $scope.match_diff.observation.reactions = {};
                $scope.match_diff.observation.reactions.src = [];
                $scope.match_diff.observation.reactions.dest = [];

                for (var src_i in $scope.new_entry.observation.reactions) {
                    $scope.match_diff.observation.reactions.src.push(false);
                    $scope.selectedItems.observation.reactions.push(false);
                }

                for (var dest_i in $scope.current_entry.observation.reactions) {
                    $scope.match_diff.observation.reactions.dest.push(false);
                }
                tempArrayDiff = $scope.current_match.subelements.observation.reactions;
                for (var i in tempArrayDiff) {
                    if (tempArrayDiff[i].match === "duplicate") {
                        $scope.match_diff.observation.reactions.src[tempArrayDiff[i].src_id] = true;
                        $scope.match_diff.observation.reactions.dest[tempArrayDiff[i].dest_id] = true;
                    }
                }

            }

            if ($scope.section === 'encounters') {
                $scope.match_diff.findings = {};
                $scope.match_diff.findings.src = [];
                $scope.match_diff.findings.dest = [];


                for (var src_ei in $scope.new_entry.findings) {
                    $scope.match_diff.findings.src.push(false);
                    $scope.selectedItems.findings.push(false);
                }

                for (var dest_ei in $scope.current_entry.findings) {
                    $scope.match_diff.findings.dest.push(false);
                }
                tempArrayDiff = $scope.current_match.subelements.findings;

                for (var ei in tempArrayDiff) {
                    if (tempArrayDiff[ei].match === "duplicate") {
                        $scope.match_diff.findings.src[tempArrayDiff[ei].src_id] = true;
                        $scope.match_diff.findings.dest[tempArrayDiff[ei].dest_id] = true;
                    }
                }
            }

        }

        $scope.getMatch = function() {
            $http({
                method: 'GET',
                url: '/api/v1/match/' + $scope.section + '/' + $scope.match_id
            }).
            success(function(data, status, headers, config) {
                $scope.match = data;
                $scope.new_entry = $scope.match.entry;
                setMatchEntry(0);

            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.getMatch();

        $scope.discardMatch = function() {
            $http({
                method: 'POST',
                url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id,
                data: {
                    determination: 'ignored'
                }
            }).
            success(function(data, status, headers, config) {
                //Note:  Pill count not refreshing.
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.createMatch = function() {
            $http({
                method: 'POST',
                url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id,
                data: {
                    determination: 'added'
                }
            }).
            success(function(data, status, headers, config) {
                //Note:  Pill count not refreshing.
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.saveMatch = function() {
            $http({
                method: 'POST',
                url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id + '/' + $scope.current_match_index,
                data: {
                    determination: 'merged',
                    updated_entry: $scope.update_entry
                }
            }).
            success(function(data, status, headers, config) {
                //Note:  Pill count not refreshing.
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.newTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_new.tpl.html";
        $scope.recordTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_record.tpl.html";
        $scope.subTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_sub.tpl.html";

        /*if ($scope.section === 'allergies') {
            $scope.selectedItems.observation = {};
            $scope.selectedItems.observation.reactions = [];
        }*/

        //$scope.selectedItems.allergen = {};

        //TODO:  Inject reaction severity into display from object.
        $scope.selectField = function(entry, entry_index, entry_status) {

            //Don't process hidden items.
            if (entry_status) {
                return;
            }

            if (entry_index >= 0 && entry_index !== null) {

                if (entry.indexOf(".") > -1) {
                    var splitEntry = entry.split(".");
                    if (splitEntry.length === 2) {
                        if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index]) {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = true;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 0, $scope.new_entry[splitEntry[0]][splitEntry[1]][entry_index]);
                            $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 0, false);
                        } else {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = false;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                            $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 0, true);
                        }

                    }
                } else {

                    //console.log(entry);
                    //console.log($scope.selectedItems);

                    if (!$scope.selectedItems[entry][entry_index]) {
                        $scope.selectedItems[entry][entry_index] = true;
                        $scope.update_entry[entry].splice(entry_index, 0, $scope.new_entry[entry][entry_index]);
                        $scope.match_diff[entry].dest.splice(entry_index, 0, false);
                    } else {
                        $scope.selectedItems[entry][entry_index] = false;
                        $scope.update_entry[entry].splice(entry_index, 1);
                        $scope.match_diff[entry].dest.splice(entry_index, 0, true);
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

        //Custom code per section below.  Need to account for variations in diff objects.

        /*
            //Conditionally create sub arrays.
            if ($scope.section === 'allergies') {
                $scope.selectedItems.observation = {};
                $scope.selectedItems.observation.reaction = [];
                for (var maxi in $scope.current_match.subelements.observation.reactions) {
                    if ($scope.current_match.subelements.observation.reactions[maxi].src_id > max_src) {
                        max_src = $scope.current_match.subelements.observation.reactions[maxi].src_id;
                    }
                    if ($scope.current_match.subelements.observation.reactions[maxi].dest_id > max_dest) {
                        max_dest = $scope.current_match.subelements.observation.reactions[maxi].dest_id;
                    }
                }
            }*/

        /*$scope.entryType = function(input) {
            var response = 'str';
            if (angular.isObject(input)) {
                response = 'obj';
            }
            if (angular.isArray(input)) {
                response = 'arr';
            }
            return response;
        };*/

        /*

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
        }*/

    }
]);
