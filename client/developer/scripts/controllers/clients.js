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
    // /* jshint validthis: true */
    // var vm = this;
    // vm.ClientsLogin = ClientsLogin;

    // activate();

    // function activate() {

    //     redirectUser();

    //     function redirectUser() {
    //         authentication.authStatus(function (err, res) {
    //             if (err) {
    //                 throw err;
    //             } else {
    //                 if (res) {
    //                     $location.path('/Clients');
    //                 }
    //             }
    //         });
    //     }
    // }

    // function ClientsLogin() {
    //     //    login.login(vm.inputLogin, vm.inputPassword, function (err) {
    //     authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
    //         if (err) {
    //             vm.error = err;
    //         } else {
    //             $location.path('/Clients');
    //         }
    //     });
    // }

}
