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
                    //console.log('>>>>accountHistory', history);
                    $scope.accountHistory = history;
                }
            });
        }

        getHistory();


    });
