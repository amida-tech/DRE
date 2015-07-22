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

importService.$inject = ['$http', '$q', 'dataservice', 'history', 'notes'];

function importService($http, $q, dataservice, history, notes) {
    /* jshint validthis: true */

    this.checkWithingsStatus = function (cb) {
        var authUrl = "/api/v1/oauth/withings/auth";
        $http.get(authUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    };

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
            .success(function (data) {
                // we now use the storage API to upload
                // BB JSON and the CSV
                var uploadUrl = "/api/v1/storage";
                var blobCSV = new Blob([data.csv], {
                    type: 'text/csv'
                });
                var blobJSON = new Blob([JSON.stringify(data.json)], {
                    type: 'application/json'
                });
                blobCSV.lastModified = new Date();
                blobJSON.lastModified = new Date();
                var fdCSV = new FormData();
                var fdJSON = new FormData();
                fdCSV.append('file', blobCSV, data.name);
                fdJSON.append('file', blobJSON, data.name + '.json');

                $q.all({
                    csv: $http.put(uploadUrl, fdCSV, {
                        headers: {
                            'Content-Type': undefined
                        }
                    }),
                    json: $http.put(uploadUrl, fdJSON, {
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                }).then(function (data) {
                    notes.forceRefresh();
                    dataservice.forceRefresh();
                    history.forceRefresh();
                    cb(null, data);
                }, function (error) {
                    cb(error);
                })
            })
            .error(function (data) {
                cb(data);
            });
    };

    this.subscribeWeightNotifications = function (cb) {
        var subscribeUrl = "/api/v1/oauth/withings/subscribe/weight";
        $http.post(subscribeUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    };

    this.revokeWeightNotifications = function (cb) {
        var unsubscribeUrl = "/api/v1/oauth/withings/subscribe/weight";
        $http.delete(unsubscribeUrl)
            .success(function (data) {
                cb(null, data);
            })
            .error(function (data) {
                cb(data);
            });
    };
}
