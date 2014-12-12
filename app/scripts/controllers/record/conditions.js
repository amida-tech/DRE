'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordConditionsCtrl
 * @description
 * # RecordConditionsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RecordConditionsCtrl', function ($scope, $location, $anchorScroll, conditions, format) {

        $scope.entryType = 'conditions';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.partialEntries = [];
        $scope.alertShow = true;

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        $scope.newComment = {
            'starred': false
        };

        $scope.navClick = function (element) {
            var old = $location.hash();
            $location.hash(element);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        };

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            conditions.getRecord(function (err, results) {
                $scope.masterEntries = results;
                callback();
            });
        }

        function formatDates() {
            //Add displayDate to all entries.
            _.each($scope.masterEntries, function (entry) {
                if (entry.data.date_time) {
                    _.each(entry.data.date_time, function (dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
                    entry.data.date_time.plotDate = format.plotDate(entry.data.date_time);
                }
            });
        }

        function formatDisplay() {
            _.each($scope.masterEntries, function (entry) {
                if (entry.data.problem.date_time) {
                    _.each(entry.data.problem.date_time, function (dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.data.problem.date_time.displayDate = format.outputDate(entry.data.problem.date_time);
                }

            });
        }

        $scope.refresh = function () {
            getRecords(function (err) {
                getUpdateDate();
                formatDates();
                formatDisplay();
                $scope.entries = $scope.masterEntries;
            });
        }

        $scope.refresh();
    });