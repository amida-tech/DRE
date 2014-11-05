'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('HomeCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
