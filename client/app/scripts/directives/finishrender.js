'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:username
 * @description
 * # username
 */
angular.module('phrPrototypeApp').directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
           }
        }
    };
});