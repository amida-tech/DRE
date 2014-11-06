'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.history
 * @description
 * # history
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('history', function history() {

        this.account = function (callback) {
            var err = null;

            var history = {
            	lastLogin: '6/30/2014',
            	lastUpdate: '12/23/2013',
            	recordHistory: [
            		{
            			type: 'upload',
            			date: '12/23/2013',
            			file: {
            				name: 'CCDA_1.xml'
            			}

            		},
            		{
            			type: 'download',
            			date: '6/30/2014'
            		}
            	]
            };


            if (err) {
            	callback(err);
            } else {
            	callback(null, history);
            }




        };

    });