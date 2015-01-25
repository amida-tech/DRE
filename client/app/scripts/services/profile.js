'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.registration
 * @description
 * # post registration info to profile
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('profile', function profile($location, $http) {


        //TODO:  Hygiene here for max length of inputs.
        this.demographics = function(info, callback) {
            // var demoInfo = {
            //     'name.first': info.firstName,
            //     'name.middle': info.middleName,
            //     'name.last': info.lastName,
            //     //will need to do some date formatting here
            //     'dob': info.dob,
            //     'gender': info.gender
            // };

            // console.log("profile", demoInfo);

            // verify info for all the elements in api

            // $http.put('api/v1/record/demographics', {
            // 	demoInfo
            // }).success(function(data) {
            //     console.log("registration successful");
            //     callback(null);
            // }).error(function(data) {
            //     //callback(data);
            //     // console.log("error", data);
            //     callback('Invalid Login and/or Password.');
            // });


        };

        this.showProfile = function(callback) {
        	$http.get('api/v1/record/demographics')
        	.success(function(data) {
        		var profileInfo = data.demographics[0];
        		console.log('obtained profile info', profileInfo);
        		callback(null, profileInfo);
        	})
        	.error(function(data) {
        		callback('error getting profile info');
        	});
        };
    });
