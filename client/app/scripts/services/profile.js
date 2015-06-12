'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.profile
 * @description
 * # post registration info to profile
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('profile', function profile($location, $http, format) {
        var profileInfo = {};

        this.getProfile = function (callback) {
            if (Object.keys(profileInfo).length > 0) {
                callback(null, profileInfo);
            } else {
                $http.get('/api/v1/record/demographics')
                    .success(function (data) {
                        console.log("master record fetched successfuly");
                        profileInfo = data.demographics[0];
                        callback(null, profileInfo);
                    })
                    .error(function (err) {
                        console.log("fetching master record failed", err);
                        callback("profileInfo failed " + err);
                    });
            }
        };

        this.saveProfile = function (info, callback) {
            $http.post('/api/v1/record/demographics', info)
                .success(function (data) {
                    callback(null);
                })
                .error(function (data) {
                    callback('error saving profile info');
                });
        };

        this.forceRefresh = function () {
            profileInfo = {};
        };
    });
