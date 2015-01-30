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

        this.getFullEventName = function(typestring){
            var fullEventNames = {
                initAccount:'Account created', 
                loggedIn:'Logged in',
                loggedOut:'Logged out',
                fileUploaded:'File uploaded',
                fileDownloaded:'File downloaded', //could add filename or MHR
                labResults:'Lab results received', //same as fileUploaded in API
                passwordChange:'Password changed', //not in API yet
                infoUpdate:'Personal Information updated' //not in API yet
            };
            return fullEventNames[typestring];
        };

        this.getHistory = function(callback){
            var recentUrl = $http.get('api/v1/account_history/mostRecent');
            var historyUrl = $http.get('api/v1/account_history/all');
            $q.all([recentUrl, historyUrl]).then(function(result){
                var recent = result[0];
                var full = result[1];

                var loginTime = format.formatDate(recent.login.time);
                var updateTime = format.formatDate(recent.update.time);
                var fullHistoryProcessed = _.each(full, function(historyEvent){
                    var newHistEvent = {
                        type: this.getFullEventName(historyEvent.event_type),
                        date: historyEvent.time
                    };
                    return newHistEvent;
                });

                var history = {
                    lastLogin: loginTime,
                    lastUpdate: updateTime,
                    recordHistory: fullHistoryProcessed
                };
                console.log(history);
                callback(history);
            }, function(err){
                callback(err);
            });
        };

        this.recentUpdates = function(callback){

        };

        this.fullHistory = function(callback){

        };
    });