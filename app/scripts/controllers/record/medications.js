'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordMedicationsCtrl
 * @description
 * # RecordMedicationsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordMedicationsCtrl', function ($scope, medications, format) {
	
	    $scope.entryType = 'medications';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            medications.getRecord(function (err, results) {
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
        		
        		_.each(entry.supply.date_time, function(date) {
        			format.formatDate(date);
        		});
				entry.supply.date_time.displayDate = format.outputDate(entry.supply.date_time);
				format.formatName(entry.supply.author.name);
        		format.formatInterval(entry.administration.interval);
        		format.formatQuantity(entry.administration.dose);
        		format.formatQuantity(entry.administration.rate);
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
