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
        $scope.newComment = {
            'starred': false
        };

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
            	entry.data.date_time = {};

            	_.each(entry.data.results, function(result) {
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
            		entry.data.date_time.point = {};
            		entry.data.date_time.point.date = momentMin.toISOString();
            		entry.data.date_time.point.precision = 'day';
            	}

         
            	_.each(entry.data.date_time, function(dateTime) {
            		dateTime.displayDate = format.formatDate(dateTime);
            	});

            	entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
                entry.data.date_time.plotDate = format.plotDate(entry.data.date_time);

            });
        }

        function formatDisplay() {
            _.each($scope.masterEntries, function (entry) {

            	_.each(entry.data.results, function (result) {
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