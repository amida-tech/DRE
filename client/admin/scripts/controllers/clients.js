'use strict';

/**
 * @ngdoc function
 * @name phrAdminApp.controller:ClientsCtrl
 * @description
 * # ClientsCtrl
 * Controller of the phrAdminApp
 */
angular
    .module('phrAdminApp')
    .controller('ClientsCtrl', Clients);

Clients.$inject = ['$location', '$route', 'authentication', 'devclient', 'username'];

function Clients($location, $route, authentication, devclient) {
    var vm = this;
    vm.showForm = false;
    vm.clientsList = [];
    vm.clientInfo = {};
    vm.devLogout = function () {
        authentication.logout(function (err) {
            if (err) {
                vm.error = err;
            } else {
                // $scope.loginStatus = false;
                //$location.path('/');
                $location.path('/admin');
            }
        });
    }
    vm.getClients = function () {
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
    vm.showAddClient = function () {
        vm.showForm = true;
    }
    vm.addClient = function () {
        devclient.saveClient(vm.clientInfo, function (data, err) {
            if (err) {
                console.log(err);
            } else {
                vm.showForm = false;
                $route.reload();
            }
        });
    }
    vm.deleteClient = function (client_name) {
        console.log(client_name);
        devclient.deleteClient(client_name, function (err) {
            if (err) {
                console.log("Deleting client error: ", err);
            } else {
                $route.reload();
            }
        });
    }
    vm.cancelAdd = function () {
        vm.showForm = false;
    }

}
