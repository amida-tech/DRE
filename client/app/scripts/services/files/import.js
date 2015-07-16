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

    this.getRequestToken = function (cb) {
        var requestTokenUrl = "/api/v1/oauth/withings";
        $http.get(requestTokenUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    };

    this.getAccessToken = function (url, cb) {
        var accessTokenUrl = "/api/v1/oauth/withings/oauth_callback?" + url.split('?')[1];
        $http.get(accessTokenUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    };

    this.getDailyWeight = function (cb) {
        var weightUrl = "/api/v1/oauth/withings/weight";
        $http.get(weightUrl)
            .success(function (file) {
                // gets the absolute path of a new CSV
                // we now use the storage API
                var uploadUrl = "/api/v1/storage";
                var blob = new Blob([file.data]);
                blob.lastModified = new Date();
                var fd = new FormData();
                fd.append('file', blob, file.name);
                $http.put(uploadUrl, fd, {
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function (data) {
                        notes.forceRefresh();
                        dataservice.forceRefresh();
                        history.forceRefresh();
                        cb(null, data);
                    })
                    .error(function (data) {
                        cb(data);
                    });
            })
            .error(function (data) {
                cb(data);
            });
    }

    this.subscribeWeightNotifications = function (cb) {
        var subscribeUrl = "/api/v1/oauth/withings/subscribe/weight";
        $http.post(subscribeUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    }

    this.revokeWeightNotifications = function (cb) {
        var unsubscribeUrl = "/api/v1/oauth/withings/subscribe/weight";
        $http.delete(unsubscribeUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    }
}
