'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingClaimsCtrl
 * @description
 * # BillingClaimsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('BillingCtrl', function($scope, $location, $anchorScroll, claims, insurance, format, billing, history) {
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


    billing.getData();

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
        if (_.isEmpty(matches.getSection())) {
            $scope.entryType = "all";
        } else {
            $scope.entryType = matches.getSection();
        }

        //Flip All as active selected item in DOM
        angular.element("#nav" + $scope.entryType).addClass("active");

        if (_.isEmpty(billing.processedRecord)) {
            $scope.recordEntries = billing.processRecord(data, data_notes, "billing.js controller");
        } else {
            $scope.recordEntries = billing.processedRecord;
        }
        $scope.recordEntries = _.sortBy($scope.recordEntries, function(entry) {
            if (entry.metadata.datetime[0]) {
                return entry.metadata.datetime[0].date.substring(0, 9);
            } else {
                return '1979-12-12';
            }
        }).reverse();
        $scope.entryListFiltered = $scope.recordEntries;
        $scope.$watch('entryType', function(newVal, oldVal) {
            //keeping current section name in scope
            $scope.entryType = newVal;
            console.log("$scope.entryType = ", $scope.entryType);
            getData();


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

    $scope.entryType = 'all';
    $scope.masterEntries = [];
    $scope.entries = [];
    $scope.updateDate = null;
    $scope.newComment = {
        'starred': false
    };

    function getUpdateDate() {
        //Should grab from files/update history.  Stubbed for now.
        $scope.updateDate = '12/1/2014';
    }
    $scope.setEntryType = function(type) {
        $scope.entryType = type;
        if (type === 'all') {
            $scope.entries = $scope.masterEntries;
        } else {
            $scope.entries = _.where($scope.masterEntries, {'category': type});
        }
    };

    function getData() {
        billing.getClaims().then(function(data) {
            _.each(data.claims, function(entry) {
                $scope.masterEntries.push({'data':entry, 'category':'claims'});
                
            });
        });
        billing.getInsurance().then(function(data) {
            _.each(data.payers, function(entry) {
                $scope.masterEntries.push({'data':entry, 'category':'insurance'});
                
            });
        });
        $scope.setEntryType('all');
    }
    getData();
    
});