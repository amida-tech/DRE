'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.npi
 * @description
 * # npi
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('npiapi', function npi($http) {

    this.findNPI = function (searchObject, callback) {
        $http.post('api/v1/findnpi', {
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
