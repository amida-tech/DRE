'use strict';
/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('merges', function record($http, format) {

    this.getMerges = function(callback) {
        $http.get('api/v1/merges')
            .success(function(data) {
                callback(null, data);
            })
            .error(function(err) {            	
                callback(err);
            });
    };
});
