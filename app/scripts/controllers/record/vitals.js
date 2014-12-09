'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordVitalsCtrl
 * @description
 * # RecordVitalsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordVitalsCtrl', function ($scope, vitals, format) {
    
        $scope.entryType = 'vitals';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
<<<<<<< HEAD
        $scope.partialEntries = [];
        $scope.alertShow = true;

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }
=======
        $scope.newComment = {
            'starred': false
        };
>>>>>>> master

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            vitals.getRecord(function (err, results) {
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
        	_.each($scope.masterEntries, function(entry) {     		
        		format.formatQuantity(entry.data);
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
