'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:PagetitleCtrl
 * @description
 * # PagetitleCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
    .controller('titleController', function ($rootScope, $scope, $location, profile) {

        // profile.getProfile(function(err, profileInfo) {
        //     if (profileInfo.name.first) {
        //     $scope.user_first = profileInfo.name.first;
        //     $scope.user_last = profileInfo.name.last;
        //     }
        // });

        $scope.pageTitle = 'My PHR';
        var routeMap = {
            'home': 'Home',
            'record': 'My Record',
            'notes': 'My Notes',
            'files': 'My Files',
            'profile': 'My Profile',
            'account': 'My Account',
            'billing/insurance': 'My Insurance',
            'billing/claims': 'My Claims',
            'record/medications': 'My Medications',
            'record/results': 'My Results',
            'record/encounters': 'My Encounters',
            'record/vitals': 'My Vital Signs',
            'record/immunizations': 'My Immunizations',
            'record/allergies': 'My Allergies',
            'record/conditions': 'My Conditions',
            'record/procedures': 'My Procedures',
            'record/social': 'My Social History',
            'register': 'Registration',
            'login': 'Login',
            'files/upload': 'Upload',
            'record/medications/review': 'My Medications',
            'record/results/review': 'My Results',
            'record/encounters/review': 'My Encounters',
            'record/vitals/review': 'My Vital Signs',
            'record/immunizations/review': 'My Immunizations',
            'record/allergies/review': 'My Allergies',
            'record/conditions/review': 'My Conditions',
            'record/procedures/review': 'My Procedures',
            'record/social/review': 'My Social History',
        };

        $rootScope.$on("$routeChangeSuccess", function (event) {

            $scope.pageTitle = 'My PHR';
            var path = $location.path().substring(1);

            if (routeMap[path]) {
                $scope.pageTitle = $scope.pageTitle + ' | ' + routeMap[path];
            }

        });

    });
