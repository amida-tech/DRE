'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timelineIcon
 * @description
 * # timelineIcon
 */
angular.module('phrPrototypeApp')
    .directive('timelineIcon', function ($compile) {
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

                var medRouteIconMap = [{
                    code: 'C38216',
                    icon: 'icon-inhaler'
                }, {
                    code: 'C42944',
                    icon: 'icon-inhaler'
                }, {
                    code: 'C42998',
                    icon: 'icon-pill'
                }];

                var iconEntry = _.findWhere(iconMap, {
                    type: attrs.timelineIconType
                });

                if (iconEntry) {
                    if (iconEntry.type === 'medications') {
                        var html = '<i class="fa-2x icon-pill"></i>';
                        if (scope.recordEntry.inactive) {
                            html = '<i class="overlay fa-2x icon-pill"></i>';
                        }
                        if (attrs.timelineIconMeta) {
                            var iconMeta = JSON.parse(attrs.timelineIconMeta);
                            if (_.deepGet(scope.entryData, 'administration.form.code')) {
                                var route = scope.entryData.administration.form.code;
                                var medRouteIconEntry = _.findWhere(medRouteIconMap, {
                                    code: route
                                });
                                if (medRouteIconEntry) {
                                    if (scope.recordEntry.inactive) {
                                        html = '<i class="overlay fa-stack-2x ' + medRouteIconEntry.icon + '"></i></span>';
                                    } else {
                                        html = '<i class="fa-2x ' + medRouteIconEntry.icon + '"></i>';
                                    }
                                }
                            }
                        }
                        var i = $compile(html)(scope);
                        element.children().replaceWith(i);
                    } else {
                        element.children().addClass(iconEntry.icon);
                    }
                } else {
                    element.children().addClass('fa-pencil');
                }

                element.children().attr("id", "entry" + attrs.timelineIndex);

            }
        };
    });
