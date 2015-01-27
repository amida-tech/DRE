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

        $scope.isUser = false;
        $scope.userList = {};

        function findUsername() {
            username.checkLogin(function(err, userInfo) {
                $scope.userList = userInfo;
                console.log('register controller', $scope.userList);
                for (var element in $scope.userList) {
                    // console.log($scope.userList[element].username);
                    if ($scope.inputLogin === $scope.userList[element].username) {
                        $scope.isUser = true;
                        console.log($scope.isUser, $scope.inputLogin);
                    } 
                }
            });
        }

        findUsername();    

        $scope.nextStep = function() {
            if ($scope.step === 0) {

                findUsername();
                console.log($scope.isUser);
                if ($scope.isUser) {
                    $scope.error = "That Username already exists, please choose another";
                    $scope.isUser = false;
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
                $scope.error = null;
                // $scope.isUser = false;
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
