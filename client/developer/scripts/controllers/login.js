'use strict';

/**
 * @ngdoc function
 * @name phrDeveloperApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the phrDeveloperApp
 */
angular
    .module('phrDeveloperApp')
    .controller('LoginCtrl', Login);

Login.$inject = ['$location', '$window', 'authentication'];

function Login($location, $window, authentication) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = function () {
        authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                $location.path('/developer/home');
                $window.location.reload();
            }
        });
    };
}
