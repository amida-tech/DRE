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
