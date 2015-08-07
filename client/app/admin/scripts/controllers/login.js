'use strict';

/**
 * @ngdoc function
 * @name phrAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the phrAdminApp
 */
angular
    .module('phrAdminApp')
    .controller('LoginCtrl', Login);

Login.$inject = ['$location', 'authentication'];

function Login($location, authentication) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = function () {
        authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                $location.path('/admin/clients');
            }
        });
    };
}
