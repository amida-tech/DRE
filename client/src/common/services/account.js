angular.module('services.account', [])

.service('account', ['$http', '$filter',
    function($http, $filter) {

        this.isAuthenticated= function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/account'
            }).success(function(data, status, headers, config) {
                callback(null, data.authenticated);
            }).error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });
        };

        this.getProfile = function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/account'
            }).
            success(function(data, status, headers, config) {
                //TODO: return account info
                callback(null, newCount);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });

        };
    }
]);