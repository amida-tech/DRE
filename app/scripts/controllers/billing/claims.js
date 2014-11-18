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
                if (entry.start_date) {
                    _.each(entry.start_date, function(dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.start_date.displayDate = format.outputDate(entry.start_date);
                    entry.start_date.plotDate = format.plotDate(entry.start_date);
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
