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
                var tmpDisplayDate = '';
                var tmpPlotDate = '';
                if (!_.contains(['demographics','problems','plan_of_care','payers','social_history'],type)) {
                    $scope.recordEntries.push({
                        'data': entry,
                        'category': type
                    });
                }
                if (type === 'social_history') {
                    $scope.recordEntries.push({
                        'data': entry,
                        'category': 'social'
                    });
                }
            });
        });
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
    });
});