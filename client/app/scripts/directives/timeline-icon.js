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
                    icon: 'fa-stethoscope'
                }, {
                    type: 'immunizations',
                    icon: 'fa-shield'
                }, {
                    type: 'medications',
                    icon: 'fa-plus-circle'
                }, {
                    type: 'conditions',
                    icon: 'fa-list'
                }, {
                    type: 'procedures',
                    icon: 'fa-medkit'
                }, {
                    type: 'vitals',
                    icon: 'fa-heart'
                }, {
                    type: 'results',
                    icon: 'fa-flask'
                }, {
                    type: 'social',
                    icon: 'fa-group'
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
