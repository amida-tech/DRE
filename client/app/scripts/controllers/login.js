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

Login.$inject = ['$location', '$window', 'authentication', 'dataservice', 'history', 'notes'];

function Login($location, $window, authentication, dataservice, history, notes) {
    /* jshint validthis: true */
    var vm = this;
    vm.login = function () {
        dataservice.forceRefresh();
        history.forceRefresh();
        notes.forceRefresh();
        authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else if (vm.inputLogin === 'isabella') {
                $location.path('/demo');
            } else {
                $location.path('/home');
                $window.location.reload();
            }
        });
    };
}
