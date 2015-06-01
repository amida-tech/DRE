'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.authentication
 * @description
 * # authentication
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('authentication', function authentication($rootScope, $location, $http, dataservice, history, notes) {
        var auth_data = {};

        function clearAuth () {
            auth_data = {};
            $rootScope.isAuthorized = false;
        }
        this.clearAuth = clearAuth;

        this.authStatus = function (callback) {
            console.log("auth_data",auth_data);
            if (Object.keys(auth_data).length > 0) {
                if (auth_data.authenticated) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
            } else {
                console.log("should be api call");
                $http.get('/api/v1/account')
                    .success(function (data) {
                        if (data && data.authenticated) {
                            auth_data.authenticated = true;
                            console.log("authenticated: ",auth_data);
                            callback(null, true);
                        } else {
                            auth_data.authenticated = false;
                            callback(null, false);
                        }

                    }).error(function (err) {
                        auth_data.authenticated = false;
                        callback(err, false);
                    });
            }
        };

        this.login = function (username, password, callback) {
            // console.log("login service:", username, password);
            if (username && password) {
                $http.post('api/v1/login', {
                        username: username,
                        password: password
                    })
                    .success(function (data) {
                        notes.forceRefresh();
                        dataservice.forceRefresh();
                        history.forceRefresh();
                        auth_data.authenticated = true;
                        callback(null);
                    })
                    .error(function (data) {
                        console.log("login failed");
                        //callback(data);
                        auth_data.authenticated = false;
                        callback('Invalid Login and/or Password.');
                    });
            }
        };

        this.logout = function (callback) {
            var err = null;

            $http.post('api/v1/logout')
                .success(function () {
                    notes.forceRefresh();
                    dataservice.forceRefresh();
                    history.forceRefresh();
                    clearAuth();
                    callback(null);
                }).error(function (err) {
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
