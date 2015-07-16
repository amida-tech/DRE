'use strict';

/**
 * @ngdoc function
 * @name phrDeveloperApp.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the phrDeveloperApp
 */
angular
    .module('phrDeveloperApp')
    .controller('HomeCtrl', Home);

Home.$inject = ['$location', 'authentication'];

//function home($location, login, authentication) {
function Home($location, authentication) {
    // /* jshint validthis: true */
    // var vm = this;
    // vm.homeLogin = homeLogin;

    // activate();

    // function activate() {

    //     redirectUser();

    //     function redirectUser() {
    //         authentication.authStatus(function (err, res) {
    //             if (err) {
    //                 throw err;
    //             } else {
    //                 if (res) {
    //                     $location.path('/home');
    //                 }
    //             }
    //         });
    //     }
    // }

    // function homeLogin() {
    //     //    login.login(vm.inputLogin, vm.inputPassword, function (err) {
    //     authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
    //         if (err) {
    //             vm.error = err;
    //         } else {
    //             $location.path('/home');
    //         }
    //     });
    // }

}
