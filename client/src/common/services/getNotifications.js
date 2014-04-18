angular.module('services.getNotifications', [])

.service('getNotifications', ['$http',
    function($http) {

        this.getUpdate = function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/notification'
            }).
            success(function(data, status, headers, config) {

                var total_merges = data.notifications.new_merges + data.notifications.duplicate_merges;
                data.notifications.total_merges = total_merges;

                callback(null, data.notifications);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });

        };

    }
]);