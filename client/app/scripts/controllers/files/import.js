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
    vm.isAuthorized = false;
    vm.oauthWithings = oauthWithings;
    vm.returnToFiles = returnToFiles;
    vm.uploadStep = 0;

    activate();

    function activate() {
        if ($location.search().userid) {
            importService.getAccessToken($location.url(), function (err) {
                if (err) {
                    // throw error
                    return;
                }
                importService.isAuthorized = true;
                $location.url('/files/import');
            });
        }
        vm.isAuthorized = importService.isAuthorized;
    }

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
