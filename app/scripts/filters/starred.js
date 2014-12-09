'use strict';

/**
 * @ngdoc filter
 * @name phrPrototypeApp.filter:starred
 * @function
 * @description
 * # starred
 * Filter in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .filter('starred', function () {
        return function (input, flag) {

            var filteredResults = [];

            _.each(input, function (entry) {

                if (flag.starred) {
                    if (entry.note.starred) {
                        filteredResults.push(entry);
                    }
                }

                if (flag.unStarred) {
                    if (!entry.note.starred) {
                        filteredResults.push(entry);
                    }
                }

            });

            return filteredResults;
        };
    });