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
    $scope.match = {};

    //$scope.categories = ['medications', 'results', 'encounters', 'vitals', 'immunizations', 'allergies', 'procedures'];
    if (_.isEmpty(matches.getSection())) {
        $scope.section = "medications";
    } else {
        $scope.section = matches.getSection();
    }

    if (_.isEmpty(matches.getMatchId())) {
        $scope.matchId = "";
        //pick match with index 0 for development purposes?
        $scope.match = {};
    } else {
        $scope.matchId = matches.getMatchId();
        //inject-select proper match to use in view template
        _.each($scope.masterMatches, function(match) {
            console.log("match", match.data._id, $scope.matchId);
            if (match.data._id === $scope.matchId) {
                $scope.match = match;
            }

        });

    }


    function getData(section) {
        matches.getCategory(section).then(function(data) {
            console.log('data', data);
            _.each(data.matches, function(match) {
                $scope.masterMatches.push({
                    'category': section,
                    'data': match
                });

            });




            if (_.isEmpty(matches.getSection())) {
                $scope.section = "medications";
            } else {
                $scope.section = matches.getSection();
            }

            if (_.isEmpty(matches.getMatchId())) {
                $scope.matchId = "";
                //pick match with index 0 for development purposes?
                $scope.match = {};
            } else {
                $scope.matchId = matches.getMatchId();
                //inject-select proper match to use in view template
                _.each($scope.masterMatches, function(match) {
                    console.log("match", match.data._id, $scope.matchId);
                    if (match.data._id === $scope.matchId) {
                        $scope.match = match;
                    }


                });

            }



        });


        //do stuff here
        //$scope.allergyMatch = $scope.masterMatches.data[1];

    }
    getData($scope.section);
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
