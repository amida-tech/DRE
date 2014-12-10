'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordEncountersReviewCtrl
 * @description
 * # RecordEncountersReviewCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordEncountersReviewCtrl', function ($scope, $location, encounters, format) {
        $scope.entryType = 'encounters';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.inactiveFlag = false;
        $scope.partialEntries = [];
        $scope.alertShow = true;
        $scope.match = [];

        //Instantiate empty clone of object structure.
        var selectedOriginal = {
            "findings": {}
        };

        $scope.selected = angular.copy(selectedOriginal);

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getRecords(callback) {
            encounters.getRecord(function (err, results) {
                $scope.masterEntries = results;
                $scope.entries = results;
                callback();
            });
        }

        function getPartial(callback) {
            encounters.getPartialRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getMatch(callback) {
            encounters.getPartialMatch(function (err, results) {
                $scope.match = results;

                //Duplicate originals for restore.
                _.each($scope.match, function (match) {
                    match.origMatch = angular.copy(match.srcMatch.data);
                })

                callback();
            });
        }

        function formatDates() {
            //Add displayDate to all entries.
            _.each($scope.match, function (entry) {

            	//newMatch
                if (entry.newMatch.date_time) {
                    _.each(entry.newMatch.date_time, function (dateEntry) {
                        format.formatDate(dateEntry);
                    });
					entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);
					entry.newMatch.date_time.plotDate = format.plotDate(entry.newMatch.date_time);
                }

                if (entry.newMatch.findings) {
                	_.each(entry.newMatch.findings, function (finding) {
                		if (finding.date_time) {
                			_.each(finding.date_time, function(dateEntry) {
                				format.formatDate(dateEntry);
                			});
                			finding.date_time.displayDate = format.outputDate(finding.date_time);
                		}
                	});
                }
            	//srcMatch.data
                if (entry.srcMatch.data.date_time) {
                    _.each(entry.srcMatch.data.date_time, function (dateEntry) {
                        format.formatDate(dateEntry);
                    });
					entry.srcMatch.data.date_time.displayDate = format.outputDate(entry.srcMatch.data.date_time);
					entry.srcMatch.data.date_time.plotDate = format.plotDate(entry.srcMatch.data.date_time);
                }

                if (entry.srcMatch.data.findings) {
                	_.each(entry.srcMatch.data.findings, function (finding) {
                		if (finding.date_time) {
                			_.each(finding.date_time, function(dateEntry) {
                				format.formatDate(dateEntry);
                			});
                			finding.date_time.displayDate = format.outputDate(finding.date_time);
                		}
                	});
                }

            });
        }

        $scope.selectEntry = function (matchIndex) {
            _.each($scope.selected, function (elem, name, list) {

                if (elem === true) {
                    $scope.match[matchIndex].srcMatch.data[name] = $scope.match[matchIndex].newMatch[name];
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch.data[name] = $scope.match[matchIndex].origMatch[name];
                    formatDates();
                } else if (_.isObject(elem)) {
                    //Explicitly handle findings.
                    _.each(elem, function (rElem, rName, rList) {

                        if (rElem === true) {

                            var newFinding = $scope.match[matchIndex].newMatch[name];
                            newFinding.dataIndex = rName;

                            if (!$scope.match[matchIndex].srcMatch.data[name]) {
                                $scope.match[matchIndex].srcMatch.data[name] = [];
                            }
                            $scope.match[matchIndex].srcMatch.data[name].push(newFinding[rName]);
                        } else if (rElem === false) {

                        	$scope.match[matchIndex].srcMatch.data[name].splice(rName);

                            //Index to splice.
                            //console.log(rName);

                            // _.each($scope.match[matchIndex].srcMatch.data[name], function (rxElem, rxName, rxList) {

                            //     if (rxElem.srcMatch.dataIndex) {
                            //         if (rxElem.srcMatch.dataIndex === rName) {
                            //             //Splice ID.
                            //             console.log(rxName);
                            //             $scope.match[matchIndex].srcMatch.data[name].splice(rxName);
                            //         }
                            //     }
                            // });
                        }

                    });

                }

            });

        }

        $scope.clearAll = function (matchIndex) {

            $scope.selected = angular.copy(selectedOriginal);  
            $scope.match[matchIndex].srcMatch.data = angular.copy($scope.match[matchIndex].origMatch);
            formatDates();

        }

        $scope.saveUpdate = function (matchIndex) {

            console.log($scope.match[matchIndex].srcMatch.data);

            encounters.saveEntry($scope.match[matchIndex].srcMatch.data, function (err) {

                $location.path('/record/encounters');


            });

        }

        $scope.refresh = function () {
            getMatch(function (err) {
                formatDates();
            });
        }

        $scope.refresh();
  });
