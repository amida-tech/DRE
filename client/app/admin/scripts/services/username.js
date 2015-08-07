'use strict';

/**
 * @ngdoc service
 * @name phrAdminApp.username
 * @description
 * # check if username and email already exist
 * Service in the phrAdminApp.
 */
angular.module('phrAdminApp')
    .service('username', function username($location, $http) {

        this.checkLogin = function (user, callback) {
            console.log('user>>>', user);
            $http.post('/api/v1/admin/users', {
                    username: user
                })
                .success(function (data) {
                    var userInfo = data;
                    // console.log('username service, ', data);
                    // console.log('searching for username:', userInfo);
                    callback(null, userInfo);
                })
                .error(function (data) {
                    console.log('error finding username', data);
                });
        };

    });
