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

demo.$inject = ['$http', 'dataservice', 'notes', 'history'];

function demo($http, dataservice, notes, history) {
    /* jshint validthis: true */
    this.resetDemo = function (callback) {
        $http.get('/api/v1/demo')
            .success(function (data) {
                dataservice.forceRefresh();
                notes.forceRefresh();
                history.forceRefresh();
                callback(null, data);
            })
            .error(function (err) {
                // console.log(err);
                callback(err);
            });
    };

    this.uploadFile = function (filePath, fileName, fileType, callback) {
        var fd = {
            'path': filePath,
            'name': fileName,
            'type': fileType
        };
        $http.put('/api/v1/storage/demo', fd)
            .success(function (data) {
                callback(null, data);
            })
            .error(function (data) {
                callback(data);
            });

    };

}
