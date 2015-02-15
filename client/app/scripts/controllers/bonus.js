'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('bonusCtrl', function ($scope, $location) {
    $(window).konami({
        cheat: function () {
            document.getElementById("index-wrapper").className = 'konami-background';
            setTimeout(function () {
                document.getElementById("index-wrapper").className = 'default-background';
            }, 2000);
        }
    });
});
