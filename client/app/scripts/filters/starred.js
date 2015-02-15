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

                _.each(flag, function (flagEntry) {

                    if (flagEntry.name === 'starred' && flagEntry.value) {
                        if (entry.note.starred) {
                            filteredResults.push(entry);
                        }
                    }

                    if (flagEntry.name === 'unStarred' && flagEntry.value) {
                        if (!entry.note.starred) {
                            filteredResults.push(entry);
                        }
                    }

                });

            });

            return filteredResults;
        };
    });
