'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.validFile
 * @description
 * # valid file directive
 * Directive in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .directive('validFile', function () {
        return {
            require: 'ngModel',
            link: function (scope, el, attrs, ngModel) {
                ngModel.$render = function () {
                    ngModel.$setViewValue(el.val());
                };

                el.bind('change', function () {
                    scope.$apply(function () {
                        ngModel.$render();
                    });
                });
            }
        };
    });