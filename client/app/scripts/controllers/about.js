'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('AboutCtrl', About);

function About() {
    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];
}
