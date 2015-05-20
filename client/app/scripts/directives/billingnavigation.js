'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:billingNavigation
 * @description
 * # billingNavigation
 */
angular.module('phrPrototypeApp').directive('billingNavigation', ['$window',
    function ($window) {
        return {
            templateUrl: 'views/templates/billingnavigation.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //Active Link Highlighting.
                element.find("#nav" + scope.entryType).addClass("active");
                /*
                                scope.setEntryType = function (type) {
                                    element.find("#nav" + scope.entryType).removeClass("active");
                                    scope.entryType = type;
                                    element.find("#nav" + scope.entryType).addClass("active");
                                };
                */
            }
        };
    }
]);
