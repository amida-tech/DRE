'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.authentication
 * @description
 * # authentication
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('authentication', function authentication($location) {


        //TODO:  Hygiene here for max length of inputs.
        this.login = function (username, password, callback) {
            if (username && password) {
                //Stubbed login.
                if (username === 'test' && password === 'test') {
                    callback(null);
                } else {
                    callback('Invalid Login or Password');
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

        //This would be a server call, but now just stubbed with $location.
        this.authStatus = function (callback) {

            if ($location.path() === "/" || $location.path() === "/login" || $location.path() === "/register") {
                callback(null, false);
            } else {
                callback(null, true);
            }

        };

    });