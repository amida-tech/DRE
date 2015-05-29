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
        var auth_data = {};

        this.clearAuth = function () {
            auth_data = {};
        };

        this.authStatus = function (callback) {
            console.log("auth_data",auth_data);
            if (Object.keys(auth_data).length > 0) {
                if (auth_data && auth_data.authenticated) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
            } else {
                $http.get('/api/v1/account')
                    .success(function (data) {
                        auth_data = data;
                        if (data && data.authenticated) {
                            callback(null, true);
                        } else {
                            callback(null, false);
                        }

                    }).error(function (err) {
                        callback(err, false);
                    });
            }
        };

    });
