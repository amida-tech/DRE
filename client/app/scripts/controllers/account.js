/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('AccountCtrl', Account);

Account.$inject = ['$location', 'account'];

function Account($location, account) {
    /* jshint validthis: true */
    var vm = this;
    vm.resetPassword = resetPassword;

    function resetPassword() {
        if (vm.inputNewPassword === vm.inputRepeatPassword) {
            vm.resetForm.$setPristine();
            vm.error = null;

            console.log("password changed here");

            var info = {
                "old": vm.inputOldPassword,
                "new": vm.inputNewPassword
            };
            account.changePassword(info, function (err, results) {
                if (err) {
                    vm.error = "Password change failed, wrong old password";
                } else {
                    console.log("password change successful");
                    $location.path('/home');
                }
            });

            //            account.changePassword(info)
            //                .success(function (data) {
            //                    console.log("password change successful");
            //                    $location.path('/home');
            //                }).error(function (data) {
            //                    vm.error = "Password change failed, wrong old password";
            //                });
        } else {
            vm.error = "New passwords did not match";
        }
    }
}
