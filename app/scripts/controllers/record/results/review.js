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
                    match.origMatch = angular.copy(match.srcMatch.data);
                })

                callback();
            });
        }

        // function formatDates() {
        //     //Add displayDate to all entries.
        //     _.each($scope.match, function (entry) {

        //         //Format newMatch Date Display.
        //         _.each(entry.newMatch.date_time, function (dateEntry) {
        //             format.formatDate(dateEntry);
        //         });
        //         entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);

        //         //Format srcMatch Date Display.
        //         _.each(entry.srcMatch.date_time, function (dateEntry) {
        //             format.formatDate(dateEntry);
        //         });
        //         entry.srcMatch.date_time.displayDate = format.outputDate(entry.srcMatch.date_time);

        //     });
        // }

        function formatDates() {

            //Have to grab sub dates on labs section.
            _.each($scope.match, function (entry) {
                //newMatch
                var dateArray = [];
                entry.newMatch.date_time = {};
                entry.srcMatch.data.date_time = {};

                _.each(entry.newMatch.results, function (result) {

                    _.each(result.date_time, function (dateEntry, dateIndex) {
                        if (dateIndex !== 'displayDate') {
                            if (!dateEntry.displayDate) {

                                format.formatDate(dateEntry);

                            }
                            dateArray.push(moment(dateEntry.date));
                        }
                    });

                    if (!result.date_time.displayDate) {
                        result.date_time.displayDate = format.outputDate(result.date_time);
                    }

                });

                //Construct low-high based on range.

                var momentMin = moment.min(dateArray);
                var momentMax = moment.max(dateArray);

                if (momentMin.isSame(momentMax, 'day')) {
                    entry.newMatch.date_time.point = {};
                    entry.newMatch.date_time.point.date = momentMin.toISOString();
                    entry.newMatch.date_time.point.precision = 'day';
                }

                _.each(entry.newMatch.date_time, function (dateTime) {
                    dateTime.displayDate = format.formatDate(dateTime);
                });

                entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);
                entry.newMatch.date_time.plotDate = format.plotDate(entry.newMatch.date_time);

    

                _.each(entry.srcMatch.data.results, function (result) {

                    _.each(result.date_time, function (dateEntry, dateIndex) {
                        if (dateIndex !== 'displayDate') {
                            if (!dateEntry.displayDate) {

                                format.formatDate(dateEntry);

                            }
                            dateArray.push(moment(dateEntry.date));
                        }
                    });

                    if (!result.date_time.displayDate) {
                        result.date_time.displayDate = format.outputDate(result.date_time);
                    }

                });

                    //Construct low-high based on range.

                var momentMin = moment.min(dateArray);
                var momentMax = moment.max(dateArray);

                if (momentMin.isSame(momentMax, 'day')) {
                    entry.srcMatch.data.date_time.point = {};
                    entry.srcMatch.data.date_time.point.date = momentMin.toISOString();
                    entry.srcMatch.data.date_time.point.precision = 'day';
                }

                _.each(entry.srcMatch.data.date_time, function (dateTime) {
                    dateTime.displayDate = format.formatDate(dateTime);
                });

                entry.srcMatch.data.date_time.displayDate = format.outputDate(entry.srcMatch.data.date_time);
                entry.srcMatch.data.date_time.plotDate = format.plotDate(entry.srcMatch.data.date_time);

            });
        }

        function formatDisplay() {
        	_.each($scope.match, function(entry) {
        			format.formatQuantity(entry.newMatch);
        			format.formatQuantity(entry.srcMatch.data);
        		
        	});
        }
        
        $scope.selectEntry = function (matchIndex) {
            _.each($scope.selected, function (elem, name, list) {

                if (elem === true) {
                    $scope.match[matchIndex].srcMatch.data = $scope.match[matchIndex].newMatch;
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch.data = $scope.match[matchIndex].origMatch;
                    formatDates();
                    formatDisplay();
                } else if (_.isObject(elem)) {
                    // Handle status
                    if (elem.status === true) {
                        $scope.match[matchIndex].srcMatch.data[name].status = $scope.match[matchIndex].newMatch[name].status;
                    } else if (elem.status === false) {
                        $scope.match[matchIndex].srcMatch.data[name].status = $scope.match[matchIndex].origMatch[name].status;
                    }

                }

            });

        }

        $scope.clearAll = function (matchIndex) {

            $scope.selected = angular.copy(selectedOriginal);  
            $scope.match[matchIndex].srcMatch.data = angular.copy($scope.match[matchIndex].origMatch);
            formatDates();
            formatDisplay();

        }

        $scope.saveUpdate = function (matchIndex) {

            console.log($scope.match[matchIndex].srcMatch.data);

            results.saveEntry($scope.match[matchIndex].srcMatch.data, function (err) {

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
