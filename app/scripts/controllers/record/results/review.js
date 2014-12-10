'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordResultsReviewCtrl
 * @description
 * # RecordResultsReviewCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordResultsReviewCtrl', function ($scope, $location, results, format) {

        $scope.entryType = 'results';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.partialEntries = [];
        $scope.alertShow = true;
        $scope.match = [];

        //Instantiate empty clone of object structure.
        var selectedOriginal = {
            "result_set": null,
            "results": null
        };

        $scope.selected = angular.copy(selectedOriginal);

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getRecords(callback) {
            results.getRecord(function (err, results) {
                $scope.masterEntries = results;
                $scope.entries = results;
                callback();
            });
        }

        function getPartial(callback) {
            results.getPartialRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getMatch(callback) {
            results.getPartialMatch(function (err, results) {
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

        function formatDisplay() {
        	_.each($scope.match, function(entry) {
        			format.formatQuantity(entry.newMatch);
        			format.formatQuantity(entry.srcMatch);
        		
        	});
        }
        
        $scope.selectEntry = function (matchIndex) {
            _.each($scope.selected, function (elem, name, list) {

                if (elem === true) {
                    $scope.match[matchIndex].srcMatch = $scope.match[matchIndex].newMatch;
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch = $scope.match[matchIndex].origMatch;
                    formatDates();
                    formatDisplay();
                } else if (_.isObject(elem)) {
                    // Handle status
                    if (elem.status === true) {
                        $scope.match[matchIndex].srcMatch[name].status = $scope.match[matchIndex].newMatch[name].status;
                    } else if (elem.status === false) {
                        $scope.match[matchIndex].srcMatch[name].status = $scope.match[matchIndex].origMatch[name].status;
                    }

                }

            });

        }

        $scope.clearAll = function (matchIndex) {

            $scope.selected = angular.copy(selectedOriginal);  
            $scope.match[matchIndex].srcMatch = angular.copy($scope.match[matchIndex].origMatch);
            formatDates();
            formatDisplay();

        }

        $scope.saveUpdate = function (matchIndex) {

            console.log($scope.match[matchIndex].srcMatch);

            results.saveEntry($scope.match[matchIndex].srcMatch, function (err) {

                $location.path('/record/results');


            });

        }

        $scope.refresh = function () {
            getMatch(function (err) {
                formatDates();
                formatDisplay();
            });
        }

        $scope.refresh();
  });
