'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordImmunizationsCtrl
 * @description
 * # RecordImmunizationsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RecordImmunizationsCtrl', function ($scope, $location, $anchorScroll, immunizations, format) {

        $scope.entryType = 'immunizations';
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
            immunizations.getRecord(function (err, results) {
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
                _.each(entry.data.performer, function (perf) {
                    _.each(entry.data.performer.name, function (name) {
                        format.formatName(name);
                    });
                    _.each(entry.data.performer.address, function (addr) {
                        format.formatAddress(addr);
                    });
                });
                format.formatQuantity(entry.data.administration.dose);
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