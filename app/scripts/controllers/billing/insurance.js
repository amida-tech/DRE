'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingInsuranceCtrl
 * @description
 * # BillingInsuranceCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('BillingInsuranceCtrl', function ($scope, insurance, format) {
        $scope.entryType = 'insurance';
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
            insurance.getRecord(function (err, results) {
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

                if (entry.findings) {
                	_.each(entry.data.findings, function (finding) {
                		if (finding.date_time) {
                			_.each(finding.date_time, function(dateEntry) {
                				format.formatDate(dateEntry);
                			});
                			finding.date_time.displayDate = format.outputDate(finding.date_time);
                		}
                	});
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

        $scope.refresh = function () {
            getRecords(function (err) {
                getUpdateDate();
                formatDates();
                formatAddress();
                $scope.entries = $scope.masterEntries;
            });
        }

        $scope.refresh();

    });
