'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('RegisterCtrl', function ($scope, $location, registration, login, username) {

        $scope.step = 0;

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
            if ($scope.step === 0) {

                username.checkLogin($scope.inputLogin, function (err, user_exists) {
                    if (user_exists) {
                        $scope.error = "That Username already exists, please choose another";
                        return;
                    }

                    // $scope.userList = userInfo;
                    // // console.log('register controller', $scope.userList);
                    // for (var element in $scope.userList) {
                    //     // console.log($scope.userList[element].username);
                    //     if ($scope.inputLogin === $scope.userList[element].username) {
                    //         $scope.isUser = true;
                    //         // console.log($scope.isUser, $scope.userList[element].username, $scope.inputLogin);
                    //         $scope.error = "That Username already exists, please choose another";
                    //         return;
                    //     }
                    // }
                    if ($scope.inputPassword === $scope.inputRepeatPassword) {
                        $scope.step = $scope.step + 1;
                        $scope.error = null;
                        $scope.focusInput = true;
                    } else {
                        $scope.error = "Entered Passwords did not match";
                        return;
                    }
                });

            } else {
                $scope.step = $scope.step + 1;
                $scope.error = null;
                $scope.focusInput = false;
                // $scope.isUser = false;
                // console.log($scope.step);
            }

        };

        $scope.finish = function () {
            //calling webservice for registration, format DOB
            var info = {
                'username': $scope.inputLogin,
                'password': $scope.inputPassword,
                'email': $scope.inputEmail,
                'firstName': $scope.inputFirst,
                'middleName': $scope.inputMiddle,
                'lastName': $scope.inputLast,
                'dob': moment($scope.inputDOB).format('YYYY-MM-DD'),
                'gender': $scope.inputGender
            };

            console.log("starting registration", info.dob);

            registration.signup(info, function (err) {
                // console.log("done");
                // $location.path('/home');
                if (err) {
                    $scope.error = err;
                } else {
                    login.login($scope.inputLogin, $scope.inputPassword, function (err) {
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
