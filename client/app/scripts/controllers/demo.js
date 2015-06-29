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
    vm.demoAuth = '';
    vm.reset = reset;
    vm.login = login;
    isAuth();

    vm.info = {
        'username': 'isabella',
        'password': 'testtest',
        'email': 'isabella@amida-demo.com',
        'firstName': 'Isabella',
        'middleName': 'Isa',
        'lastName': 'Jones',
        'dob': moment('1975-05-01').format('YYYY-MM-DD'),
        'gender': 'female'
    };

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

    function isAuth() {
        authentication.authStatus(function (err, auth) {
            vm.demoAuth = auth;
            console.log(vm.demoAuth);
        });
    }

    // if account already exists, login will work anyway.
    function login() {
        registration.signup(vm.info, function (err) {
            authentication.login(vm.info.username, vm.info.password, function (err) {
                $window.location.reload();
            });
        });
    }

    function reset() {
        var filePath1 = "test/artifacts/demo-r1.5/bluebutton-01-original.xml";
        var fileName1 = "bluebutton-01-original.xml";
        var fileType1 = "text/xml";
        var filePath2 = "test/artifacts/demo-r1.5/bluebutton-02-updated.xml";
        var fileName2 = "bluebutton-02-updated.xml";
        var fileType2 = "text/xml";
        var filePath3 = "test/artifacts/demo-r1.5/bluebutton-03-cms.txt";
        var fileName3 = "bluebutton-03-cms.txt";
        var fileType3 = "text/xml";

        demo.resetDemo(function (err) {
            registration.signup(vm.info, function (err) {
                authentication.login(vm.info.username, vm.info.password, function (err) {
                    $location.path('/demo');
                    console.log('start uploading files');
                    demo.uploadFile(filePath1, fileName1, fileType1, function (err, results) {
                        demo.uploadFile(filePath2, fileName2, fileType2, function (err, results) {
                            demo.uploadFile(filePath3, fileName3, fileType3, function (err, results) {
                                demo.clientCollection(function (err) {
                                    $window.location.reload();
                                });
                            });
                        });
                    });
                });
            });
        });

    }

}
