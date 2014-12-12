'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:recordNavigation
 * @description
 * # recordNavigation
 */
angular.module('phrPrototypeApp').directive('recordNavigation', ['$window',
    function($window) {
        return {
            templateUrl: 'views/templates/recordnavigation.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //Active Link Highlighting.
                //$.lockfixed(".sidebar-control",{offset: {top: 10},forcemargin: true});
                if (_.isUndefined(scope.entryType)) {
                    element.find("#navall").addClass("active");
                } else {
                    element.find("#nav" + scope.entryType).addClass("active");
                };
                
                
            }
        };
    }
]);