'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.login
 * @description
 * # log in
 * Service in the phrPrototypeApp.
 */

angular.module('phrPrototypeApp')
    .service('login', function login($location, $http, dataservice, history, notes) {

        //TODO:  Hygiene here for max length of inputs.
        this.login = function (username, password, callback) {
            // console.log("login service:", username, password);
            if (username && password) {

                $http.post('api/v1/login', {
                        username: username,
                        password: password
                    })
                    .success(function (data) {
                        console.log("login successful");
                        notes.forceRefresh();
                        dataservice.forceRefresh();
                        history.forceRefresh();
                        callback(null);
                    })
                    .error(function (data) {
                        console.log("login failed");
                        //callback(data);
                        callback('Invalid Login and/or Password.');
                    });

                //Stubbed login.
                /*
                if ((username === 'test' && password === 'test') || (username === 'test@amida-demo.com' && password === 'test')) {
                    callback(null);
                } else {
                    callback('Invalid Login and/or Password.');
                }
                */
            }
        };
    });
