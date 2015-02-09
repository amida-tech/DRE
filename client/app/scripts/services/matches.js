'use strict';
/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('matches', function record($http, $q, format) {
    this.masterRecord = {};
    this.processedRecord = {};
    this.section = "allergies";
    this.recordId = "";
    this.setMasterRecord = function(rawRecord) {
        this.masterRecord = rawRecord;
    };
    this.getCategory = function(category) {
        console.log('from server');
        var deferred = $q.defer();
        var dataurl = '/api/v1/matches/' + category;
        return $http({
            url: dataurl,
            method: 'GET',
            cache: true
        }).then(function(response) {
            if (typeof response.data === 'object') {
                
                return response.data;
            } else {
                // invalid response
                console.log('didnt get data');
                return deferred.reject(response.data);
            }
        }, function(error) {
            // something went wrong
            console.log('data errorrrrrrr');
            return deferred.reject(error);
        });
    };
    this.getSection = function() {
        return this.section;
    };
    this.setSection = function(section) {
        this.section = section;
    };
    
});