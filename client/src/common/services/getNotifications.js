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

                if (data.notifications.total_merges > 0) {
                    data.notifications.displayNotifications = true;
                } else {
                    data.notifications.displayNotifications = false;
                }
                //console.log(data.notifications);
                callback(null, data.notifications);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });

        };

    }
]);