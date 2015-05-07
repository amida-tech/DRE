'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.account
 * @description
 * # account
 * Service in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .service('account', account);

account.$inject = ['$http'];

function account($http) {
    /* jshint validthis: true */
    this.changePassword = function (info, callback) {
        $http.post('api/v1/changepassword', info)
            .success(function (data) {
                callback(null, data);
            })
            .error(function (data) {
                callback(data);
            });
    };
}
