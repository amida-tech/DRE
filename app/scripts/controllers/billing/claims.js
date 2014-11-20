'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingClaimsCtrl
 * @description
 * # BillingClaimsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('BillingClaimsCtrl', function ($scope, claims, format) {


        $scope.entryType = 'claims';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            claims.getRecord(function(err, results) {
                $scope.masterEntries = results;
                callback();
            });
        }

        function formatDates() {
            //Add displayDate to all entries.
            _.each($scope.masterEntries, function (entry) {
                if (entry.date_time) {
                    _.each(entry.date_time, function(dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.date_time.displayDate = format.outputDate(entry.date_time);
                    entry.date_time.plotDate = format.plotDate(entry.date_time);
                }
            });
        }

        function formatAddress() {
            _.each($scope.masterEntries, function(entry) {
                _.each(entry.locations, function(loc) {
                    _.each(loc.address, function(addr) {
                        format.formatAddress(addr);
                    });
                });
            });
        }

        $scope.refresh = function() {
            getRecords(function(err) {
                getUpdateDate();
                formatDates();
                formatAddress();
                $scope.entries = $scope.masterEntries;
            });
        }

        $scope.refresh();
    });
