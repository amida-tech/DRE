'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordImmunizationsReviewCtrl
 * @description
 * # RecordImmunizationsReviewCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordImmunizationsReviewCtrl', function ($scope, $location, immunizations, format) {

        $scope.entryType = 'immunizations';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.partialEntries = [];
        $scope.alertShow = true;
        $scope.match = [];

        //Instantiate empty clone of object structure.
        var selectedOriginal = {
            "product": null,
            "administration": null
        };

        $scope.selected = angular.copy(selectedOriginal);

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getRecords(callback) {
            immunizations.getRecord(function (err, results) {
                $scope.masterEntries = results;
                $scope.entries = results;
                callback();
            });
        }

        function getPartial(callback) {
            immunizations.getPartialRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getMatch(callback) {
            immunizations.getPartialMatch(function (err, results) {
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

                //Format newMatch Date Display.
                _.each(entry.newMatch.date_time, function (dateEntry) {
                    format.formatDate(dateEntry);
                });
                entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);

                //Format srcMatch.data Date Display.
                _.each(entry.srcMatch.data.date_time, function (dateEntry) {
                    format.formatDate(dateEntry);
                });
                entry.srcMatch.data.date_time.displayDate = format.outputDate(entry.srcMatch.data.date_time);

            });
        }

        function formatDisplay() {
        	_.each($scope.match, function(entry) {
        		_.each(entry.newMatch.performer, function(perf) {

        			_.each(perf.name, function(name) {
        				format.formatName(name);
        			});

        			_.each(perf.address, function(addr) {
        				format.formatAddress(addr);
        			});
        		});
        		// format.formatQuantity(entry.newMatch.administration.dose);

        		_.each(entry.srcMatch.data.performer, function(perf) {

        			_.each(perf.name, function(name) {
        				format.formatName(name);
        			});
        			_.each(perf.address, function(addr) {
        				format.formatAddress(addr);
        			});
        		});
        		// format.formatQuantity(entry.srcMatch.data.administration.dose);
        	});
        }

        $scope.selectEntry = function (matchIndex) {
            _.each($scope.selected, function (elem, name, list) {

                if (elem === true) {
                    $scope.match[matchIndex].srcMatch.data[name] = $scope.match[matchIndex].newMatch[name];
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch.data[name] = $scope.match[matchIndex].origMatch[name];
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

            immunizations.saveEntry($scope.match[matchIndex].srcMatch.data, function (err) {

                $location.path('/record/immunizations');


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
