'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, record, format) {
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
    $scope.tabs.activeTab = 1;

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
                            value: vitalEntry.value,
                            unit: vitalEntry.unit
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
            _.each(entry.date_time, function(dateEntry) {
                format.formatDate(dateEntry);
            });
            if (!entry.date_time) { //start it.
                var dateArray = [];
                entry.date_time = {};
                _.each(entry.results, function(result) {
                    _.each(result.date_time, function(dateEntry) {
                        format.formatDate(dateEntry);
                        dateArray.push(moment(dateEntry.date));
                    });
                    result.date_time.displayDate = format.outputDate(result.date_time);
                });
                //Construct low-high based on range.
                var momentMin = moment.min(dateArray);
                var momentMax = moment.max(dateArray);
                if (momentMin.isSame(momentMax, 'day')) {
                    entry.date_time.point = {};
                    entry.date_time.point.date = momentMin.toISOString();
                    entry.date_time.point.precision = 'day';
                }
                _.each(entry.date_time, function(dateTime) {
                    dateTime.displayDate = format.formatDate(dateTime);
                });
            } //end it.
            entry.date_time.displayDate = format.outputDate(entry.date_time);
            entry.date_time.plotDate = format.plotDate(entry.date_time);
        });
    }

    function sortList() {
        $scope.entryList = _.sortBy($scope.entryList, function(entry) {
            return entry.date_time.plotDate;
        });
        $scope.entryList.reverse();
    }
    dashPrep();
    formatDates();
    sortList();
});