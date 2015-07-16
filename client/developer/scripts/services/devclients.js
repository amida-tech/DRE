'use strict';

/**
 * @ngdoc service
 * @name phrDeveloperApp.devclient
 * @description
 * # devclient
 * Service in the phrDeveloperApp.
 */
angular.module('phrDeveloperApp')
    .service('devclient', function devclient($http) {

        this.getClients = function (callback) {
            $http.get('api/v1/developer/clients')
                .success(function (data) {
                    console.log("retrieval successful");
                    callback(data);
                }).error(function (data) {
                    callback('Error retrieving clients');
                });
        };
        this.addClient = function (new_client, callback) {
            $http.post('api/v1/developer/clients/add', new_client)
                .success(function (data) {
                    console.log("new client added successfully");
                    callback(data);
                }).error(function (data) {
                    callback('Error adding new client');
                });
        };
    });
