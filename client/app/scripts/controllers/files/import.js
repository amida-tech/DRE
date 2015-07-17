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
    vm.getWeight = getWeight;
    vm.oauthWithings = oauthWithings;
    vm.subscribeWeight = subscribeWeight;
    vm.unsubscribeWeight = unsubscribeWeight;
    vm.uploadStep = 0;

    activate();

    function activate() {
        if ($location.search().userid) {
            importService.getAccessToken($location.url(), function (err) {
                if (err) {
                    // throw error
                    return;
                }
                $location.url('/files/import');
            });
        }
        importService.isAuthorized(function (err, data) {
            if (err) {
                //throw error
                return;
            }
            vm.isAuthorized = data;
        });
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

    function getWeight() {
        importService.getDailyWeight(function (err) {
            if (err) {
                // throw error
                return;
            }
            returnToFiles();
        });
    }

    function subscribeWeight() {
        importService.subscribeWeightNotifications(function (err, data) {
            if (err) {
                // throw error
                return;
            }
            console.log(data);
            returnToFiles();
        });
    }

    function unsubscribeWeight() {
        importService.revokeWeightNotifications(function (err, data) {
            if (err) {
                // throw error
                return;
            }
            console.log(data);
            returnToFiles();
        });
    }

}
