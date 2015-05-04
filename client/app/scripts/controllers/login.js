'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('LoginCtrl', Login);
    
Login.$inject = ['$location', 'login']

function Login ($location, login) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = function () {
        login.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                $location.path('/home');
            }
        });
    };
}