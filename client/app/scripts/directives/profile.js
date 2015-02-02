'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:profile
 * @description
 * # profile
 */
angular.module('phrPrototypeApp')
    .directive('profile', function(profile) {


        return {
            templateUrl: 'views/templates/profile.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //$scope.user_first="blah";

                profile.getProfile(function(err, profileInfo) {
                    if (profileInfo.email[0].email) {
                        scope.user_email = profileInfo.email[0].email;
                    }
                    if (profileInfo.dob) {
                        scope.user_dob = profileInfo.dob;
                    }                
                });

            }
        };
    });
