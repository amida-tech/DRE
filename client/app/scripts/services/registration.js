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

            // verify info for all the elements in api

                $http.post('api/v1/register', {
                        username: username,
                        password: password,
                        email: email
                });
                $http.post('api/v1/record/demographics', {
                    "demographics.name.first": info.firstName = '',
                    "demographics.name.middle": info.middleName = '',
                    "demographics.name.last": info.lastName = '',
                    //will need to do some date formatting here
                    "demographics.dob": info.dob = '',
                    "demographics.gender": info.gender = ''
                })
                    .success(function(data) {
			        	console.log("registration successful");
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
