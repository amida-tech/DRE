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
          $scope.accountHistory = history;
        }
      });
    }

    getHistory();


  });
