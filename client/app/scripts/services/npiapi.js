'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.npi
 * @description
 * # npi
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('npiapi', function npi($http) {

    this.getNPI = function (searchObject, callback) {
        $http.post('api/v1/getnpi', {
            searchObj: searchObject
        }).
        success(function (data, status, headers, config) {
            callback(null, data);
        }).
        error(function (data, status, headers, config) {
            callback(status);
        });
    };
});
