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
    this.changePassword = function(info) {
        return $http.post('api/v1/changepassword', info);
    };
}