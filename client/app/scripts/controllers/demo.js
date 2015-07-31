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
    vm.demoThinking = false;
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
        vm.demoThinking = true;
        registration.signup(vm.info, function (err) {
            authentication.login(vm.info.username, vm.info.password, function (err) {
                reset();
                isAuth();
            });
        });
    }

    function reset() {
        vm.demoThinking = true;
        demo.resetDemo(function (err) {
            // console.log(err);
            $window.location.reload();
            vm.demoThinking = false;

            // registration.signup(vm.info, function (err) {
            //     authentication.login(vm.info.username, vm.info.password, function (err) {
            //         //$location.path('/demo');
            //         console.log('start uploading files');
            //         demo.uploadFile(filePath3, fileName3, fileType3, function (err, results) {
            //             console.log('file 3 uploaded');
            //             demo.uploadFile(filePath2, fileName2, fileType2, function (err, results) {
            //                 console.log('file 2 uploaded');
            //                 demo.uploadFile(filePath1, fileName1, fileType1, function (err, results) {
            //                     console.log('file 1 uploaded');
            //                     demo.clientCollection(function (err) {
            //                         console.log('uploading done, client collection done');
            //                         dataservice.forceRefresh();
            //                         //$location.path('/demo');
            //                     });
            //                 });
            //             });
            //         });
            //     });
            // });
        });

    }

}
