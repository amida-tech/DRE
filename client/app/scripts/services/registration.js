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
            var username = info.username;
            var password = info.password;
            var email = info.email;
            var firstName = info.firstName;
            var lastName = info.lastName;
            var middleName = info.middleName;
            var dob = info.dob;
            var gender = info.gender;

            console.log("signup", info);

            // verify info for all the elements in api

            $http.post('api/v1/register', {
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                middleName: middleName,
                dob: dob,
                gender: gender
            })
            .success(function(data) {
                console.log("registration successful");
                callback(null);


            }).error(function(data) {
                //callback(data);
                // console.log("error", data);
                callback('Invalid Login and/or Password.');
            });


        };
    });
