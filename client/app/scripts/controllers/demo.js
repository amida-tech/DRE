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

Demo.$inject = ['$location', '$window', 'dataservice', 'upload', 'demo', 'registration', 'authentication'];

function Demo($location, $window, dataservice, upload, demo, registration, authentication) {
    /* jshint validthis: true */
    var vm = this;
    vm.reset = reset;
    vm.uploadFile = null;

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
        // demo.resetDemo(function (err, results) {
        var filePath = "test/artifacts/demo-r1.5/bluebutton-01-original.xml";
        //     console.log(vm.uploadFile);
        //     dataservice.forceRefresh();

        //     // $location.path('/login');
        //     // $window.location.reload();
        demo.uploadFile(filePath, function (err, results) {
            if (err) {
                // console.log(err);
            } else {
                console.log('demo instance file uploaded', results);
            }
        });
        // });

        // var info = {
        //     'username': 'amida-demo',
        //     'password': 'testtest',
        //     'email': 'isabella@amida-demo.com',
        //     'firstName': 'Isabella',
        //     'middleName': 'Isa',
        //     'lastName': 'Jones',
        //     'dob': moment('1975-05-01').format('YYYY-MM-DD'),
        //     'gender': 'female'
        // };

        // console.log("starting registration", info.dob);

        // registration.signup(info, function (err) {
        //     // console.log("done");
        //     // $location.path('/home');
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         authentication.login(info.username, info.password, function (err) {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 $location.path('/demo');
        //             }
        //         });
        //     }
        // });

    }

}
