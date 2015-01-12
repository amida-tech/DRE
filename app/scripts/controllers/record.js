'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, $window, record, format) {
    record.getData().then(function(data) {
        $scope.entries = data;
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
        $scope.entryType = "all";

        $scope.recordEntries = [];


        _.each($scope.entries.data, function(entries, type) {
            _.each(entries, function(entry) {
                if (type !== 'demographics') {
                    $scope.recordEntries.push(
                        {
                            'data': entry,
                            'metadata': {
                                'category': type,
                                'datetime': entry.date_time
                            }
                        }
                    );
                }
            });
        });

       
        
        $scope.$watch('entryType', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                if (newVal === "all") {
                    $scope.entryListFiltered = $scope.entryList;
                } else {
                    $scope.entryListFiltered = _.where($scope.entryList, {
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
    });
});