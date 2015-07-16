'use strict';

/**
 * @ngdoc function
 * @name phrDeveloperApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the phrDeveloperApp
 */
angular.module('phrDeveloperApp')
    .controller('RegisterCtrl', function ($scope, $location, registration, authentication, username) {


        $scope.registration = {};

        $scope.isUser = false;
        $scope.userList = {};
        $scope.focusInput = false;

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.nextStep = function () {

                username.checkLogin($scope.inputEmail, function (err, user_exists) {
                    if (user_exists) {
                        $scope.error = "That Username already exists, please choose another";
                        return;
                    }
                    if ($scope.inputPassword === $scope.inputRepeatPassword) {
                        $scope.error = null;
                        $scope.focusInput = true;
                        $scope.finish();
                    } else {
                        $scope.error = "Entered Passwords did not match";
                        return;
                    }
                });

        };

        $scope.finish = function () {
            //calling webservice for registration, format DOB
            var info = {
                'password': $scope.inputPassword,
                'username': $scope.inputEmail
            };

            console.log("starting developer registration", info.inputEmail);

            registration.signup(info, function (err) {
                if (err) {
                    $scope.error = err;
                } else {
                    authentication.login($scope.inputEmail, $scope.inputPassword, function (err) {
                        if (err) {
                            $scope.error = err;
                        } else {
                            $location.path('/developer/home');
                        }
                    });
                }
            });

        };

    });
