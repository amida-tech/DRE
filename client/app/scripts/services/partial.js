'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.partial
 * @description
 * # partial
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('partial', function partial() {
        this.getPartialMatches = function (section, callback) {

            if (section === 'allergies') {

                var tmpMatch = [{
                    'asdf': 'asdf'
                }];

                callback(null, tmpMatch);

            }

        };

    });
