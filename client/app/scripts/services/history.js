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

        this.getFullEventName = function (typestring) {
            var fullEventNames = {
                initAccount: 'Account created',
                loggedIn: 'Logged in',
                loggedOut: 'Logged out',
                fileUploaded: 'File uploaded',
                fileDownloaded: 'File downloaded', //could add filename or MHR
                labResults: 'Lab results received', //same as fileUploaded in API
                passwordChange: 'Password changed', //not in API yet
                infoUpdate: 'Profile updated' //not in API yet
            };
            return fullEventNames[typestring];
        };

        this.getHistory = function (callback) {
            var recentUrl = $http.get('api/v1/account_history/mostRecent');
            var historyUrl = $http.get('api/v1/account_history/all');
            $q.all([recentUrl, historyUrl]).then(function (result) {
                var recent = result[0].data;
                var full = result[1].data;

                //console.log("recent: ", recent);

                //var loginTime = recent.login.time;
                //var updateTime = recent.update.time;

                var fullHistoryProcessed = [];

                _.each(full, function (historyEvent) {
                    var newHistEvent = {
                        type: that.getFullEventName(historyEvent.event_type),
                        date: historyEvent.time,
                        event_type: historyEvent.event_type,
                        note: historyEvent.note
                    };
                    //return newHistEvent;
                    fullHistoryProcessed.push(newHistEvent);
                });

                // var chartDates = [];

                // _.each(full, function(historyEvent){
                //     chartDates.push()
                // })

                master_history = {
                    recordHistory: fullHistoryProcessed.reverse()
                };

                if (recent.login) {
                    master_history.lastLogin = recent.login.time;
                }

                if (recent.update) {
                    master_history.lastUpdate = recent.update.time;
                }

                //console.log(history);
                callback(null, master_history);

            }, function (err) {
                callback(err);
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

        this.recentUpdates = function (callback) {

        };

        this.fullHistory = function (callback) {

        };
    });
