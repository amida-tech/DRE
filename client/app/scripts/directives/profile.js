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
                    scope.user_first = profileInfo.name.first;
                    scope.user_last = profileInfo.name.last;
                    scope.user_email = profileInfo.email[0].email;
                    scope.user_dob = profileInfo.dob;
                });

            }
        };
    });
