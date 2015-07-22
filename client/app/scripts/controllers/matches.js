'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('MatchesCtrl', Matches);

Matches.$inject = ['$location', 'matches', 'dataservice'];

function Matches($location, matches, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    vm.masterMatches = [];
    vm.match = {};

    activate();

    function activate() {

        setScopeVars();
        getData(vm.section);

        function setScopeVars() {
            if (_.isEmpty(matches.getSection())) {

                console.log("ACHTUNG!!!!!!!");
                /* UNCOMMENT BEFORE FLIGHT! -> blocks refresh on matches page and riderects to records page
                    $location.path('/record');
                */
                //for development use only, hardcode section to work on matching pages
                vm.section = "medications";
            } else {
                vm.section = matches.getSection();
            }

            if (_.isEmpty(matches.getMatchId())) {
                vm.matchId = "";
                //pick match with index 0 for development purposes?

                console.log("ACHTUNG!!!!!!!");
                /* UNCOMMENT BEFORE FLIGTH! -> blocks refresh on matches page and riderects to records page
                    $location.path('/record');
                */
                //for dev use only, reset mach to first one in the list
                if (vm.masterMatches && vm.masterMatches[0]) {
                    vm.match = vm.masterMatches[0];
                } else {
                    dataservice.getLastSection(function (last_section) {
                        $location.path('/record' + last_section.record);
                    });
                }

            } else {
                vm.matchId = matches.getMatchId();
                //inject-select proper match to use in view template
                _.each(vm.masterMatches, function (match) {
                    //console.log("match", match.data._id, vm.matchId);
                    if (match.data._id === vm.matchId) {
                        vm.match = match;
                    }

                });

            }
        }

        function getData(section) {
            
            dataservice.getMatchSection(section, function (err, matches) {
                    if (err) {
                        console.log("err: " + err);
                    } else {
                        console.log('dataservice match', matches, matches.data);
                        _.each(matches.data, function (match) {
                            // console.log(match);
                            vm.masterMatches.push({
                                'category': section,
                                'data': match
                            });
        
                        });
                        setScopeVars();
                    }
            });
        }
    }
}
