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

        function clearAuth() {
            auth_data = {};
            $rootScope.isAuthorized = false;
        }
        this.clearAuth = clearAuth;

        this.authStatus = function(callback) {
            if (Object.keys(auth_data).length > 0) {
                if (auth_data.authenticated) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            } else {
                $http.get('/api/v1/account')
                    .success(function(data) {
                        if (data && data.authenticated) {
                            auth_data.authenticated = true;
                            callback(null, true);
                        } else {
                            auth_data.authenticated = false;
                            callback(null, false);
                        }

                    }).error(function(err) {
                        auth_data.authenticated = false;
                        callback(err, false);
                    });
            }
        };

        this.getClient = function(clientId, callback) {
            $http.post('/oauth2/client', {
                    clientId: clientId
                })
                .success(function(data) {
                    callback(null, data);

                }).error(function(err) {
                    callback(err);
                });
        };

        this.decisionAuth = function(client, redirectUri, responseType, callback) {
            /* These are within fhir callback for argonaut client
                var client_id = req.query.client_id;
                var code = req.query.code; //????
            */
            $http({
                method: 'POST',
                url: '/oauth2/loggedin?clientId='+client.clientId,
                query: {
                    client_id: 'asdf'
                },
                data: {
                    clientId: client.clientId,
                    redirectUri: redirectUri,
                    response: responseType
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .success(function(data) {
                    callback(null, data);

                }).error(function(err) {
                    callback(err);
                });
            $http.post('/oauth2/loggedin?clientId='+client.clientId, {
                    clientId: client.clientId,
                    redirectUri: redirectUri,
                    response: responseType
                })
                .success(function(data) {
                    callback(null, data);

                }).error(function(err) {
                    callback(err);
                });
        };

        this.denyAuth = function(callback) {
            callback();
        };

        this.approveAuth = function(callback) {
            callback();
        };

        this.authorizeClient = function(clientId, callback) {
            $http.post('/oauth2/decision', {
                    clientId: clientId
                })
                .success(function(data) {
                    callback(null, data);

                }).error(function(err) {
                    callback(err);
                });
        };

        this.login = function(username, password, callback) {
            // console.log("login service:", username, password);
            if (username && password) {
                $http.post('api/v1/login', {
                        username: username,
                        password: password
                    })
                    .success(function(data) {
                        notes.forceRefresh();
                        dataservice.forceRefresh();
                        history.forceRefresh();
                        auth_data.authenticated = true;
                        callback(null);
                    })
                    .error(function(data) {
                        console.log("login failed");
                        //callback(data);
                        auth_data.authenticated = false;
                        callback('Invalid Login and/or Password.');
                    });
            }
        };

        this.logout = function(callback) {
            var err = null;

            $http.post('api/v1/logout')
                .success(function() {
                    notes.forceRefresh();
                    dataservice.forceRefresh();
                    history.forceRefresh();
                    clearAuth();
                    callback(null);
                }).error(function(err) {
                    console.log("logout failed");
                    callback(err);
                });
        };
    });
