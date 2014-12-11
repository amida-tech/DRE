'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:billingNavigation
 * @description
 * # billingNavigation
 */
angular.module('phrPrototypeApp')
    .directive('billingnavigation', function() {
        return {
            template: '<div class="btn-group-vertical col-sm-12 sidebar-control">' +
                '<a href="#/billing/insurance" class="btn btn-info btn-block">Insurance</a>' +
                '<a href="#/billing/claims" class="btn btn-info btn-block">Claims</a>' +
                '</div>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
            	//$.lockfixed(".sidebar-control",{offset: {top: 10},forcemargin: true});
            }
        };
    });
