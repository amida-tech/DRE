'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.authentication
 * @description
 * # authentication
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('authentication', function authentication($location, $http) {

        this.logout = function (callback) {

            var err = null;

            $http.post('api/v1/logout')
                .success(function () {
                    //$rootScope.isAuthenticated = false;
                    //$location.path('/home');
                    callback(null);
                }).error(function (err) {
                    callback(err);
                });

            //Stubbed logout.
            /*if (err) {
                callback(err);
            } else {
                callback(null);
            }*/
        };

        //This would be a server call, but now just stubbed with $location.
        this.authStatus = function (callback) {

            $http.get('api/v1/account')
                .success(function (data) {
                    if (data && data.authenticated) {
                        callback(null, true);
                        // console.log(data, data.authenticated);
                    } else {
                        callback(null, false);
                    }

                }).error(function (err) {
                    callback(err, false);
                });

            /*if ($location.path() === "/" || $location.path() === "/login" || $location.path() === "/register" || $location.path() === "/reset") {
                callback(null, false);
            } else {
                callback(null, true);
            }*/

        };

    });
