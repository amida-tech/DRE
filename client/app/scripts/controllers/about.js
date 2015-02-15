'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('AboutCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
