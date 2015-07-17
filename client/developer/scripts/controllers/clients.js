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

Clients.$inject = ['$location', 'authentication', 'devclient'];

function Clients($location, authentication, devclient) {
    var vm = this;
    vm.clientsList=[];
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
    vm.getClients = function() {
        devclient.getClients(function (clients, err) {
            if (err) {
                console.log("Error: ", err);
            } else {
                vm.clientsList = clients;
                console.log(vm.clientsList);   
            }
        });
    }
    vm.getClients();
    vm.addClient = function()

}
