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


        //TODO:  Hygiene here for max length of inputs.
        this.login = function(username, password, callback) {
            if (username && password) {

                $http.post('api/v1/login', {
                        username: username,
                        password: password
                    })
                    .success(function(data) {
                        //$location.path('/dashboard');
                        callback(null);
                    }).error(function(data) {
                        //callback(data);
                        callback('Invalid Login and/or Password.');
                    });

                //Stubbed login.
                /*(if ((username === 'test' && password === 'test') || (username === 'test@amida-demo.com' && password === 'test')) {
                    callback(null);
                } else {
                    callback('Invalid Login and/or Password.');
                }*/
            }
        };

        this.logout = function(callback) {

            var err = null;


            $http.post('api/v1/logout')
                .success(function() {
                    //$rootScope.isAuthenticated = false;
                    //$location.path('/home');
                    callback(null);
                }).error(function(err) {
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
        this.authStatus = function(callback) {

            $http.get('api/v1/account')
                .success(function() {
                    callback(null, true);
                }).error(function(err) {
                    callback(err, false);
                });

            /*if ($location.path() === "/" || $location.path() === "/login" || $location.path() === "/register" || $location.path() === "/reset") {
                callback(null, false);
            } else {
                callback(null, true);
            }*/

        };

    });
