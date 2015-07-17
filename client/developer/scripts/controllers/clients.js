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

Clients.$inject = ['$location', '$route', 'authentication', 'devclient', 'username'];

function Clients($location, $route, authentication, devclient) {
    var vm = this;
    vm.showForm = false;
    vm.clientsList=[];
    vm.clientInfo = {};
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
    vm.showAddClient = function () { 
        vm.showForm = true;
    }
    vm.addClient = function() {
        console.log(vm.clientInfo);
        devclient.saveClient(vm.clientInfo, function (err) {
           if (err) {
               console.log(err);
           } else {
               $route.reload();
               vm.showForm = false;
           }
        });
    }
    vm.delete
    vm.cancelAdd = function() {
        vm.showForm = false;
    }

}
