'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.demo
 * @description
 * # demo
 * Service in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .service('demo', demo);

demo.$inject = ['$http'];

function demo($http) {
    /* jshint validthis: true */
    this.resetDemo = function (callback) {
        $http.get('/api/v1/demo')
            .success(function (data) {
                // dataservice.forceRefresh();
                callback(null, data);
            })
            .error(function (err) {
                // console.log(err);
                callback(err);
            });
    };

    this.uploadFile = function (file, callback) {
        var fd = {
            'file': file,
            'check': false
        };
        // fd.append('file', file);
        // fd.append('check', false);
        $http.put('/api/v1/storage/demo', fd)
            .success(function (data) {
                callback(null, data);
            })
            .error(function (data) {
                callback(data);
            });

    };

}
