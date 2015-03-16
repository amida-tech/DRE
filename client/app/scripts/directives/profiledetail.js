'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:profile
 * @description
 * # profile
 */
angular.module('phrPrototypeApp').directive('profiledetail', function (profile, format) {
    return {
        templateUrl: 'views/templates/details/demographics.html',
        restrict: 'EA',
        scope: {
            demographics: '='
        },
        link: function postLink(scope, element, attrs) {

        }
    };
});
