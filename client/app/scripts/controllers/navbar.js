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

Navbar.$inject = ['$rootScope', '$location', 'authentication', 'logout'];

function Navbar($rootScope, $location, authentication, logout) {
    /* jshint validthis: true */
    var vm = this;
    vm.loginStatus = false;
    vm.navbarLogout = navbarLogout;

    activate();

    function activate() {
        checkAuthStatus();
    }

    $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        checkAuthStatus();
    });

    function checkAuthStatus() {
        //console.log("check aut status");
        authentication.authStatus(function (err, res) {
            if (err) {
                //console.log("status fetch error ", err);
                vm.loginStatus = false;
                //console.log(err);
            } else {
                //console.log("auth status ", res);
                if (!res) {
                    vm.loginStatus = false;
                } else {
                    vm.loginStatus = true;
                }
            }
        });
    }

    function navbarLogout() {
        logout.logout(function (err) {
            if (err) {
                vm.error = err;
            } else {
                // $scope.loginStatus = false;
                $location.path('/');
            }
        });
    }

}
