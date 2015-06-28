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
        var info = {
            'username': 'amida-demo',
            'password': 'testtest',
            'email': 'isabella@amida-demo.com',
            'firstName': 'Isabella',
            'middleName': 'Isa',
            'lastName': 'Jones',
            'dob': moment('1975-05-01').format('YYYY-MM-DD'),
            'gender': 'female'
        };
        var filePath1 = "test/artifacts/demo-r1.5/bluebutton-01-original.xml";
        var fileName1 = "bluebutton-01-original.xml";
        var fileType1 = "text/xml";
        var filePath2 = "test/artifacts/demo-r1.5/bluebutton-02-updated.xml";
        var fileName2 = "bluebutton-02-updated.xml";
        var fileType2 = "text/xml";
        var filePath3 = "test/artifacts/demo-r1.5/bluebutton-03-cms.txt";
        var fileName3 = "bluebutton-03-cms.txt";
        var fileType3 = "text/xml";

        demo.resetDemo(function (err, results) {
            registration.signup(info, function (err) {

                authentication.login(info.username, info.password, function (err) {
                    $location.path('/demo');
                    console.log('start uploading files');
                    demo.uploadFile(filePath1, fileName1, fileType1, function (err, results) {
                    });

                    demo.uploadFile(filePath2, fileName2, fileType2, function (err, results) {
                    });

                    demo.uploadFile(filePath3, fileName3, fileType3, function (err, results) {
                        if (err) {
                            // console.log(err);
                        } else {
                            $window.location.reload();
                        }
                    });
                });
            });
        });

    }

}
