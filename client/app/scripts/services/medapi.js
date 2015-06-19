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

        this.findImages = function (rxcui, callback) {
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

        this.findRxNormName = function (medname, callback) {
            $http.post('api/v1/rxnorm/name', {
                medname: medname
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

        this.findRxNormGroup = function (medname, callback) {
            $http.post('api/v1/rxnorm/group', {
                medname: medname
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

        this.findRxNormSpelling = function (medname, callback) {
            $http.post('api/v1/rxnorm/spelling', {
                medname: medname
            }).
            success(function (data, status, headers, config) {
                console.log("spelling data: " + JSON.stringify(data));
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

        this.fdaName = function (medname, callback) {

            $http.post('api/v1/openfda/name', {
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

            $http.post('api/v1/openfda/code', {
                rxcui: rxcui
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

        this.findmedline = function (rxcui, medname, callback) {

            $http.post('api/v1/medlineplus', {
                rxcui: rxcui,
                medname: medname
            }).
            success(function (data, status, headers, config) {
                callback(null, data);
            }).
            error(function (data, status, headers, config) {
                callback(status);
            });
        };

    });
