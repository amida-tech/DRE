'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:profile
 * @description
 * # profile
 */
angular.module('phrPrototypeApp')
    //.directive('profile', function (profile, format) {
    .directive('profile', function ($rootScope, format) {
        return {
            templateUrl: 'views/templates/profile.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //$scope.user_first="blah";
                function displayProfile() {
                    if ($rootScope.profile_info) {
                        if (!angular.isUndefined($rootScope.profile_info.email)) {
                            scope.user_email = $rootScope.profile_info.email[0].email;
                        }
                        if ($rootScope.profile_info.dob) {
                            scope.user_dob = format.formatDate($rootScope.profile_info.dob.point);
                        }
                        if ($rootScope.profile_info.gender) {
                            scope.user_gender = $rootScope.profile_info.gender;
                        }
                    }
                }

                scope.$on('profileAvailable', function (evt, profileInfo) {
                    displayProfile();
                });
                displayProfile();
            }
        };
    });
