'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, $window, record, format) {
    record.getRecord(function(err, results) {
        $scope.entries = results;
    });

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
    

    function dashPrep() {
        var weightDateArray = [];
        var heightDateArray = [];
        var bpDateArraySystolic = [];
        var bpDateArrayDiastolic = [];
        //Build arrays of all dates per section.
        _.each($scope.entries.vitals, function(vitalEntry) {
            if (vitalEntry.data.vital.name === "Height") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    heightDateArray.push(moment(dateArr.date));
                });
            }
            if (vitalEntry.data.vital.name === "Patient Body Weight - Measured") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    weightDateArray.push(moment(dateArr.date));
                });
            }
            if (vitalEntry.data.vital.name === "Intravascular Systolic") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    bpDateArraySystolic.push(moment(dateArr.date));
                });
            }
            if (vitalEntry.data.vital.name === "Intravascular Diastolic") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    bpDateArrayDiastolic.push(moment(dateArr.date));
                });
            }
        });
        //Flag maxes.
        var heightMaxDate = moment.max(heightDateArray);
        var weightMaxDate = moment.max(weightDateArray);
        var bpMaxDateDiastolic = moment.max(bpDateArrayDiastolic);
        var bpMaxDateSystolic = moment.max(bpDateArraySystolic);
        //Recover associated max value.
        _.each($scope.entries.vitals, function(vitalEntry) {
            //Find most current height.
            if (vitalEntry.data.vital.name === "Height") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    if (moment(moment(dateArr.date)).isSame(heightMaxDate, 'day')) {
                        $scope.dashMetrics.height = {
                            value: vitalEntry.data.value,
                            unit: vitalEntry.data.unit
                        };
                    }
                });
            }
            if (vitalEntry.data.vital.name === "Patient Body Weight - Measured") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    if (moment(moment(dateArr.date)).isSame(weightMaxDate, 'day')) {
                        $scope.dashMetrics.weight = {
                            value: vitalEntry.data.value,
                            unit: vitalEntry.data.unit
                        };
                    }
                });
            }
            if (vitalEntry.data.vital.name === "Intravascular Systolic") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    if (moment(moment(dateArr.date)).isSame(bpMaxDateSystolic, 'day')) {
                        $scope.dashMetrics.systolic = {
                            value: vitalEntry.data.value,
                            unit: vitalEntry.data.unit
                        };
                    }
                });
            }
            if (vitalEntry.data.vital.name === "Intravascular Diastolic") {
                _.each(vitalEntry.data.date_time, function(dateArr) {
                    if (moment(moment(dateArr.date)).isSame(bpMaxDateDiastolic, 'day')) {
                        $scope.dashMetrics.diastolic = {
                            value: vitalEntry.data.value,
                            unit: vitalEntry.data.unit
                        };
                    }
                });
            }
        });
        //Format weight output.
        if ($scope.dashMetrics.height.unit === "[in_i]") {
            var displayHeight = Math.floor(($scope.dashMetrics.height.value / 12)) + "' " + $scope.dashMetrics.height.value % 12 + '"';
            $scope.dashMetrics.height.disp = displayHeight;
        }
        //Format height output.
        if ($scope.dashMetrics.weight.unit === "[lb_av]") {
            var displayWeight = $scope.dashMetrics.weight.value + " lbs";
            $scope.dashMetrics.weight.disp = displayWeight;
        }
        //BMI Calculation
        //Expects US units.
        function calculateBMI(weight, height) {
            var BMI = (weight * 703) / (height * height);
            BMI = BMI.toFixed(1);
            return BMI;
        }
        $scope.dashMetrics.bmi = calculateBMI($scope.dashMetrics.weight.value, $scope.dashMetrics.height.value);
    }
    $scope.entryList = [];

    function formatDates() {
        //Flatten to timeline.
        _.each($scope.entries, function(entry, section) {
            _.each(entry, function(item) {
                var tmpItem = item;
                tmpItem.category = section;
                $scope.entryList.push(tmpItem);
            });
        });

        _.each($scope.entryList, function(entry) {
            _.each(entry.data.date_time, function(dateEntry) {
                format.formatDate(dateEntry);
            });

            //Have to generate date for results.
            if (entry.category === 'results') {
                var dateArray = [];
                entry.data.date_time = {};

                //Fill out each result's individual date.
                if (entry.data.results) {
                    _.each(entry.data.results, function(result) {
                        _.each(result.date_time, function(dateEntry) {
                            format.formatDate(dateEntry);
                            dateArray.push(moment(dateEntry.date));
                        });
                        result.date_time.displayDate = format.outputDate(result.date_time);
                    });
                }

                var momentMin = moment.min(dateArray);
                var momentMax = moment.max(dateArray);

                //If date min and max are equal, consolidate.
                //Only have test data, should expand to other cases in deploy.
                if (momentMin.isSame(momentMax, 'day')) {
                    entry.data.date_time.point = {};
                    entry.data.date_time.point.date = momentMin.toISOString();
                    entry.data.date_time.point.precision = 'day';
                    entry.data.date_time.point.displayDate = format.formatDate(entry.data.date_time.point);
                }

            }

            entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
            entry.data.date_time.plotDate = format.plotDate(entry.data.date_time);
        });
    }

    function sortList() {
        $scope.entryList = _.sortBy($scope.entryList, function(entry) {
            return entry.data.date_time.plotDate;
        });
        $scope.entryList.reverse();
    }
    dashPrep();
    formatDates();
    sortList();
});