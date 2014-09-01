angular.module('dre.match.review_new', ['directives.matchingObjects'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation/review/:section/:match_id', {
            templateUrl: 'templates/matching/reconciliation/review/review.tpl.html',
            controller: 'matchReviewCtrl'
        });
    }
])

.controller('matchReviewCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'getNotifications', 'recordFunctions',
        function($rootScope, $scope, $http, $routeParams, $location, getNotifications, recordFunctions) {

            $scope.titles = {
                allergies: "Allergies",
                encounters: "Encounters",
                immunizations: "Immunizations",
                medications: "Medications",
                problems: "Problem List",
                procedures: "Procedures",
                vitals: "Vital Signs",
                insurance: "Insurance",
                claims: "Claims",
                results: "Results",
                social_history: "Social History"
            };




            //getting parameters from route/url
            $scope.section = $routeParams["section"];
            $scope.match_id = $routeParams["match_id"];

            //shim for switching on new UI
            $scope.version = "old";
            if (["demographics", "-allergies", "insurance", "vitals", "encounters", "immunizations", "problems", "procedures", "results", "-social_history"].indexOf($scope.section.toString()) >= 0) {
                $scope.version = "new";
            }
            $scope.version = "new";


            //fetching match object based on id
            $scope.match = {};
            $scope.new_entry = {};
            $scope.current_entry = {};
            $scope.update_entry = {};
            $scope.selectedItems = {};
            $scope.changed = false;

            //function evaluates selectedItems object, and updates flag if any changes to MHR were made
            function isChanged() {
                for (var el in $scope.selectedItems) {
                    if ($scope.selectedItems[el]) {
                        $scope.changed = true;
                        return;
                    }
                }
                $scope.changed = false;
                return;
            }

            if ($scope.section === 'allergies') {
                $scope.selectedItems.observation = {};
                $scope.selectedItems.observation.reactions = [];
            } else if ($scope.section === 'encounters') {
                $scope.selectedItems.findings = [];

            } else if ($scope.section === 'results') {
                $scope.selectedItems.results = [];
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

                //Build out empty match diff objects as false.
                for (var diffEntry in $scope.current_entry) {
                    if ($scope.new_entry[diffEntry] === undefined) {
                        $scope.match_diff[diffEntry] = true;
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

                    //Allergies shim based on object brevity.
                    for (var temp_current_diff in $scope.current_entry.observation) {
                        if ($scope.new_entry.observation[temp_current_diff] === undefined) {
                            //console.log(temp_current_diff);
                            $scope.match_diff.observation[temp_current_diff] = true;
                        } else {
                            //console.log("deep check");
                            if (angular.equals($scope.new_entry.observation[temp_current_diff], $scope.current_entry.observation[temp_current_diff])) {
                                $scope.match_diff.observation[temp_current_diff] = true;
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

                    if ($scope.section === 'results') {
                        $scope.match_diff.results = {};
                        $scope.match_diff.results.src = [];
                        $scope.match_diff.results.dest = [];

                        for (var src_ri in $scope.new_entry.results) {
                            $scope.match_diff.results.src.push(false);
                            $scope.selectedItems.results.push(false);
                        }

                        for (var dest_ri in $scope.current_entry.results) {
                            $scope.match_diff.results.dest.push(false);
                        }
                        tempArrayDiff = $scope.current_match.subelements.results;

                        for (var ri in tempArrayDiff) {
                            if (tempArrayDiff[ri].match === "duplicate") {
                                $scope.match_diff.findings.src[tempArrayDiff[ri].src_id] = true;
                                $scope.match_diff.findings.dest[tempArrayDiff[ri].dest_id] = true;
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


                        getNotifications.getUpdate(function(err, notifications) {
                            $rootScope.notifications = notifications;
                        });

                        $location.path("match/reconciliation");
                    }).
                    error(function(data, status, headers, config) {
                        console.log('error');
                    });
                };

                $scope.v2TemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_v2.tpl.html";

                $scope.newTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_new.tpl.html";
                $scope.recordTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_record.tpl.html";
                $scope.subTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_sub.tpl.html";



                $scope.removeField = function(entry, entry_index, entry_status) {


                    //Don't process hidden items.
                    if (entry_status) {
                        return;
                    }

                    var splitEntry = [];


                    //Only array objects should get indexes.
                    if (entry_index >= 0 && entry_index !== null) {

                        //Handles dot nesting.
                        if (entry.indexOf(".") > -1) {
                            splitEntry = entry.split(".");
                            if (splitEntry.length === 2) {
                                if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index]) {
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                                    $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 1);
                                } else {
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = false;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                                    $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 1);
                                }

                            }
                            //Handles subarrays.
                        } else {
                            if (!$scope.selectedItems[entry][entry_index]) {
                                $scope.update_entry[entry].splice(entry_index, 1);
                                $scope.match_diff[entry].dest.splice(entry_index, 1);
                            } else {
                                $scope.selectedItems[entry][entry_index] = false;
                                $scope.update_entry[entry].splice(entry_index, 1);
                                $scope.match_diff[entry].dest.splice(entry_index, 1);
                            }
                        }
                        //Handles regular.
                    } else {

                        if (entry.indexOf(".") > -1) {
                            splitEntry = entry.split(".");
                            if (splitEntry.length === 2) {
                                if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]]) {
                                    //console.log($scope.new_entry);
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]] = true;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.new_entry[splitEntry[0]][splitEntry[1]];
                                } else {
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]] = false;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.current_entry[splitEntry[0]][splitEntry[1]];
                                }
                            }
                            //Handles subarrays.
                        } else {
                            if (!$scope.selectedItems[entry]) {
                                console.log($scope.new_entry);
                                $scope.selectedItems[entry] = true;
                                $scope.update_entry[entry] = $scope.new_entry[entry];
                            } else {
                                $scope.selectedItems[entry] = false;
                                $scope.update_entry[entry] = $scope.current_entry[entry];
                            }
                        }

                    }

                    //recalculate changed status
                    isChanged();

                };





                $scope.selectField = function(entry, entry_index, entry_status) {
                    console.log("select field", entry, entry_status);
                    if ($scope.selectedItems[entry] === true) {
                        console.log("cancel");
                        return;
                    }
                    //Don't process hidden items.
                    if (entry_status) {
                        return;
                    }

                    var splitEntry = [];

                    if (entry_index >= 0 && entry_index !== null) {

                        //Handles dot nesting.
                        if (entry.indexOf(".") > -1) {
                            splitEntry = entry.split(".");
                            if (splitEntry.length === 2) {
                                if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index]) {
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = true;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 0, $scope.new_entry[splitEntry[0]][splitEntry[1]][entry_index]);
                                    $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 0, false);
                                } else {
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = false;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                                    //$scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 0, true);
                                    $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 1);
                                }

                            }
                            //Handles subarrays.
                        } else {
                            if (!$scope.selectedItems[entry][entry_index]) {
                                $scope.selectedItems[entry][entry_index] = true;
                                $scope.update_entry[entry].splice(entry_index, 0, $scope.new_entry[entry][entry_index]);
                                //Need to inject because adding a record
                                $scope.match_diff[entry].dest.splice(entry_index, 0, false);
                                //$scope.match_diff[entry].dest[entry_index] = false;
                            } else {
                                $scope.selectedItems[entry][entry_index] = false;
                                $scope.update_entry[entry].splice(entry_index, 1);
                                $scope.match_diff[entry].dest.splice(entry_index, 1);
                            }
                        }
                        //Handles regular.
                    } else {

                        if (entry.indexOf(".") > -1) {
                            splitEntry = entry.split(".");
                            if (splitEntry.length === 2) {
                                if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]]) {
                                    //console.log($scope.new_entry);
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]] = true;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.new_entry[splitEntry[0]][splitEntry[1]];
                                } else {
                                    $scope.selectedItems[splitEntry[0]][splitEntry[1]] = false;
                                    $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.current_entry[splitEntry[0]][splitEntry[1]];
                                }
                            }
                            //Handles subarrays.
                        } else {
                            if (!$scope.selectedItems[entry]) {
                                console.log($scope.new_entry);
                                $scope.selectedItems[entry] = true;
                                $scope.update_entry[entry] = $scope.new_entry[entry];
                            } else {
                                $scope.selectedItems[entry] = false;
                                $scope.update_entry[entry] = $scope.current_entry[entry];
                            }
                        }

                    }

                    //recalculate changed status
                    isChanged();

                };

            }
        ]);
