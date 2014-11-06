'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timeline
 * @description
 * # timeline
 */
angular.module('phrPrototypeApp')
  .directive('timeline', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the timeline directive');
      }
    };
  });
