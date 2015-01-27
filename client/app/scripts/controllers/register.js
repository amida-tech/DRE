'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RegisterCtrl', function($scope, $location, registration, login, profile, username) {

        $scope.step = 0;

        $scope.registration = {};


        $scope.nextStep = function() {
            if ($scope.step === 0) {
                console.log(username.checkLogin($scope.inputLogin));
                if (username.checkLogin($scope.inputLogin)) {
                    $scope.error = "That Username already exists, please choose another";
                    return;
                } else {
                    if ($scope.inputPassword === $scope.inputRepeatPassword) {
                        $scope.step = $scope.step + 1;
                    } else {
                        $scope.error = "Entered Passwords did not match";
                        return;
                    }
                }
            }
            else {
                $scope.step = $scope.step + 1;
                $scope.error = '';
                // console.log($scope.step);
            }

        };

        $scope.finish = function() {
            //calling webservice for registration
            var info = {
                'username': $scope.inputLogin,
                'password': $scope.inputPassword,
                'email': $scope.inputEmail,
                'firstName': $scope.inputFirst,
                'middleName': $scope.inputMiddle,
                'lastName': $scope.inputLast,
                'dob': $scope.inputDOB,
                'gender': $scope.inputGender
            };

            console.log("starting registration");

            registration.signup(info, function(err) {
                // console.log("done");
                // $location.path('/home');
                if (err) {
                    $scope.error = err;
                } else {
                    login.login($scope.inputLogin, $scope.inputPassword, function(err) {
                        if (err) {
                            $scope.error = err;
                        } else {
                            $location.path('/home');
                        }
                    });
                }
            });

        };

    });
