/// <reference path="../../../typings/jquery/jquery.d.ts"/>
/// <reference path="/../../../typings/angularjs/angular.d.ts"/>
'use strict';

/**
 * @ngdoc overview
 * @name phrPrototypeApp
 * @description
 * # phrPrototypeApp
 *
 * Main module of the application.
 */
angular
    .module('phrPrototypeApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'd3'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'vm'
            })
            .when('/print', {
                templateUrl: 'views/print.html',
                controller: 'PrintCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'vm'
            })
            .when('/account', {
                templateUrl: 'views/account.html',
                controller: 'AccountCtrl',
                controllerAs: 'vm'
            })
            .when('/reset', {
                templateUrl: 'views/reset.html',
                controller: 'ResetCtrl'
            })
            .when('/files', {
                templateUrl: 'views/files.html',
                controller: 'FilesCtrl',
                controllerAs: 'vm'
            })
            .when('/record', {
                templateUrl: 'views/record.html',
                controller: 'RecordCtrl'
            })
            .when('/record/all', {
                templateUrl: 'views/record.html',
                controller: 'RecordCtrl'
            })
            .when('/record/medications', {
                templateUrl: 'views/record.html',
                controller: 'SectionMedicationCtrl'
            })
            .when('/record/results', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/encounters', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/vitals', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/immunizations', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/allergies', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/conditions', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/procedures', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl'
            })
            .when('/record/social', {
                templateUrl: 'views/record.html',
                controller: 'SectionSocialCtrl'
            })
            .when('/billing', {
                templateUrl: 'views/billing.html',
                controller: 'BillingCtrl'
            })
            .when('/review', {
                templateUrl: 'views/review.html',
                controller: 'ReviewCtrl'
            })
            .when('/record/download', {
                templateUrl: 'views/record/download.html',
                controller: 'RecordDownloadCtrl'
            })
            .when('/files/upload', {
                templateUrl: 'views/files/upload.html',
                controller: 'FilesUploadCtrl',
                controllerAs: 'vm'
            })
            .when('/notes', {
                templateUrl: 'views/notes.html',
                controller: 'NotesCtrl'
            })
            .when('/matches', {
                templateUrl: 'views/matches.html',
                controller: 'MatchesCtrl',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function ($rootScope, $location, authentication) {

        var routesThatDontRequireAuth = ['/login', '/', '/register'];

        // if current location matches route
        var routeClean = function (route) {
            return _.find(routesThatDontRequireAuth,
                function (noAuthRoute) {
                    return _.str.startsWith(route, noAuthRoute);
                });
        };

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // if route requires auth and user is not logged in
            authentication.authStatus(function (err, res) {
                var url = $location.url();
                //console.log('res', res);
                if (!res) {
                    //console.log('url', url, (url ==='/login')||(url==='/')||(url==='/register'));
                    if ((url === '/login') || (url === '/') || (url === '/register')) {
                        // console.log('working?');
                        $location.path(url);
                    } else {
                        $location.path('/login');
                    }
                } else {
                    $location.path(url);
                    // console.log('no login required?');
                }

            });
        });
    });
