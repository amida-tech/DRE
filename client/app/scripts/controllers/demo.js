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

Demo.$inject = ['$location', '$window', 'dataservice', 'upload', 'demo'];

function Demo($location, $window, dataservice, upload, demo) {
    /* jshint validthis: true */
    var vm = this;
    vm.reset = reset;

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
    
    function reset() {
        demo.resetDemo(function(err, results) { 
            var file = "../../../../test/artifacts/demo-r1.5/bluebutton-01-original.xml";
            console.log(file);
            dataservice.forceRefresh();
            
            $location.path('/login');
            $window.location.reload();
            // upload.uploadRecord(file, true, function(err, results) {
            //     if (err) {
            //         throw (err);
            //     } else {
            //         console.log('demo instance file uploaded', results);
            //     }
            // });
        });
    }

}
