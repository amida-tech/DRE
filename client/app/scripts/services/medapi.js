'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.medapi
 * @description
 * # medapi
 * Service in the phrPrototypeApp.
 */
 
angular.module('phrPrototypeApp')
    .service('medapi', function medapi($http) {

        this.getImages = function(rxcui, callback) {
            $http.get('api/v1/openfda/'+rxcui)
                .success(function (data) {
                	callback(data);
                }).error(function (err) {
                    callback(err);
                });
        };

        this.findRxNorm = function(name, callback) {
            $http.get('api/v1/rxnorm/'+name)
                .success(function (data) {
                	callback(data);
                }).error(function (err) {
                    callback(err);
                });
        };

    });