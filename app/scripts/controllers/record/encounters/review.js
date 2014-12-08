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
                    match.origMatch = angular.copy(match.srcMatch);
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
            	//srcMatch
                if (entry.srcMatch.date_time) {
                    _.each(entry.srcMatch.date_time, function (dateEntry) {
                        format.formatDate(dateEntry);
                    });
					entry.srcMatch.date_time.displayDate = format.outputDate(entry.srcMatch.date_time);
					entry.srcMatch.date_time.plotDate = format.plotDate(entry.srcMatch.date_time);
                }

                if (entry.srcMatch.findings) {
                	_.each(entry.srcMatch.findings, function (finding) {
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
                    $scope.match[matchIndex].srcMatch[name] = $scope.match[matchIndex].newMatch[name];
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch[name] = $scope.match[matchIndex].origMatch[name];
                    formatDates();
                } else if (_.isObject(elem)) {
                    //Explicitly handle findings.
                    _.each(elem.findings, function (rElem, rName, rList) {

                        if (rElem === true) {

                            var newFinding = $scope.match[matchIndex].newMatch[name].findings[rName];
                            newFinding.srcMatchIndex = rName;

                            if (!$scope.match[matchIndex].srcMatch[name].findings[rName]) {
                                $scope.match[matchIndex].srcMatch[name].findings[rName] = [];
                            }

                            $scope.match[matchIndex].srcMatch[name].findings.push(newFinding);
                        } else if (rElem === false) {

                            //Index to splice.
                            //console.log(rName);

                            _.each($scope.match[matchIndex].srcMatch[name].findings, function (rxElem, rxName, rxList) {

                                if (rxElem.srcMatchIndex) {
                                    if (rxElem.srcMatchIndex === rName) {
                                        //Splice ID.
                                        console.log(rxName);
                                        $scope.match[matchIndex].srcMatch[name].findings.splice(rxName);
                                    }
                                }
                            });
                        }

                    });

                }

            });

        }

        $scope.clearAll = function (matchIndex) {

            $scope.selected = angular.copy(selectedOriginal);  
            $scope.match[matchIndex].srcMatch = angular.copy($scope.match[matchIndex].origMatch);
            formatDates();

        }

        $scope.saveUpdate = function (matchIndex) {

            console.log($scope.match[matchIndex].srcMatch);

            encounters.saveEntry($scope.match[matchIndex].srcMatch, function (err) {

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
