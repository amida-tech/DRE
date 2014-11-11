'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('HomeCtrl', function ($scope, history) {
    
  	$scope.accountHistory = {};

  	function getHistory () {
      history.account(function(err, history) {
        if (err) {
          console.log(err);
        } else {

          for (var i in history.recordHistory) {
            if (history.recordHistory[i].type === 'upload') {
              history.recordHistory[i].displayType = 'New File Uploaded';
            } else if (history.recordHistory[i].type === 'download') {
              history.recordHistory[i].displayType = 'File Downloaded';
            }

            console.log();
          }


          $scope.accountHistory = history;
        }
      });
    }

    getHistory();


  });
