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

                var history = {
                    recordHistory: fullHistoryProcessed.reverse()
                };

                if (recent.login) {
                    history.lastLogin = recent.login.time;
                }

                if (recent.update) {
                    history.lastUpdate = recent.update.time;
                }

                //console.log(history);
                callback(null, history);

            }, function (err) {
                callback(err);
            });
        };

        this.recentUpdates = function (callback) {

        };

        this.fullHistory = function (callback) {

        };
    });
