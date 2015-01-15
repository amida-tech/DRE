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
                var tmpDates = '';
            var dispDates = '';
            
            if (!_.isUndefined(entry.date_time)) {
                if (!_.isUndefined(entry.date_time.point)) {
                    tmpDates = [entry.date_time.point];
                } else if (!_.isUndefined(entry.date_time.low) && !_.isUndefined(entry.date_time.high)) {
                    tmpDates = [entry.date_time.low, entry.date_time.high];
                } else if (!_.isUndefined(entry.date_time.low) && _.isUndefined(entry.date_time.high)) {
                    tmpDates = [entry.date_time.low];
                } else if (_.isUndefined(entry.date_time.low) && !_.isUndefined(entry.date_time.high)) {
                    tmpDates = [entry.date_time.high];
                }
            }
            if (tmpDates.length === 1) {
                dispDates = format.formatDate(tmpDates[0]);
                
            } else if (tmpDates.length === 2) {
                dispDates = format.formatDate(tmpDates[0]) + ' - ' + format.formatDate(tmpDates[1]);
                
            }
                if (!_.contains(['demographics','problems','plan_of_care','payers','social_history'],type)) {
                    $scope.recordEntries.push({
                        'data': entry,
                        'category': type,
                        'metadata': {
                            'comments': '',
                            'displayDate': dispDates,
                            'datetime': tmpDates
                        }
                    });
                }
                if (type === 'social_history') {
                    $scope.recordEntries.push({
                        'data': entry,
                        'category': 'social',
                        'metadata': {
                            'comments': '',
                            'displayDate': dispDates,
                            'datetime': tmpDates
                        }
                    });
                }
            });
        });
        $scope.recordEntries = _.sortBy($scope.recordEntries, function(entry) {
            return entry.metadata.datetime[0];
        });
        _.each($scope.recordEntries, function(entry){
            console.log(entry.metadata.datetime[0]);
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