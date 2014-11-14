'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordAllergiesCtrl
 * @description
 * # RecordAllergiesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RecordAllergiesCtrl', function ($scope, allergies) {

        $scope.entryType = 'allergies';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.inactiveFlag = false;

        function getRecords(callback) {
            allergies.getRecord(function (err, results) {
                $scope.masterEntries = results;
                callback();
            });
        }

        $scope.filterInactive = function () {

            if ($scope.inactiveFlag === false) {
                $scope.entries = _.where(_.clone($scope.masterEntries), {
                    "status": "Active"
                });
            } else {
            	console.log('asdf');
                $scope.entries = _.clone($scope.masterEntries);

            }
        }

        $scope.refresh = function () {
            getRecords(function (err) {
                $scope.filterInactive($scope.inactiveFlag);
            });
        }

        $scope.$watch('inactiveFlag', function() {
       		$scope.filterInactive();
   		});

        $scope.refresh();

    });