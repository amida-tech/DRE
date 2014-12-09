'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordProceduresCtrl
 * @description
 * # RecordProceduresCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordProceduresCtrl', function ($scope, procedures, format) {
    
        $scope.entryType = 'procedures';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.partialEntries = [];
        $scope.alertShow = true;

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            procedures.getRecord(function (err, results) {
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

                _.each(perf.address, function(perfAddr) {

                    format.formatAddress(perfAddr);

                });

                _.each(perf.organization, function(org) {

                        _.each(org.address, function(orgAddr) {

                            format.formatAddress(orgAddr);

                        });

                    });

            });




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
