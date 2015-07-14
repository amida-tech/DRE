'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesUploadCtrl
 * @description
 * # FilesUploadCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('FilesImportCtrl', FilesImport);

FilesImport.$inject = ['$location', '$window', 'importService', '$http', 'format', 'record', 'dataservice'];

function FilesImport($location, $window, importService, $http, format, record, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    vm.returnToFiles = returnToFiles;
    vm.uploadStep = 0;

    function returnToFiles() {
        $location.path('/files');
    }

    function oauthWithings() {
        importService.getRequestToken(function (err, authUrl) {
            if (err) {
                // throw error
                return;
            }
            $window.location.href = authUrl;
        });
    }

}
