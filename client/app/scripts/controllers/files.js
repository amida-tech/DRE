'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:FilesCtrl
 * @description
 * # FilesCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('FilesCtrl', Files);
    
Files.$inject = ['files'];
 
function Files (files) {
    /* jshint validthis: true */
    var vm = this;
    vm.fileList = [];
    vm.modifiedSort = modifiedSort;
    vm.nameSort = nameSort;
    vm.predicate = "file_name";
    vm.typeSort = typeSort;

    activate();
    
    function activate() {
        files.getFiles(function (err, results) {
            vm.fileList = results;
            console.log(results);
        });
    }
    
    function nameSort () {
        if (vm.predicate === "file_name") {
            vm.predicate = "-file_name";
        } else {
            vm.predicate = "file_name";
        }
    }

    function typeSort () {
        if (vm.predicate === "file_class") {
            vm.predicate = "-file_class";
        } else {
            vm.predicate = "file_class";
        }
    }

    function modifiedSort () {
        if (vm.predicate === "file_upload_date") {
            vm.predicate = "-file_upload_date";
        } else {
            vm.predicate = "file_upload_date";
        }
    }

 }
