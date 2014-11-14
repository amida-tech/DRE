'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordAllergiesCtrl
 * @description
 * # RecordAllergiesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RecordAllergiesCtrl', function ($scope, allergies, format) {

        $scope.entryType = 'allergies';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.inactiveFlag = false;

        function getUpdateDate () {
        	//Should grab from files/update history.  Stubbed for now.
        	$scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {
            allergies.getRecord(function (err, results) {
                $scope.masterEntries = results;
                callback();
            });
        }

        function filterInactive () {
            if ($scope.inactiveFlag === false) {
                $scope.entries = _.filter(_.clone($scope.masterEntries), function(entry) {

                    if (entry.observation) {
                        if (entry.observation.status) {

                            if (entry.observation.status.name === "Active") {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }



                });
            } else {
                $scope.entries = _.clone($scope.masterEntries);

            }
        }

        function formatDates () {

        	//Add displayDate to all entries.
        	_.each($scope.masterEntries, function(entry) {
        		if (entry.date_time) {
        			_.each(entry.date_time, function(dateEntry) {
        				format.formatDate(dateEntry);
        			});
                    entry.date_time.displayDate = format.outputDate(entry.date_time);
                    entry.date_time.plotDate = format.plotDate(entry.date_time);
        		}
        	});

        	
        }

        $scope.refresh = function () {
            getRecords(function (err) {
            	getUpdateDate();
            	formatDates();
                filterInactive();
            });
        }

        $scope.$watch('inactiveFlag', function() {
       		filterInactive();
   		});

        $scope.refresh();

    });