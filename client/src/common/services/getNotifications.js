angular.module('services.getNotifications', [])

.service('getNotifications', ['$http', '$filter', 'recordFunctions',
    function($http, $filter, recordFunctions) {

        function getUserName(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/record/demographics'
            }).success(function(data, status, headers, config) {
                var displayName = '';
                if (data.demographics.length > 0) {
                    displayName = recordFunctions.formatName(data.demographics[0].name).displayName;
                } else {
                    displayName = ' ';
                }
                callback(null, displayName);
            }).error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });
        }

        function getNewCount (callback) {
            $http({
                method: 'GET',
                url: '/api/v1/merges'
            }).
            success(function(data, status, headers, config) {
                var newCount = 0;
                for (var i in data.merges) {
                    if (data.merges[i].merge_reason === 'new') {
                        if(data.merges[i].entry_type !== 'demographic' && data.merges[i].entry_type !== 'social') {
                            var merge_date = data.merges[i].merged;
                            var dateDiff = new Date() - new Date(merge_date);
                            //86400000 <- 24 hrs in milliseconds.
                            if (dateDiff < 86400000) {
                                newCount++;
                            }
                        }
                    }
                }
                callback(null, newCount);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });

        }

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

                getUserName(function(err, userName) {
                    data.notifications.displayName = userName;
                    getNewCount(function(err, newCount) {
                        data.notifications.new_count = newCount;
                        callback(null, data.notifications);

                    });
                    
                });

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

    }
]);