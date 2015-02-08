'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('NavbarCtrl', function($rootScope, $scope, $location, authentication, logout) {

        $scope.loginStatus = false;

        function checkAuthStatus() {
            console.log("check aut status");
            authentication.authStatus(function(err, res) {
                if (err) {
                    console.log("status fetch error ", err);
                    $scope.loginStatus = false;
                    console.log(err);
                } else {
                    console.log("auth status ", res);
                    if (!res) {
                        $scope.loginStatus = false;
                    } else {
                        $scope.loginStatus = true;
                    }
                }
            });
        }

        checkAuthStatus();

        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            checkAuthStatus();
        });

        //TODO: isValid is not used??
        $scope.logout = function(isValid) {
            console.log("navbar controller, logout()", isValid);
            logout.logout(function(err) {
                if (err) {
                    $scope.error = err;
                } else {
                    // $scope.loginStatus = false;
                    $location.path('/');
                }
            });
        };

    });
