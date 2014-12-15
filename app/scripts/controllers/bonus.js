'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('bonusCtrl', function($scope, $location) {
    $(window).konami({
        cheat: function() {
            document.getElementById("index-wrapper").style.backgroundImage = 'url(../../images/va_photo.66fe66c9.jpg)';
            document.getElementById("index-wrapper").style.backgroundRepeat = 'repeat';
            setTimeout(function() {
                document.getElementById("index-wrapper").style.backgroundImage = 'url(../../images/blur.00ed6507.png)';
                document.getElementById("index-wrapper").style.backgroundRepeat = 'no repeat';
            }, 2000);
        }
    });
});