'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.authentication
 * @description
 * # authentication
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('authentication', function authentication() {

        this.login = function (username, password, callback) {

            if (username && password) {
                //Stubbed login functionality.
                if (username === 'test' && password === 'test') {
                    callback(null);
                } else {
                    callback('Invalid Login');
                }
            }
        };

    });