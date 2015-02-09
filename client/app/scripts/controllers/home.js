'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('HomeCtrl', function($scope, history, record, notes, merges) {



        //TODO : fetch notes and updates counts
        $scope.noteCount = 0;
        $scope.updatesCount = 0;

        notes.noteCount(function(err, count) {
            $scope.noteCount = count;
        });

        merges.getMerges(function(err, merges){
            $scope.updatesCount=merges.length;

        });

        //$scope.updatesCount = merges.updatesCount();



        /*
        function countNotes() {
            //notes.noteCount(function(err, results) {
            //$scope.noteCount = 1;
            //});
        }

        function countUpdates() {
            record.getRecord(function(err, results) {
                $scope.entries = results;
            });
        }
        */

        //countNotes();
        //countUpdates();


        function getHistory() {
            history.getHistory(function(err, history) {
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
