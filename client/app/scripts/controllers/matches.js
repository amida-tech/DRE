'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('MatchesCtrl', function($scope, matches) {
    $scope.masterMatches = {};
    $scope.categories = ['medications', 'results', 'encounters', 'vitals', 'immunizations', 'allergies', 'procedures'];

    function getData() {
        matches.getCategory("allergies").then(function(data) {
            $scope.masterMatches = {
                'category': "allergies",
                'data': data.matches
            };
            //do stuff here
            $scope.allergyMatch = $scope.masterMatches.data[0];
        });
    }
    getData();
});