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
    this.editMedication = editMedication;
    this.deleteMedication = deleteMedication;
    this.getMedication = getMedications;

    function addMedication(medication, callback) {
        $http.post('/api/v1/medications/add', {
                medication: medication
            })
            .success(function (data) {
                console.log("medication added successfully");
                dataservice.forceRefresh();
                callback(null, data);
            })
            .error(function (err) {
                console.log("adding the medication failed");
                callback(err);
            });
    }

    function editMedication(medication, callback) {
        $http.post('/api/v1/medications/edit', {
                medication: medication,
                id: medication._id
            })
            .success(function (data) {
                console.log("medication edited successfully");
                dataservice.forceRefresh();
                callback(null, data);
            })
            .error(function (err) {
                console.log("editing the medication failed");
                callback(err);
            });
    }

    function deleteMedication(medication, callback) {
        $http.post('/api/v1/medications/delete', {
                id: medication._id
            })
            .success(function (data) {
                console.log("medication deleted successfully");
                dataservice.forceRefresh();
                callback(null, data);
            })
            .error(function (err) {
                console.log("deleting the medication failed");
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
