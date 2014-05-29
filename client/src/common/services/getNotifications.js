angular.module('services.getNotifications', [])

.service('getNotifications', ['$http', 'recordFunctions',
    function($http, recordFunctions) {

        var returnData = {};
        returnData.data = {};

        this.getUpdate = function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/notification'
            }).
            success(function(data, status, headers, config) {

                var total_merges = data.notifications.new_merges + data.notifications.duplicate_merges;
                data.notifications.total_merges = total_merges;

                returnData.data = data;

                if (data.notifications.total_merges > 0) {
                    data.notifications.displayNotifications = true;
                } else {
                    data.notifications.displayNotifications = false;
                }

                //Added get demographics for name.
                $http({
                    method: 'GET',
                    url: '/api/v1/record/demographics'
                }).success(function(data, status, headers, config) {
                    if (data.demographics.length > 0) {
                        returnData.data.notifications.displayName = recordFunctions.formatName(data.demographics[0].name).displayName;    
                    } else {
                        returnData.data.notifications.displayName = ' ';
                    }
                    callback(null, returnData.data.notifications);
                }).error(function(data, status, headers, config) {
                    console.log(data);
                });                
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

    }
]);