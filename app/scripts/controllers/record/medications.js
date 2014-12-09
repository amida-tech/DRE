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
        $scope.partialEntries = [];
        $scope.alertShow = true;

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        $scope.newComment = {
            'starred': false
        };

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
        		
        		_.each(entry.data.supply.date_time, function(date) {
        			format.formatDate(date);
        		});
				entry.data.supply.date_time.displayDate = format.outputDate(entry.data.supply.date_time);
				format.formatName(entry.data.supply.author.name);
        		format.formatInterval(entry.data.administration.interval);
        		format.formatQuantity(entry.data.administration.dose);
        		format.formatQuantity(entry.data.administration.rate);
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
