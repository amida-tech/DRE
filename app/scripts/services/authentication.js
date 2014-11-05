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
                //Stubbed login.
                if (username === 'test' && password === 'test') {
                    callback(null);
                } else {
                    callback('Invalid Login');
                }
            }
        };

        this.logout = function (callback) {
            
        	var err = null;

        	//Stubbed logout.
        	if (err) {
        		callback(err);
        	} else {
        		callback(null);
        	}
        };

    });