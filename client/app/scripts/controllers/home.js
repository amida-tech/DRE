'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('HomeCtrl', function ($scope, history, merges, dataservice) {

        //TODO : fetch notes and updates counts
        $scope.noteCount = 0;
        $scope.updatesCount = 0;

        function refresh() {
            dataservice.curr_section = $scope.entryType;
            dataservice.getData(function () {
                $scope.noteCount = 0;

                _.each(dataservice.all_notes, function (entry) {
                    //console.log(entry);
                    if (entry.star) {
                        $scope.noteCount++;
                    }
                });

                merges.getMerges(function (err, merges) {
                    $scope.updatesCount = merges.length;
                });
                //$scope.updatesCount = dataservice.matches

            });
        }

        refresh();

        function getHistory() {
            history.getHistory(function (err, history) {
                if (err) {
                    console.log('ERRROR', err);
                } else {
                    //console.log('>>>>accountHistory', history);
                    $scope.accountHistory = history;
                }
            });
        }

        getHistory();

    });
