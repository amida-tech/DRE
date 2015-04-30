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

        this.getImages = function (rxcui, callback) {
            /*
            $http.get('api/v1/rximage/' + rxcui)
                .success(function(data) {
                    callback(data);
                }).error(function(err) {
                    callback(err);
                });
*/
            $http.post('api/v1/rximage', {
                rxcui: rxcui
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

        this.findRxNorm = function (medname, callback) {
            
            $http.get('api/v1/rxnorm/' + name)
                .success(function(data) {
                    callback(null, data);
                }).error(function(err) {
                    callback(err);
                });

            // $http.post('api/v1/rxnorm', {
            //     medname: medname
            // }).
            // success(function (data, status, headers, config) {
            //     callback(null, data);
            // }).
            // error(function (data, status, headers, config) {
            //     callback(status);
            // });
        };

        this.fdaName = function (medname, callback) {

            $http.post('api/v1/openfdaname', {
                medname: medname
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

        this.fdaCode = function (rxcui, callback) {

            $http.post('api/v1/openfdacode', {
                rxcui: rxcui
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

    });
