'use strict';

/**
 * @ngdoc filter
 * @name phrPrototypeApp.filter:sections
 * @function
 * @description
 * # sections
 * Filter in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .filter('sections', function () {
        return function (input, flag) {

            var filteredResults = [];

            _.each(input, function (section) {

                if (flag[section.section]) {
                    filteredResults.push(section);
                }

            });

            return filteredResults;

        };
    });