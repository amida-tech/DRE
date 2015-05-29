'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.logout
 * @description
 * # log out
 * Service in the phrPrototypeApp.
 */

angular.module('phrPrototypeApp')
    .service('logout', function logout($location, $http, dataservice, history, notes, authentication) {

        this.logout = function (callback) {
            var err = null;

            $http.post('api/v1/logout')
                .success(function () {
                    notes.forceRefresh();
                    dataservice.forceRefresh();
                    history.forceRefresh();
                    authentication.clearAuth();
                    //$rootScope.isAuthenticated = false;
                    //$location.path('/home');
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
