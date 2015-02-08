'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, $window, record, format, matches) {
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
        $scope.entryType = "all";

        if (_.isEmpty(record.processedRecord)) {
            $scope.recordEntries = record.processRecord(data, data_notes, "record.js controller");
        } else {
            $scope.recordEntries = record.processedRecord;
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
            if (newVal !== oldVal) {
                if (newVal === "all") {
                    $scope.entryListFiltered = $scope.recordEntries;
                } else {
                    $scope.entryListFiltered = _.where($scope.recordEntries, {
                        category: newVal
                    });
                }
                if (newVal === "vitals") {
                    $scope.$broadcast('tabchange', {
                        "val": 0
                    });
                }
            }
        });
        


    }
    if (_.isEmpty(record.masterRecord) || record.recordDirty) {
        record.getData(function(err, data) {
            //getNotes and associate them with record

            record.setNotes(data.notes);
            record.setMasterRecord(data.records);

            pageRender(data.records, data.notes);
        });
    } else {
        pageRender(record.masterRecord, record.all_notes);
    }
    $scope.masterMatches = {};

    // Get Matches data for partial matches 
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