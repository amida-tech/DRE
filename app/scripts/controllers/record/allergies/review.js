'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordAllergiesReviewCtrl
 * @description
 * # RecordAllergiesReviewCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordAllergiesReviewCtrl', function ($scope, allergies, format) {
        
        $scope.entryType = 'allergies';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.inactiveFlag = false;
        $scope.partialEntries = [];
        $scope.alertShow = true;

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getRecords(callback) {
            allergies.getRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getPartial(callback) {
            allergies.getPartialRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getMatch(callback) {
            allergies.getPartialMatch(function(err, results) {
                $scope.match = results
                callback();
            });
        }

        function formatDates () {
        	//Add displayDate to all entries.
            _.each($scope.match, function(entry) {

                    //Format newMatch Date Display.
                    _.each(entry.newMatch.date_time, function(dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);

                    //Format srcMatch Date Display.
                    _.each(entry.srcMatch.date_time, function(dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.srcMatch.date_time.displayDate = format.outputDate(entry.srcMatch.date_time);

            });
        }

        $scope.refresh = function () {
            getMatch(function (err) {
                formatDates();
            });
        }

        $scope.refresh();
  });
