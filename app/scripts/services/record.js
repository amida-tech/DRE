'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
  .service('record', function record($http, $q, allergies, conditions, encounters, immunizations, medications, procedures, results, social, vitals) {
   	
  	this.getRecord = function(callback) {

  		var masterRecord = {};

      var iter = 0;
      var iterLength = 9;

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

      conditions.getRecord(function(err, conditions) {
        masterRecord.conditions = conditions;
        iter++;
        tryCallback();  
      });

      encounters.getRecord(function(err, encounters) {
        masterRecord.encounters = encounters;
        iter++;
        tryCallback();  
      });

      immunizations.getRecord(function(err, immunizations) {
        masterRecord.immunizations = immunizations;
        iter++;
        tryCallback();  
      });

      medications.getRecord(function(err, medications) {
        masterRecord.medications = medications;
        iter++;
        tryCallback();  
      });

      procedures.getRecord(function(err, procedures) {
        masterRecord.procedures = procedures;
        iter++;
        tryCallback();  
      });

      results.getRecord(function(err, results) {
        masterRecord.results = results;
        iter++;
        tryCallback();  
      });    

      social.getRecord(function(err, social) {
        masterRecord.social = social;
        iter++;
        tryCallback();  
      });    

      vitals.getRecord(function(err, vitals) {
        masterRecord.vitals = vitals;
        iter++;
        tryCallback();
      });

  	};
    this.getData = function () {
            var deferred = $q.defer();
            var dataurl = '/scripts/services/record/record.json';
            return $http({url: dataurl, method: 'GET', cache: true}).then(function (response) {
                if (typeof response.data === 'object') {
                    return response.data;
                    
                } else {
                    // invalid response
                    console.log('didnt get data');
                    return deferred.reject(response.data);
                }
            }, function (error) {
                // something went wrong
                console.log('data errorrrrrrr');
                return deferred.reject(error);
            });
        };

  });
