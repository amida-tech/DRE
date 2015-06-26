'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('DemoCtrl', Demo);

Demo.$inject = ['$location', 'dataservice'];

function Demo($location, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    vm.showFiles = false;
    vm.fileView = fileView;

    function fileView() {
        // console.log(vm.showFiles);
        if (!vm.showFiles) {
            vm.showFiles = true;
        } else {
            vm.showFiles = false;
        }
    }

    vm.demoClick = function demoClick(new_location) {
        dataservice.getLastSection(function (last_section) {
            if (new_location === 'medications') {
                dataservice.setLastSection('record', '/' + new_location);
                $location.path('record/' + new_location);
            } else {
                dataservice.forceRefresh();
                $location.path('/' + new_location);
            }

        });
    };

}
