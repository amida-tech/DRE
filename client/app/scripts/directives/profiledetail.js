'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:profile
 * @description
 * # profile
 */
angular.module('phrPrototypeApp').directive('profiledetail', function(profile, format) {
    return {
        templateUrl: 'views/templates/details/demographics.html',
        restrict: 'EA',
        scope: {
            demographics: '='
        },
        link: function postLink(scope, element, attrs) {

            scope.entryTitle = scope.demographics.name.first + " " + scope.demographics.name.middle.join(" ") + " " + scope.demographics.name.last;
            console.log('entryTitle',scope.entryTitle);
        }
    };
});