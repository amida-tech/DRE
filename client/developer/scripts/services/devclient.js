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
            $http.get('api/v1/developer/clients/all')
                .success(function (data) {
                    console.log("retrieval successful");
                    callback(data);
                }).error(function (data) {
                    callback('Error retrieving clients', data);
                });
        };
        this.saveClient = function (new_client, callback) {
            $http.post('api/v1/developer/clients/add', new_client)
                .success(function (data) {
                    console.log("new client added successfully");
                    callback(data);
                }).error(function (data) {
                    callback('Error adding new client');
                });
        };
        this.deleteClient = function (client_name, callback) {
            var info = {
                client_name: client_name
            };
            $http.post('api/v1/developer/clients/delete', info)
                .success(function (data) {
                    console.log(client_name, " deleted successfully");
                    callback(data);
                }).error(function (data) {
                    callback('Error deleting ', client_name);
                });
        };
    });
