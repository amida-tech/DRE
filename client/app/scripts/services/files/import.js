'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.files/upload
 * @description
 * # files/upload
 * Service in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .service('importService', importService);

importService.$inject = ['$http', 'dataservice', 'history', 'notes'];

function importService($http, dataservice, history, notes) {
    /* jshint validthis: true */
    this.getRequestToken = function(cb) {
        var requestTokenUrl = "/api/v1/oauth/withings";
        $http.get(requestTokenUrl)
            .success(function(data) {
                cb(null, data);
            })
            .error(function(data) {
                cb(data);
            });
    };
    
    this.getAccessToken = function(cb) {
        var accessTokenUrl = "/api/v1/oauth/withings/oauth_callback";
        $http.get(accessTokenUrl)
            .success(function(data) {
                cb(null, data);
            })
            .error(function(data) {
                cb(data);
            });
    }
}
