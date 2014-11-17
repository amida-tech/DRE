'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timelineIcon
 * @description
 * # timelineIcon
 */
angular.module('phrPrototypeApp')
    .directive('timelineIcon', function () {
        return {
            template: '<i class="fa fa-2x"></i>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {

                var iconMap = [{
                    type: 'allergies',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'encounters',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'immunizations',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'medications',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'conditions',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'procedures',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'vitals',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'results',
                    icon: 'fa-exclamation-triangle'
                }, {
                    type: 'social',
                    icon: 'fa-exclamation-triangle'
                }];

                var iconEntry = _.findWhere(iconMap, {
                    type: attrs.timelineIconType
                });

                if (iconEntry) {
                    element.children().addClass(iconEntry.icon);
                } else {
                    element.children().addClass('fa-pencil');
                }

                element.children().attr("id", "entry" + attrs.timelineIndex);

            }
        };
    });