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

        this.getFullEventName = function(typestring) {
            var fullEventNames = {
                initAccount: 'Account created',
                loggedIn: 'Logged in',
                loggedOut: 'Logged out',
                fileUploaded: 'File uploaded',
                fileDownloaded: 'File downloaded', //could add filename or MHR
                labResults: 'Lab results received', //same as fileUploaded in API
                passwordChange: 'Password changed', //not in API yet
                infoUpdate: 'Personal Information updated' //not in API yet
            };
            return fullEventNames[typestring];
        };

        this.getHistory = function(callback) {
            var recentUrl = $http.get('api/v1/account_history/mostRecent');
            var historyUrl = $http.get('api/v1/account_history/all');
            $q.all([recentUrl, historyUrl]).then(function(result) {
                var recent = result[0].data;
                var full = result[1].data;

                console.log("recent: ", recent);

                var loginTime = recent.login.time;
                var updateTime = recent.update.time;

                var fullHistoryProcessed = [];

                _.each(full, function(historyEvent){
                    var newHistEvent = {
                        type: that.getFullEventName(historyEvent.event_type),
                        time: historyEvent.time,
                        event_type: historyEvent.event_type,
                        note: historyEvent.note
                    };
                    //return newHistEvent;
                    fullHistoryProcessed.push(newHistEvent);
                });

                var history = {
                    lastLogin: loginTime,
                    lastUpdate: updateTime,
                    recordHistory: fullHistoryProcessed
                };
                console.log(history);
                callback(null, history);

            }, function(err) {
                callback(err);
            });
        };

        this.recentUpdates = function(callback) {

        };

        this.fullHistory = function(callback) {

        };
    });
