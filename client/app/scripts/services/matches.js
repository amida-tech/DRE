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

    this.setMasterRecord = function (rawRecord) {
        this.masterRecord = rawRecord;
    };
    this.getCategory = function (category) {
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
        }).then(function (response) {
            if (typeof response.data === 'object') {
                console.log("GOT MATCHES ", response.data);
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

    this.getSection = function () {
        return this.section;
    };
    this.setSection = function (section) {
        this.section = section;
    };

    this.getMatchId = function () {
        return this.matchId;
    };
    this.setMatchId = function (matchId) {
        this.matchId = matchId;
    };

    //API methods for updating and ignoring match

    this.discardMatch = function () {
        var section = this.section;
        if (this.section === "conditions") {
            section = "problems";
        }
        if (this.section === "social") {
            section = "social_history";
        }

        $http({
            method: 'POST',
            url: '/api/v1/matches/' + section + '/' + this.matchId,
            data: {
                determination: 'ignored'
            }
        }).
        success(function (data, status, headers, config) {
            //TODO something
            //$location.path("match/reconciliation");
        }).
        error(function (data, status, headers, config) {
            console.log('error');
        });
    };

    this.saveMatch = function (updated_entry) {
        var current_match_index = 0; //it is always 0, since we are using only first MHR target from match object

        var section = this.section;
        if (this.section === "conditions") {
            section = "problems";
        }
        if (this.section === "social") {
            section = "social_history";
        }
        $http({
            method: 'POST',
            url: '/api/v1/matches/' + section + '/' + this.matchId + '/' + current_match_index,
            data: {
                determination: 'merged',
                updated_entry: updated_entry
            }
        }).
        success(function (data, status, headers, config) {
            //TODO something
            //$location.path("match/reconciliation");
        }).
        error(function (data, status, headers, config) {
            console.log('error');
        });
    };

    //this method is not used in this version of UI
    /*
    this.createMatch = function() {
        $http({
            method: 'POST',
            url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id,
            data: {
                determination: 'added'
            }
        }).
        success(function(data, status, headers, config) {
            //Note:  Pill count not refreshing.
            $location.path("match/reconciliation");
        }).
        error(function(data, status, headers, config) {
            console.log('error');
        });
    };
    */

});
