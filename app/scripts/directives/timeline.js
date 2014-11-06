'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timeline
 * @description
 * # timeline
 */
angular.module('phrPrototypeApp')
  .directive('timeline', function ($window) {
    return {
      restrict: 'EA',
      template: "<svg width='850' height='200'></svg>",
      link: function postLink(scope, element, attrs) {
        element.text('this is the timeline directive');
      }
    };
  });
