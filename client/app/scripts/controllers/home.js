'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('HomeCtrl', function($scope, history, record) {


        
        $scope.noteCount = 0;

        function countNotes() {
            //notes.noteCount(function(err, results) {
            $scope.noteCount = 0;
            //});
        }

        function countUpdates() {
            record.getRecord(function(err, results) {
                $scope.entries = results;
            });
        }

        countNotes();
        //countUpdates();


        function getHistory() {
            history.getHistory(function(err, history) {
                if (err) {
                    console.log('ERRROR', err);
                } else {

                    // for (var i in history.recordHistory) {
                    //     if (history.recordHistory[i].type === 'upload') {
                    //         history.recordHistory[i].displayType = 'New Record Uploaded';
                    //     } else if (history.recordHistory[i].type === 'download') {
                    //         history.recordHistory[i].displayType = 'Record Downloaded';
                    //     } else if (history.recordHistory[i].type === 'login') {
                    //         history.recordHistory[i].displayType = 'Logged In';
                    //     }

                    //     console.log();
                    // }
                    console.log('>>>>accountHistory', history);
                    $scope.accountHistory = history;
                }
            });
        }

        getHistory();


    });
