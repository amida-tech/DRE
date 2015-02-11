'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('MatchesCtrl', function($scope, matches, $location) {
    $scope.masterMatches = [];
    $scope.match = {};

    //$scope.categories = ['medications', 'results', 'encounters', 'vitals', 'immunizations', 'allergies', 'procedures'];


    function setScopeVars() {
        if (_.isEmpty(matches.getSection())) {
            
            console.log("ACHTUNG!!!!!!!");
            /* UNCOMMENT BEFORE FLIGTH! -> blocks refresh on matches page and riderects to records page
                $location.path('/record');
            */

            //for development use only, hardcode section to work on matching pages
            $scope.section = "medications";
        } else {
            $scope.section = matches.getSection();
        }

        if (_.isEmpty(matches.getMatchId())) {
            $scope.matchId = "";
            //pick match with index 0 for development purposes?
            

            console.log("ACHTUNG!!!!!!!");
            /* UNCOMMENT BEFORE FLIGTH! -> blocks refresh on matches page and riderects to records page
                $location.path('/record');
            */
            //for dev use only, reset mach to first one in the list
            if ($scope.masterMatches && $scope.masterMatches[0]) {
                $scope.match = $scope.masterMatches[0];
            }
            else {
                $location.path('/record');
                
            }

        } else {
            $scope.matchId = matches.getMatchId();
            //inject-select proper match to use in view template
            _.each($scope.masterMatches, function(match) {
                //console.log("match", match.data._id, $scope.matchId);
                if (match.data._id === $scope.matchId) {
                    $scope.match = match;
                }

            });

        }
    }

    setScopeVars();

    function getData(section) {
        matches.getCategory(section).then(function(data) {
            //console.log('data', data);
            _.each(data.matches, function(match) {
                $scope.masterMatches.push({
                    'category': section,
                    'data': match
                });

            });




            setScopeVars();



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
