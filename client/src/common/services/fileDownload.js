angular.module('services.fileDownload', [])

.service('fileDownload', ['$http', function ($http) {
    this.downloadFile = function(downloadUrl, callback) {
        $http.get(downloadUrl)
        .success(function(data) {
            callback(null, data);
        })
        .error(function(data) {
            callback(data);
        });
    };
}]);
