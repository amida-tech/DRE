'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.demo
 * @description
 * # demo
 * Service in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .service('demo', demo);
demo.$inject = ['$http'];

function demo($http) {

        this.resetDemo = function (callback) {
            $http.get('/api/v1/demo')
                .success(function (data) {
                    // dataservice.forceRefresh();
                    callback(null, data);
                })
                .error(function (err) {
                    console.log(err);
                    callback(err);
                });
        };

        
};
