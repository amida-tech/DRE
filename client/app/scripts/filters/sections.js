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

                _.each(flag, function (flagEntry) {

                    if (flagEntry.name === section.section) {
                        if (flagEntry.value) {
                            filteredResults.push(section);
                        }
                    }

                });

            });

            return filteredResults;

        };
    });
