'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.npi
 * @description
 * # npi
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('npi', function npi($http) {

    this.getNPI = function (searchOptions, callback) {
        $http.get('api/v1/npi')
            .success(function (data) {
                callback(null, data);
            }).error(function (err) {
                callback(err);
            });

    };

});
