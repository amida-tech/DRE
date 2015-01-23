'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingClaimsCtrl
 * @description
 * # BillingClaimsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('BillingCtrl', function ($scope, $location, $anchorScroll, claims, insurance, format) {

        $scope.entryType = 'all';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.newComment = {
            'starred': false
        };

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {

            claims.getRecord(function (err, results) {
                $scope.claimsEntries = results;
                
                
            });
            insurance.getRecord(function (err, results) {
                $scope.insuranceEntries = results;
                
            });
            $scope.masterEntries = $scope.claimsEntries.concat($scope.insuranceEntries);
            callback();
        }

        $scope.navClick = function (element) {
            var old = $location.hash();
            $location.hash(element);
            $anchorScroll();
            //reset to old to keep any additional routing logic from kicking in
            $location.hash(old);
        };

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

        function formatAddress() {
            _.each($scope.masterEntries, function (entry) {
                _.each(entry.data.locations, function (loc) {
                    _.each(loc.address, function (addr) {
                        format.formatAddress(addr);
                    });
                });
            });
        }
        $scope.setEntryType = function(type) {
            $scope.entryType = type;
            if (type === 'all') {
                $scope.entries = $scope.masterEntries;
            } else if (type === 'claims') {
                $scope.entries = $scope.claimsEntries;
            } else if (type === 'insurance') {
                $scope.entries = $scope.insuranceEntries;
            }
        };

        $scope.refresh = function () {
            getRecords(function (err) {
                getUpdateDate();
                formatDates();
                formatAddress();
                $scope.entries = $scope.masterEntries;
            });
        };

        $scope.refresh();
    });