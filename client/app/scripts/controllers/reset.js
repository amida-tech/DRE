'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('ResetCtrl', function ($scope, $location) {

        $scope.step = 0;

        $scope.nextStep = function () {
            $scope.step = $scope.step + 1;
        };

        $scope.finish = function () {
            $location.path('/');
        };

        $scope.resend = function () {
            $scope.inputEmail = "";
            $scope.step = 0;
        };

    });
