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
            document.getElementById("index-wrapper").style.backgroundImage = 'url(../../images/va_photo.jpg)';
            document.getElementById("index-wrapper").style.backgroundRepeat = 'repeat';
            setTimeout(function() {
                document.getElementById("index-wrapper").style.backgroundImage = 'url(../../images/blur.png)';
                document.getElementById("index-wrapper").style.backgroundRepeat = 'no repeat';
            }, 2000);
        }
    });
});