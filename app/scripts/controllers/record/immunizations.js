'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordImmunizationsCtrl
 * @description
 * # RecordImmunizationsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RecordImmunizationsCtrl', function ($scope, immunizations, format) {

        $scope.entryType = 'immunizations';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;

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
                if (entry.date_time) {
                    _.each(entry.date_time, function (dateEntry) {
                        format.formatDate(dateEntry);
                    });
                    entry.date_time.displayDate = format.outputDate(entry.date_time);
                    entry.date_time.plotDate = format.plotDate(entry.date_time);
                }
            });
        }

        function formatDisplay() {
        	_.each($scope.masterEntries, function(entry) {
        		_.each(entry.performer, function(perf) {
        			_.each(entry.performer.name, function(name) {
        				format.formatName(name);
        			});
        			_.each(entry.performer.address, function(addr) {
        				format.formatAddress(addr);
        			});
        		});
        		format.formatQuantity(entry.administration.dose);
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