'use strict';

/**
 * @ngdoc function
 * @name phrDeveloperApp.controller:ClientsCtrl
 * @description
 * # ClientsCtrl
 * Controller of the phrDeveloperApp
 */
angular
    .module('phrDeveloperApp')
    .controller('ClientsCtrl', Clients);

Clients.$inject = ['$location', 'authentication'];

//function Clients($location, login, authentication) {
function Clients($location, authentication) {
    var vm = this;
    vm.devLogout = function() {
        authentication.logout(function (err) {
            if (err) {
                vm.error = err;
            } else {
                // $scope.loginStatus = false;
                //$location.path('/');
                $location.path('/developer');
            }
        });
    }

}
