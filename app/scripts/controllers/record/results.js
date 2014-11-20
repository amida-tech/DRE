'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordResultsCtrl
 * @description
 * # RecordResultsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RecordResultsCtrl', function ($scope, results, format) {

        $scope.entryType = 'results';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;

        function getUpdateDate() {
            //Should grab from files/update history.  Stubbed for now.
            $scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            results.getRecord(function (err, results) {
                $scope.masterEntries = results;
                callback();
            });
        }

        function formatDates() {
            
            //Have to grab sub dates on labs section.
            _.each($scope.masterEntries, function (entry) {

            	var dateArray = [];
            	entry.date_time = {};

            	_.each(entry.results, function(result) {
            		_.each(result.date_time, function(dateEntry) {
            			format.formatDate(dateEntry);
            			dateArray.push(moment(dateEntry.date));
            		});
            		result.date_time.displayDate = format.outputDate(result.date_time);
            		
            	});

            	//Construct low-high based on range.

            	var momentMin = moment.min(dateArray);
            	var momentMax = moment.max(dateArray);

            	if (momentMin.isSame(momentMax, 'day')) {
            		entry.date_time.point = {};
            		entry.date_time.point.date = momentMin.toISOString();
            		entry.date_time.point.precision = 'day';
            	}

         
            	_.each(entry.date_time, function(dateTime) {
            		dateTime.displayDate = format.formatDate(dateTime);
            	});

            	entry.date_time.displayDate = format.outputDate(entry.date_time);
                entry.date_time.plotDate = format.plotDate(entry.date_time);

            });
        }

        function formatDisplay() {
            _.each($scope.masterEntries, function (entry) {

            	_.each(entry.results, function (result) {
            		format.formatQuantity(result);
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