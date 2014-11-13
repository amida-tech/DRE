'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
  .service('record', function record(allergies, vitals) {
   	
  	this.getRecord = function(callback) {

  		var masterRecord = {};

      var iter = 0;
      var iterLength = 2;

      function tryCallback () {

        if (iter === iterLength) {
          callback(null, masterRecord);  
        }
      
      }

  		allergies.getRecord(function(err, allergies) {

  			masterRecord.allergies = allergies;
        iter++;
        tryCallback();
  			
  		});

      vitals.getRecord(function(err, vitals) {

        masterRecord.vitals = vitals;
        iter++;
        tryCallback();

      });

  	};


  });
