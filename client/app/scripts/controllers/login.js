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

Login.$inject = ['$location', 'authentication', 'dataservice'];

function Login($location, authentication, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = function () {
        authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                dataservice.forceRefresh();
                $location.path('/home');
            }
        });
    };
}
