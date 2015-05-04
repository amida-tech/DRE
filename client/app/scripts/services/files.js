'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.files
 * @description
 * # files
 * Service in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .service('files', files);
    
files.$inject = ['$http'];
 
function files($http) {
    /* jshint validthis: true */
    this.getFiles = function (callback) {
        $http.get('/api/v1/storage')
            .success(function (data) {
                callback(null, data.storage);
            }).error(function (err) {
                callback(err);
            });
    };
}
