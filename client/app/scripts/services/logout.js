'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.logout
 * @description
 * # log out
 * Service in the phrPrototypeApp.
 */

angular.module('phrPrototypeApp')
    .service('logout', function logout($location, $http) {


        this.logout = function(callback) {
        	console.log("logout service");
            var err = null;


            $http.post('api/v1/logout')
                .success(function() {
                	console.log("logout successful");
                    //$rootScope.isAuthenticated = false;
                    //$location.path('/home');
                    callback(null);
                }).error(function(err) {
                	console.log("logout failed");
                    callback(err);
                });

            //Stubbed logout.
            /*if (err) {
                callback(err);
            } else {
                callback(null);
            }*/
        };
    });