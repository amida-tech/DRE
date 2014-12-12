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
                '<a href="#/billing/insurance" class="btn btn-info btn-block" ng-class="{active: entryInsurance}">Insurance</a>' +
                '<a href="#/billing/claims" class="btn btn-info btn-block" ng-class="{active: entryClaims}">Claims</a>' +
                '</div>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {

                scope.entryInsurance = false;
                scope.entryClaims = false;

                if (scope.entryType === 'insurance') {
                    scope.entryInsurance = true;
                } else if (scope.entryType === 'claims') {
                    scope.entryClaims = true;
                }
                
            }
        };
    });
