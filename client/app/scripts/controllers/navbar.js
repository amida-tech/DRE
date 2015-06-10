'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('NavbarCtrl', Navbar);

Navbar.$inject = ['$rootScope', '$location', '$window', 'authentication', 'dataservice', 'history', 'notes'];

function Navbar($rootScope, $location, $window, authentication, dataservice, history, notes) {
    /* jshint validthis: true */
    var vm = this;
    vm.navbarLogout = navbarLogout;

    vm.navbarClick = function navbarClick(new_location) {
        if ($location.path() === '/files') {
            dataservice.forceRefresh();
        }
        dataservice.getLastSection(function (last_section) {
            if (new_location === 'record' || new_location === 'billing') {
                $location.path('/' + new_location + last_section[new_location]);
            } else {
                if (new_location === 'files') {
                    dataservice.forceRefresh();
                }
                $location.path('/' + new_location);
            }
        });
    };

    function navbarLogout() {
        dataservice.forceRefresh();
        history.forceRefresh();
        notes.forceRefresh();
        authentication.logout(function (err) {
            if (err) {
                vm.error = err;
            } else {
                // $scope.loginStatus = false;
                //$location.path('/');
                $location.path('/');
                $window.location.reload();
            }
        });
    }

}
