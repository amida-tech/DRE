'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:recordNavigation
 * @description
 * # recordNavigation
 */
angular.module('phrPrototypeApp').directive('recordNavigation', ['$window',
    function ($window) {
        return {
            templateUrl: 'views/templates/recordnavigation.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //Active Link Highlighting.
                element.find("#nav" + scope.entryType).addClass("active");

                scope.setEntryType = function (type) {
                    console.log("recordnavigation set entry type ", type);

                    element.find("#nav" + scope.entryType).removeClass("active");
                    scope.entryType = type;
                    element.find("#nav" + scope.entryType).addClass("active");
                };

            }
        };
    }
]);
