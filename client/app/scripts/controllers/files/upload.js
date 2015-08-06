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
    .controller('FilesUploadCtrl', FilesUpload);

FilesUpload.$inject = ['$location', '$route', 'upload', '$http', 'format', 'record', 'dataservice'];

function FilesUpload($location, $route, upload, $http, format, record, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    vm.importAndSave = importAndSave;
    vm.incrementStep = incrementStep;
    vm.myFile = null;
    vm.new_dob = "";
    vm.new_first = "";
    vm.new_gender = "";
    vm.new_last = "";
    vm.new_middle = "";
    vm.returnToFiles = returnToFiles;
    vm.uploadStep = 0;

    function incrementStep() {
        vm.uploadStep = vm.uploadStep + 1;

        var uploadFile;

        if (vm.uploadStep === 1) {

            uploadFile = vm.myFile;
            console.log("extracting demographics", uploadFile);

            upload.uploadRecord(uploadFile, true, function (err, results) {
                console.log("file check ", results);

                if (results.refresh) {
                    $location.path('/files');
                } else {
                    if (results.name) {
                        vm.new_first = results.name.first;
                        vm.new_last = results.name.last;
                        if (results.name.middle && results.name.middle[0]) {
                            vm.new_middle = results.name.middle[0];
                        }
                        vm.new_dob = format.formatDate(results.dob.point);
                        vm.new_gender = results.gender;
                    }
                }
            });

        } else if (vm.uploadStep === 2) {
            uploadFile = vm.myFile;
            console.log("uploading file", uploadFile);

            upload.uploadRecord(uploadFile, false, function (err, results) {
                vm.uploadStep = 0;
                $location.path('/files');
                //$route.reload();
            });
        }
    }

    function returnToFiles() {
        $location.path('/files');
    }

    function importAndSave() {
        var uploadFile = vm.myFile;
        console.log("uploading file", uploadFile);
        upload.uploadRecord(uploadFile, false, function (err, results) {
            vm.uploadStep = 0;
            dataservice.forceRefresh();
            $location.path('/files');
        });

    }

}
