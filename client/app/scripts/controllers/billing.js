'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingClaimsCtrl
 * @description
 * # BillingClaimsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('BillingCtrl', function($scope, $location, $anchorScroll,  format, billing, history, matches, merges) {
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
    //Loading Merges (only used in record history, don't need in billing)
    merges.getMerges(function(err, data) {
        if (err) {
            console.log("error whil getting merges ", err);
        } else {
            $scope.mergesList = data;
            //console.log("merges data ", $scope.mergesList);
        }
    });

    function pageRender(data, data_notes) {
        console.log("billing page render", data, data_notes);

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
        if (_.isEmpty(matches.getSection())) {
            $scope.entryType = "all";
        } else {
            $scope.entryType = matches.getSection();
        }
        //Flip All as active selected item in DOM
        angular.element("#nav" + $scope.entryType).addClass("active");

        if (_.isEmpty(billing.processedRecord)) {
            console.log("processed record is empty >>>>>", data, data_notes);
            $scope.recordEntries = billing.processRecord(data, data_notes, "billing.js controller");
        } else {
            console.log("processed record is NOT empty >>>>>");
            $scope.recordEntries = billing.processedRecord;
        }
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
            $scope.entryType = newVal;
            console.log("$scope.entryType = ", $scope.entryType);
            //getData(function(err, data) {});


            if (newVal !== oldVal) {
                if (newVal === "all") {
                    $scope.entryListFiltered = $scope.recordEntries;
                    matches.setSection("");
                } else {
                    $scope.entryListFiltered = _.where($scope.recordEntries, {
                        category: newVal
                    });
                    matches.setSection(newVal);
                }
                if (newVal === "vitals") {
                    $scope.$broadcast('tabchange', {
                        "val": 0
                    });
                }
            }
        });



    }

    console.log(">>>>>>", billing.masterRecord, billing.recordDirty);

    if (_.isEmpty(billing.masterRecord) || billing.recordDirty) {
        billing.getData(function(err, data) {
            //getNotes and associate them with record
            billing.setNotes(data.notes);
            billing.setMasterRecord(data.records);
            pageRender(data.records, data.notes);
        });
    } else {
        pageRender(billing.masterRecord, billing.all_notes);
    }

    /*
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
    */

    function getUpdateDate() {
        //Should grab from files/update history.  Stubbed for now.
        $scope.updateDate = '12/1/2014';
    }
    $scope.setEntryType = function(type) {
        $scope.entryType = type;
        if (type === 'all') {
            $scope.entries = $scope.masterEntries;
        } else {
            $scope.entries = _.where($scope.masterEntries, {
                'category': type
            });
        }
    };

    $scope.setEntryType('all');

/*
    function getData() {
        billing.getData(function(err, data) {

            $scope.masterEntries = data.records;
            //$scope.setEntryType('all');


        });
    }
    //getData(function(err, data) {});
*/
});
