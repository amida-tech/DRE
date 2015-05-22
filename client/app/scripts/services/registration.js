'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.registration
 * @description
 * # registration
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('registration', function registration($location, $http, dataservice, history, notes) {

        //TODO:  Hygiene here for max length of inputs.
        this.signup = function (info, callback) {
            // console.log("signup", info);

            // verify info for all the elements in api

            dataservice.forceRefresh();
            history.forceRefresh();
            notes.forceRefresh();

            $http.post('api/v1/register', info)
                .success(function (data) {
                    console.log("registration successful");
                    callback(null);
                }).error(function (data) {
                    //callback(data);
                    // console.log("error", data);
                    callback('Invalid Login and/or Password.');
                });

        };
    });
