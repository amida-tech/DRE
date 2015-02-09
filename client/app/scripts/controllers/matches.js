'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('MatchesCtrl', function($scope, matches) {
    $scope.masterMatches = [];
    //$scope.categories = ['medications', 'results', 'encounters', 'vitals', 'immunizations', 'allergies', 'procedures'];
    $scope.categories = ['allergies'];
    
    function getData() {
        _.each($scope.categories, function (section) {
            matches.getCategory(section).then(function(data) {
                _.each(data.matches, function(match) {
                    $scope.masterMatches.push({
                        'category':section,
                        'data':match
                    });

                });

            });
        });
        
            //do stuff here
            //$scope.allergyMatch = $scope.masterMatches.data[1];
        
    }
    getData();
});



/*

 _.each($scope.categories, function (section) {
            matches.getCategory(section).then(function(data) {
                _.each(data.matches, function (match) {
                    $scope.masterMatches.push({
                        'category': section,
                        'data': match
                    });

                });
                
            });



        })

        */