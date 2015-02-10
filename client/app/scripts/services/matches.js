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
    this.section = "";
    this.matchId = "";


    this.setMasterRecord = function(rawRecord) {
        this.masterRecord = rawRecord;
    };
    this.getCategory = function(category) {
        switch (category) {
            case "conditions":
                category = "problems";
                break;
            case "social":
                category = "social_history";
                break;
        }


        console.log('from server');
        var deferred = $q.defer();
        var dataurl = '/api/v1/matches/' + category;
        return $http({
            url: dataurl,
            method: 'GET',
            cache: true
        }).then(function(response) {
            if (typeof response.data === 'object') {
                console.log("GOT MATCHES ", response.data);
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

    this.getMatchId = function() {
        return this.matchId;
    };
    this.setMatchId = function(matchId) {
        this.matchId = matchId;
    };

});
