'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('NavbarCtrl', function($rootScope, $scope, $location, authentication, logout, profile) {

        $scope.loginStatus = false;

        function checkAuthStatus() {
            authentication.authStatus(function(err, res) {
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

        $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
            checkAuthStatus();
        });

        profile.getProfile(function(err, profileInfo) {
            $scope.user_first = profileInfo.name.first;
            $scope.user_last = profileInfo.name.last;
            $scope.email = profileInfo.email[0].email;
        });


        //TODO: isValid is not used??
        $scope.logout = function(isValid) {
            console.log("navbar controller, logout()", isValid);
            logout.logout(function(err) {
                if (err) {
                    $scope.error = err;
                } else {
                    $location.path('/');
                }
            });
        };

    });
