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
            "observation": {
                "status": null,
                "reactions": {}
            }
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

                //Format newMatch Date Display.
                _.each(entry.newMatch.date_time, function (dateEntry) {
                    format.formatDate(dateEntry);
                });
                entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);

                //Format srcMatch Date Display.
                _.each(entry.srcMatch.date_time, function (dateEntry) {
                    format.formatDate(dateEntry);
                });
                entry.srcMatch.date_time.displayDate = format.outputDate(entry.srcMatch.date_time);

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
                    // Handle status
                    if (elem.status === true) {
                        $scope.match[matchIndex].srcMatch[name].status = $scope.match[matchIndex].newMatch[name].status;
                    } else if (elem.status === false) {
                        $scope.match[matchIndex].srcMatch[name].status = $scope.match[matchIndex].origMatch[name].status;
                    }
                    //Explicitly handle reactions.
                    _.each(elem.reactions, function (rElem, rName, rList) {

                        if (rElem === true) {

                            var newReaction = $scope.match[matchIndex].newMatch[name].reactions[rName];
                            newReaction.srcMatchIndex = rName;

                            if (!$scope.match[matchIndex].srcMatch[name].reactions) {
                                $scope.match[matchIndex].srcMatch[name].reactions = [];
                            }

                            $scope.match[matchIndex].srcMatch[name].reactions.push(newReaction);
                        } else if (rElem === false) {

                            //Index to splice.
                            //console.log(rName);

                            _.each($scope.match[matchIndex].srcMatch[name].reactions, function (rxElem, rxName, rxList) {

                                if (rxElem.srcMatchIndex) {
                                    if (rxElem.srcMatchIndex === rName) {
                                        //Splice ID.
                                        console.log(rxName);
                                        $scope.match[matchIndex].srcMatch[name].reactions.splice(rxName);
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

            allergies.saveEntry($scope.match[matchIndex].srcMatch, function (err) {

                $location.path('/record/allergies');


            });

        }

        $scope.refresh = function () {
            getMatch(function (err) {
                formatDates();
            });
        }

        $scope.refresh();
  });
