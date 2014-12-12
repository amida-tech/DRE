'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:profile
 * @description
 * # profile
 */
angular.module('phrPrototypeApp')
  .directive('profile', function () {
    return {
      templateUrl: 'views/templates/profile.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        	
      }
    };
  });
