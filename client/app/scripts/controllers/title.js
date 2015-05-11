'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:TitleCtrl
 * @description
 * # TitleCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('TitleCtrl', Title);

Title.$inject = ['$rootScope', '$location', 'profile'];
    
function Title ($rootScope, $location, profile) {
    /* jshint validthis: true */
    var vm = this;
    vm.pageTitle = 'My PHR';
    
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

        vm.pageTitle = 'My PHR';
        var path = $location.path().substring(1);

        if (routeMap[path]) {
            vm.pageTitle = vm.pageTitle + ' | ' + routeMap[path];
        }

    });

}
