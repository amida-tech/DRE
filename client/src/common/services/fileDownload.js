// angular.module('services.fileDownload', [])

// .service('fileDownload', ['$http', function ($http) {
//     this.downloadFile = function(file, uploadUrl, callback){
//         // var fd = new FormData();
//         // fd.append('file', file);
//         $http.put(uploadUrl, fd, {
//             transformRequest: angular.identity,
//             headers: {'Content-Type': undefined}
//         })
//         .success(function(data){
//             callback(null, data);
//         })
//         .error(function(data){
//             callback(data);
//         });
//     };
// }]);
