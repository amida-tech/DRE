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
            	lastLogin: '9/30/2014',
            	lastUpdate: '7/31/2014',
            	recordHistory: [
                    {
                      type: 'login',
                      date: '9/30/2014'  
                    },
                    {
                        type: 'download',
                        date: '6/30/2014'
                    },
            		{
            			type: 'upload',
            			date: '12/23/2013',
            			file: {
            				name: 'CCDA_1.xml'
            			}

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