'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordMedicationsReviewCtrl
 * @description
 * # RecordMedicationsReviewCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordMedicationsReviewCtrl', function ($scope, $location, medications, format) {

        $scope.entryType = 'medications';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.partialEntries = [];
        $scope.alertShow = true;
        $scope.match = [];

        //Instantiate empty clone of object structure.
        var selectedOriginal = {
            "date_time": null,
            "status": null,
            "administration": {
                "route": null,
                "form": null
            }
        };

        $scope.selected = angular.copy(selectedOriginal);

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getRecords(callback) {
            medications.getRecord(function (err, results) {
                $scope.masterEntries = results;
                $scope.entries = results;
                callback();
            });
        }

        function getPartial(callback) {
            medications.getPartialRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getMatch(callback) {
            medications.getPartialMatch(function (err, results) {
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

    //     function formatDisplay() {
    //     	_.each($scope.masterEntries, function(entry) {
        		
    //     		_.each(entry.supply.date_time, function(date) {
    //     			format.formatDate(date);
    //     		});
				// entry.supply.date_time.displayDate = format.outputDate(entry.supply.date_time);
				// format.formatName(entry.supply.author.name);
    //     		format.formatInterval(entry.administration.interval);
    //     		format.formatQuantity(entry.administration.dose);
    //     		format.formatQuantity(entry.administration.rate);
    //     	});
    //     }
        
        $scope.selectEntry = function (matchIndex) {
            _.each($scope.selected, function (elem, xname, list) {

                if (elem === true) {
                    $scope.match[matchIndex].srcMatch.data[xname] = $scope.match[matchIndex].newMatch[xname];
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch.data[xname] = $scope.match[matchIndex].origMatch[xname];
                    formatDates();
                } else if (_.isObject(elem)) {
                    // Handle administration route 
                    if (elem.route === true) {
                        $scope.match[matchIndex].srcMatch.data[xname].route = $scope.match[matchIndex].newMatch[xname].route;
                    } else if (elem.route === false) {
                        $scope.match[matchIndex].srcMatch.data[xname].route = $scope.match[matchIndex].origMatch[xname].route;
                    } else if (elem.form === true) {
                        $scope.match[matchIndex].srcMatch.data[xname].form = $scope.match[matchIndex].newMatch[xname].form;
                    } else if (elem.form === false) {
                        $scope.match[matchIndex].srcMatch.data[xname].form = $scope.match[matchIndex].origMatch[xname].form;
                    }

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

            medications.saveEntry($scope.match[matchIndex].srcMatch.data, function (err) {

                $location.path('/record/medications');


            });

        }

        $scope.ignoreUpdate = function (matchIndex) {

            $scope.selected = angular.copy(selectedOriginal);  
            $scope.match[matchIndex].srcMatch.data = angular.copy($scope.match[matchIndex].origMatch);
            formatDates();

                $location.path('/record/medications');

        }

        $scope.refresh = function () {
            getMatch(function (err) {
                formatDates();
            });
        }

        $scope.refresh();
  });
