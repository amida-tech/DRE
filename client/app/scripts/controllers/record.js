'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, $window, record, format, profile) {
    
    function showUserInfo() {
        profile.getProfile(function(err, profileInfo) {
            $scope.user_first = profileInfo.name.first;
            $scope.user_last = profileInfo.name.last;
            $scope.user_email = profileInfo.email[0].email;
            $scope.user_dob = profileInfo.dob;
        });
    }

    showUserInfo();

    function pageRender(data) {
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
        if (_.isEmpty(record.processedRecord)) {
            $scope.recordEntries = record.processRecord(data.data);
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
        record.getData().then(function(data) {
            record.setMasterRecord(data);
            pageRender(data);
        });
    } else {
        pageRender(record.masterRecord);
    }
});