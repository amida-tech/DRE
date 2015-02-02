'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:username
 * @description
 * # username
 */
angular.module('phrPrototypeApp')
    .directive('username', function(profile) {


        return {
            template: '{{user_first}} {{user_last}}',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //$scope.user_first="blah";

                profile.getProfile(function(err, profileInfo) {
                    if (profileInfo.name.first) {
                    scope.user_first = profileInfo.name.first;
                    scope.user_last = profileInfo.name.last;
                    }
                });

            }
        };
    });
