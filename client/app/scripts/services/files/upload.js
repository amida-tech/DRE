'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.files/upload
 * @description
 * # files/upload
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('upload', function upload($http) {

        //File upload.
        this.uploadRecord = function(file, callback) {

            var uploadUrl = "/api/v1/storage";

            var fd = new FormData();
            fd.append('file', file);
            $http.put(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .success(function(data) {
                    callback(null, data);
                })
                .error(function(data) {
                    callback(data);
                });

        };
    });
