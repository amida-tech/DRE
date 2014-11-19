'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('NavbarCtrl', function ($rootScope, $scope, $location, authentication) {

        $scope.loginStatus = false;

        function checkAuthStatus() {
            authentication.authStatus(function (err, res) {
                if (err) {
                    $scope.loginStatus = false;
                    console.log(err);
                } else {
                    if (!res) {
                        $scope.loginStatus = false;
                    } else {
                        $scope.loginStatus = true;
                    }
                }
            });
        }

        checkAuthStatus();

        $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
            checkAuthStatus();
        });

    });