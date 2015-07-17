'use strict';

/**
 * @ngdoc function
 * @name phrAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the phrAdminApp
 */
angular
    .module('phrAdminApp')
    .controller('MainCtrl', Main);

Main.$inject = ['$location', '$window', 'authentication'];

function Main($location, $window, authentication) {
    var vm = this;
    vm.mainLogin = function () {
        authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                $location.path('/admin/clients');
                $window.location.reload();
            }
        });
    };
}
