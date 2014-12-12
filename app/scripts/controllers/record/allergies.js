'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordAllergiesCtrl
 * @description
 * # RecordAllergiesCtrl
 * Controller of the phrPrototypeApp
 */
 angular.module('phrPrototypeApp')
 .controller('RecordAllergiesCtrl', function ($scope, $location, $anchorScroll, allergies, format, partial) {

    $scope.entryType = 'allergies';
    $scope.masterEntries = [];
    $scope.entries = [];
    $scope.updateDate = null;
    $scope.inactiveFlag = false;
    $scope.partialEntries = [];
    $scope.alertShow = true;

    $scope.newComment = {
        'starred': false
    };

    $scope.navClick = function (element) {
        var old = $location.hash();
        $location.hash(element);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

    $scope.closeAlert = function () {
        $scope.alertShow = false;
    }

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

        function getPartials() {
            partial.getPartialMatches($scope.entryType, function(err, results) {

                $scope.partialEntries = results;

            });
        }

        function filterInactive () {
            if ($scope.inactiveFlag === false) {
                $scope.entries = _.filter(_.clone($scope.masterEntries), function(entry) {

                    if (entry.data.observation) {
                        if (entry.data.observation.status) {

                            if (entry.data.observation.status.name === "Active") {
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
        		if (entry.data.date_time) {
        			_.each(entry.data.date_time, function(dateEntry) {
        				format.formatDate(dateEntry);
        			});
                    entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
                    entry.data.date_time.plotDate = format.plotDate(entry.data.date_time);
                }
            });
        }

     $scope.refresh = function () {
        getRecords(function (err) {
         getUpdateDate();
         formatDates();
         filterInactive();
         getPartials();
     });
    }

    $scope.$watch('inactiveFlag', function() {
       filterInactive();
   });

    $scope.refresh();

});