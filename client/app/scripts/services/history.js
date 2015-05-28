'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.history
 * @description
 * # history
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('history', function history($location, $http, $q, format) {

        var that = this;

        var master_history = {};

        this.getHistory = function (callback) {
            $http.get('/api/v1/account_history/master')
                .success(function (data) {
                    console.log("master history fetched successfuly");
                    master_history = data;
                    callback(null, data);
                })
                .error(function (err) {
                    console.log("fetching master history failed", err);
                    callback("master_record failed " + err);
                });
        };

        this.getAccountHistory = function (callback) {
            if (Object.keys(master_history).length === 0) {
                this.getHistory(function (err, master_history) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, master_history);
                    }
                });
            } else {
                callback(null, master_history);
            }
        };

        this.forceRefresh = function () {
            master_history = {};
        };
    });
