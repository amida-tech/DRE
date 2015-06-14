'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:username
 * @description
 * # username
 */
angular.module('phrPrototypeApp')
    .directive('username', function ($rootScope) {

        return {
            template: '{{user_first}} {{user_last}}',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //$scope.user_first="blah";

                function displayUsername() {
                    if ($rootScope.profile_info && !angular.isUndefined($rootScope.profile_info.name)) {
                        scope.user_first = $rootScope.profile_info.name.first;
                        scope.user_last = $rootScope.profile_info.name.last;
                        if ($rootScope.profile_info.name.middle && $rootScope.profile_info.name.middle[0]) {
                            scope.user_middle = $rootScope.profile_info.name.middle[0];
                        }
                    }
                }
                scope.$on('profileAvailable', function (evt, profileInfo) {
                    displayUsername();
                });
                displayUsername();
            }
        };
    });
