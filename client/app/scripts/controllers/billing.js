'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingCtrl
 * @description
 * # BillingCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('BillingCtrl', function($scope, $window, $location, format, matches, merges, history, dataservice) {
    console.log("BILLING CONTROLLER LOAD ");
    angular.element("#nav" + $scope.entryType).removeClass("active");
    if (!dataservice.curr_section_billing) {
        $scope.entryType = "all";
        dataservice.curr_section_billing = $scope.entryType;
    } else {
        $scope.entryType = dataservice.curr_section_billing;
    }
    angular.element("#nav" + $scope.entryType).addClass("active");


    console.log(Date.now(), " MAGIC OF DATASERVICE STARTS!");


    //TODO may need callback
    function refresh() {
        dataservice.curr_section_billing = $scope.entryType;
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
            case 'procedures':
                return 'procedure';
            case 'claims':
                return 'claim';
            case 'insurance':
                return 'insurance';
            case 'payers':
                return 'payer';
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


        if (_.isEmpty(dataservice.curr_section_billing)) {
            $scope.entryType = "all";
        } else {
            $scope.entryType = dataservice.curr_section_billing;
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
            dataservice.curr_section_billing = $scope.entryType;
            console.log("$scope.entryType = ", $scope.entryType);


            //TODO get matches data again, here

            dataservice.curr_section_billing = $scope.entryType;
            dataservice.getMatchesData(function() {

                $scope.masterMatches = dataservice.curr_processed_matches;
                $scope.recordEntries = dataservice.processed_record;

                if (newVal !== oldVal) {
                    if (newVal === "all") {
                        $scope.entryListFiltered = $scope.recordEntries;

                        dataservice.curr_section_billing = "";
                    } else {
                        $scope.entryListFiltered = _.where($scope.recordEntries, {
                            category: newVal
                        });
                        dataservice.curr_section_billing = newVal;
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


});
