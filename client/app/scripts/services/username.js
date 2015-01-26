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

    	this.checkLogin = function(inputlogin, callback) {
    		$http.get('api/v1/users')
    		.success(function(data) {
    			console.log('username service found usernames', data);
    			callback('false');
    		})
    		.error(function(data) {
    			callback('true')
    		});

    	};

    	// this.saveLogin = function(login, callback) {
    	// 	$http.post('api/v1/users', login)
    	// 	.success(function(data) {
    	// 		console.log('username saved');
    	// 	})
    	// 	.error(function(data) {
    	// 		console.log('username could not be saved');
    	// 	});
    	// };

    });
