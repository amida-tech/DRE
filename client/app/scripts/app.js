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
                controllerAs: 'vm',
                requireLogin: false
            })
            .when('/print', {
                templateUrl: 'views/print.html',
                controller: 'PrintCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/print/:patient', {
                templateUrl: 'views/print.html',
                controller: 'PrintCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                requireLogin: false
            })
            .when('/oauth2', {
                templateUrl: 'views/oauth.html',
                controller: 'OAuthCtrl',
                controllerAs: 'vm',
                requireLogin: false
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/account', {
                templateUrl: 'views/account.html',
                controller: 'AccountCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/reset', {
                templateUrl: 'views/reset.html',
                controller: 'ResetCtrl',
                requireLogin: true
            })
            .when('/files', {
                templateUrl: 'views/files.html',
                controller: 'FilesCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/record', {
                templateUrl: 'views/record.html',
                controller: 'RecordCtrl',
                requireLogin: true
            })
            .when('/record/all', {
                templateUrl: 'views/record.html',
                controller: 'RecordCtrl',
                requireLogin: true
            })
            .when('/record/medications', {
                templateUrl: 'views/record.html',
                controller: 'SectionMedicationCtrl',
                requireLogin: true
            })
            .when('/record/results', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/encounters', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/vitals', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/immunizations', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/allergies', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/conditions', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/procedures', {
                templateUrl: 'views/record.html',
                controller: 'SectionOtherCtrl',
                requireLogin: true
            })
            .when('/record/social', {
                templateUrl: 'views/record.html',
                controller: 'SectionSocialCtrl',
                requireLogin: true
            })
            .when('/billing', {
                templateUrl: 'views/billing.html',
                controller: 'BillingCtrl',
                requireLogin: true
            })
            .when('/billing/insurance', {
                templateUrl: 'views/billing.html',
                controller: 'BillingCtrl',
                requireLogin: true
            })
            .when('/billing/claims', {
                templateUrl: 'views/billing.html',
                controller: 'BillingCtrl',
                requireLogin: true
            })
            .when('/review', {
                templateUrl: 'views/review.html',
                controller: 'ReviewCtrl',
                requireLogin: true
            })
            .when('/record/download', {
                templateUrl: 'views/record/download.html',
                controller: 'RecordDownloadCtrl',
                requireLogin: true
            })
            .when('/files/upload', {
                templateUrl: 'views/files/upload.html',
                controller: 'FilesUploadCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .when('/notes', {
                templateUrl: 'views/notes.html',
                controller: 'NotesCtrl',
                requireLogin: true
            })
            .when('/matches', {
                templateUrl: 'views/matches.html',
                controller: 'MatchesCtrl',
                controllerAs: 'vm',
                requireLogin: true
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function ($rootScope, $location, authentication, profile) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            authentication.authStatus(function (err, auth) {
                if (err) {
                    console.log("routeChangeStart auth error: ", err);
                }
                $rootScope.isAuthorized = auth;
                $rootScope.$broadcast("authAvailable", auth);
                if (auth) {
                    profile.getProfile(function (err2, profile_info) {
                        if (err2) {
                            console.log("profile err: ", err2);
                        } else {
                            $rootScope.profile_info = profile_info;
                            $rootScope.$broadcast("profileAvailable", profile_info);
                        }
                    });
                }
                if (next.requireLogin) {
                    if (!auth) {
                        event.preventDefault();
                        $location.path("/login");
                    }
                }
            });
        });
    });
