'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, $window, $location, record, format, matches, merges, history, dataservice) {
    console.log("RECORD CONTROLLER LOAD ");
    angular.element("#nav" + $scope.entryType).removeClass("active");
    if (!dataservice.curr_section) {
        $scope.entryType = "all";
        dataservice.curr_section = $scope.entryType;
    }
    else {
        $scope.entryType = dataservice.curr_section;
    }
    angular.element("#nav" + $scope.entryType).addClass("active");


    console.log(Date.now(), " MAGIC OF DATASERVICE STARTS!");


    //TODO may need callback
    function refresh() {
        dataservice.curr_section = $scope.entryType;
        dataservice.getData(function() {
            console.log(Date.now(), "MAGIC IS HERE: ", dataservice.processed_record);
            //console.log("MORE: ", dataservice.all_merges, dataservice.merges_record, dataservice.merges_billing);


            //update merges in scope
            $scope.mergesList_record = dataservice.merges_record;
            $scope.mergesList_billing = dataservice.merges_billing;
            $scope.mergesList = dataservice.all_merges;


            pageRender(dataservice.master_record, dataservice.all_notes);
            $scope.masterMatches = dataservice.curr_processed_matches;

        });
    }

    refresh();



    //Flip All as active selected item in DOM
    function getHistory() {
        history.getHistory(function(err, history) {
            if (err) {
                console.log('ERRROR', err);
            } else {
                //console.log('>>>>accountHistory', history);
                $scope.accountHistory = history;
            }
        });
    }
    getHistory();



    // produces singular name for section name - in records merges list
    $scope.singularName = function(section) {
        switch (section) {
            case 'social_history':
                return 'social history';
            case 'vitals':
                return 'vital sign';
            case 'allergies':
                return 'allergy';
            case 'medications':
                return 'medication';
            case 'problems':
                return 'problem';
            case 'claims':
                return 'claim';
            case 'results':
                return 'test result';
            case 'encounters':
                return 'encounter';
            case 'immunizations':
                return 'immunization';
            case 'insurances':
                return 'insurance';
            case 'procedures':
                return 'procedure';
            default:
                return section;
        }
    };

    function pageRender(data, data_notes) {
        $scope.dashMetrics = {};
        $scope.tabs = [{
            "title": "Weight",
            "data": {},
            "chartName": "d3template"
        }, {
            "title": "Blood Pressure",
            "data": {},
            "chartName": "d3template"
        }];
        $scope.tabs.activeTab = 0;
        $scope.$watch('tabs.activeTab', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.$broadcast('tabchange', {
                    "val": newVal
                });
            }
        });
        $scope.pageLoaded = false;

        
        if (_.isEmpty(dataservice.curr_section)) {
            $scope.entryType = "all";
        } else {
            $scope.entryType = dataservice.curr_section;
        }


        //Flip All as active selected item in DOM
        angular.element("#nav" + $scope.entryType).addClass("active");


        $scope.recordEntries = dataservice.processed_record;


        $scope.recordEntries = _.sortBy($scope.recordEntries, function(entry) {
            if (entry.metadata.datetime[0]) {
                return entry.metadata.datetime[0].date.substring(0, 9);
            } else {
                return '1979-12-12';
            }
        }).reverse();

        if ($scope.entryType === "all") {
            $scope.entryListFiltered = $scope.recordEntries;
        } else {
            $scope.entryListFiltered = _.where($scope.recordEntries, {
                category: $scope.entryType
            });
        }

        $scope.$watch('entryType', function(newVal, oldVal) {
            //keeping current section name in scope
            //alert('entryType new:'+newVal+" old:"+oldVal);
            $scope.entryType = newVal;
            dataservice.curr_section = $scope.entryType;
            console.log("$scope.entryType = ", $scope.entryType);


            //TODO get matches data again, here

            dataservice.curr_section = $scope.entryType;
            dataservice.getMatchesData(function() {

                $scope.masterMatches = dataservice.curr_processed_matches;
                $scope.recordEntries = dataservice.processed_record;

                if (newVal !== oldVal) {
                    if (newVal === "all") {
                        $scope.entryListFiltered = $scope.recordEntries;

                        dataservice.curr_section = "";
                    } else {
                        $scope.entryListFiltered = _.where($scope.recordEntries, {
                            category: newVal
                        });
                        dataservice.curr_section = newVal;
                    }
                    if (newVal === "vitals") {
                        $scope.$broadcast('tabchange', {
                            "val": 0
                        });
                    }
                }
            });



        });
    }

    //console.log(">>>>>>", record.masterRecord, record.recordDirty);


    $scope.goToMatches = function(section) {
        //console.log(section);
        //matches.setSection(section);
        $location.path('/matches');
    };
    //launch specific match (by ID and section name)
    $scope.launchMatch = function(el) {
        console.log("Launch MATCH>> ", el);
        //console.log(section);
        //setting section name for matches page
        matches.setSection(el.match.section);
        //TODO: set match ID for match page
        matches.setMatchId(el.match.match_id);

        $location.path('/matches');
    };
});
