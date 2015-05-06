'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('MainCtrl', Main);

Main.$inject = ['$location', 'login', 'authentication'];

function Main($location, login, authentication) {
    /* jshint validthis: true */
    var vm = this;
    vm.mainLogin = mainLogin;

    activate();

    function activate() {

        redirectUser();

        function redirectUser() {
            authentication.authStatus(function (err, res) {
                if (err) {
                    throw err;
                } else {
                    if (res) {
                        $location.path('/home');
                    }
                }
            });
        }
    }

    function mainLogin() {
        login.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                $location.path('/home');
            }
        });
    }
}
