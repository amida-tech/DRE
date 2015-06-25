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

Demo.$inject = ['$location'];

function Demo($location) {
    /* jshint validthis: true */
    var vm = this;
    vm.showFiles = false;
    vm.fileView = fileView;

    function fileView() {
        console.log(vm.showFiles);
        if (!vm.showFiles) {
            vm.showFiles = true;
        } else {
            vm.showFiles = false;
        }
    }

}
