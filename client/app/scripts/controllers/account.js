'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('AccountCtrl', function($scope, $location, $http) {

        $scope.resetPassword = function() {
            if ($scope.inputNewPassword === $scope.inputRepeatPassword) {
                $scope.resetForm.$setPristine();
                $scope.error = null;

                console.log("password changed here");

                var info = {
                    "old": $scope.inputOldPassword,
                    "new": $scope.inputNewPassword
                };

                $http.post('api/v1/changepassword', info)
                    .success(function(data) {
                        console.log("password change successful");
                        $location.path('/home');
                    }).error(function(data) {
                        console.log('password change failed');
                        $location.path('/home');
                    });


            } else {
                $scope.error = "New passwords did not match";
            }

        };


    });
