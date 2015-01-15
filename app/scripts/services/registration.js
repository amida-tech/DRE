'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.registration
 * @description
 * # registration
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('registration', function registration($location, $http) {


        //TODO:  Hygiene here for max length of inputs.
        this.signup = function(info, callback) {
        	var username=info.username;
        	var password=info.password;
        	var email=info.email;


        	console.log("signup", info);

            //TODO: verify info for all the elements
            //if (username && password) {

                $http.post('api/v1/register', {
                        username: username,
                        password: password,
                        email:email
                    })
                    .success(function(data) {
                        //$location.path('/dashboard');
			        	console.log("success");
                        callback(null);
                    }).error(function(data) {
                        //callback(data);
			        	console.log("error", data);
                        callback('Invalid Login and/or Password.');
                    });

                //Stubbed login.
                /*(if ((username === 'test' && password === 'test') || (username === 'test@amida-demo.com' && password === 'test')) {
                    callback(null);
                } else {
                    callback('Invalid Login and/or Password.');
                }*/
            //}
        };
    });
