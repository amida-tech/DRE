'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
