'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('MainCtrl', function ($scope, $location, login, authentication) {

        //TODO: isValid is not used
        $scope.login = function (isValid) {
            console.log("main controller, login()", isValid);
            login.login($scope.inputLogin, $scope.inputPassword, function (err) {
                if (err) {
                    $scope.error = err;
                } else {
                    $location.path('/home');
                }
            });
        };

        function redirectUser() {
            authentication.authStatus(function (err, res) {
                if (err) {
                    throw err;
                } else {
                    if (res) {
                        $location.path('/home');
                    }
                }
            });
        }

        redirectUser();

    });
