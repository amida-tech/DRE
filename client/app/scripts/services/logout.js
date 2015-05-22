'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.logout
 * @description
 * # log out
 * Service in the phrPrototypeApp.
 */

angular.module('phrPrototypeApp')
    .service('logout', function logout($location, $http, dataservice, history, notes) {

        this.logout = function (callback) {
            console.log("logout service");
            var err = null;
            dataservice.forceRefresh();
            history.forceRefresh();
            notes.forceRefresh();

            $http.post('api/v1/logout')
                .success(function () {
                    console.log("logout successful");
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
