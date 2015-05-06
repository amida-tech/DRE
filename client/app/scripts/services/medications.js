/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.medications
 * @description
 * # medications
 * Service in the phrPrototypeApp.
 */
 angular
 	.module('phrPrototypeApp')
 	.service('medications', medications);
 
 medications.$inject = ['$http'];
 
 function medications($http) {
	 /* jshint validthis: true */
	 this.addMedication = addMedication;
	 this.getMedication = getMedications;
	 
	 function addMedication(medication, callback) {
		 $http.post('/api/v1/medications/add', medication)
		 	.success(function(data) {
				 console.log("medication added successfully");
				 callback(null, data);
			 })
			 .error(function(err) {
				 console.log("adding the medication failed");
				 callback(err);
			 });
	 }
	 
	 function getMedications(callback) {
		 $http.get('/api/v1/medications/all')
		 	.success(function (data) {
				 callback(null, data);
			 })
			 .error(function (err) {
				 callback(err);
			 });
	 }
 }