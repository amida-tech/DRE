'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.username
 * @description
 * # check if username and email already exist
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('username', function username($location, $http) {

    	this.checkLogin = function (inputlogin, callback) {
    		$http.get('api/v1/users', {
    			username: inputlogin
    		})
    		.success(function(data) {
    			console.log('searching for username:', data);
    			// callback(data);
    		})
    		.error(function(data) {
    			console.log('error finding username');
    		});

    	};

    });
