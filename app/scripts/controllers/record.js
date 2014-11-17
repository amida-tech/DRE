'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordCtrl', function ($scope, record) {
    
  	record.getRecord(function(err, results) {
  		$scope.masterRecord = results;
  	});


  	$scope.dashMetrics = {};

  	function dashPrep () {

  		var weightDateArray = [];
  		var heightDateArray = [];
  		var bpDateArraySystolic = [];
  		var bpDateArrayDiastolic = [];

  		//Build arrays of all dates per section.
  		_.each($scope.masterRecord.vitals, function(vitalEntry) {

  			if (vitalEntry.vital.name === "Height") {
  				_.each(vitalEntry.date_time, function(dateArr) {
  					heightDateArray.push(moment(dateArr.date));
  				});
  			}

  			if (vitalEntry.vital.name === "Patient Body Weight - Measured") {
  				_.each(vitalEntry.date_time, function(dateArr) {
  					weightDateArray.push(moment(dateArr.date));
  				});
  			}

			if (vitalEntry.vital.name === "Intravascular Systolic") {
  				_.each(vitalEntry.date_time, function(dateArr) {
  					bpDateArraySystolic.push(moment(dateArr.date));
  				});
  			}

  			if (vitalEntry.vital.name === "Intravascular Diastolic") {
  				_.each(vitalEntry.date_time, function(dateArr) {
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
  		_.each($scope.masterRecord.vitals, function(vitalEntry) {

  			//Find most current height.
  			if (vitalEntry.vital.name === "Height") {
  				_.each(vitalEntry.date_time, function(dateArr) {

  					if (moment(moment(dateArr.date)).isSame(heightMaxDate, 'day')) {
  						$scope.dashMetrics.height = {
  							value: vitalEntry.value,
  							unit: vitalEntry.unit
  						};
  					}

  				});
  			}

  			if (vitalEntry.vital.name === "Patient Body Weight - Measured") {
  				_.each(vitalEntry.date_time, function(dateArr) {
  					if (moment(moment(dateArr.date)).isSame(weightMaxDate, 'day')) {
  						$scope.dashMetrics.weight = {
  							value: vitalEntry.value,
  							unit: vitalEntry.unit
  						};
  					}

  				});
  			}

  			if (vitalEntry.vital.name === "Intravascular Systolic") {
  				_.each(vitalEntry.date_time, function(dateArr) {
  					if (moment(moment(dateArr.date)).isSame(bpMaxDateSystolic, 'day')) {
  						$scope.dashMetrics.systolic = {
  							value: vitalEntry.value,
  							unit: vitalEntry.unit
  						};
  					}

  				});
  			}

  			if (vitalEntry.vital.name === "Intravascular Diastolic") {
  				_.each(vitalEntry.date_time, function(dateArr) {
  					if (moment(moment(dateArr.date)).isSame(bpMaxDateDiastolic, 'day')) {
  						$scope.dashMetrics.diastolic = {
  							value: vitalEntry.value,
  							unit: vitalEntry.unit
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
  		function calculateBMI (weight, height) {
  			var BMI = (weight * 703) / (height * height);
  			BMI = BMI.toFixed(1);
  			return BMI;
  		}

  		$scope.dashMetrics.bmi = calculateBMI($scope.dashMetrics.weight.value, $scope.dashMetrics.height.value);
  	}


  	dashPrep();

  });
