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
    'mgcrea.ngStrap',
    'd3'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/reset', {
        templateUrl: 'views/reset.html',
        controller: 'ResetCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/files', {
        templateUrl: 'views/files.html',
        controller: 'FilesCtrl'
      })
      .when('/record', {
        templateUrl: 'views/record.html',
        controller: 'RecordCtrl'
      })
      .when('/billing/claims', {
        templateUrl: 'views/billing/claims.html',
        controller: 'BillingClaimsCtrl'
      })
      .when('/billing/insurance', {
        templateUrl: 'views/billing/insurance.html',
        controller: 'BillingInsuranceCtrl'
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
        controller: 'FilesUploadCtrl'
      })
      .when('/notes', {
        templateUrl: 'views/notes.html',
        controller: 'NotesCtrl'
      })
      .when('/newrecord', {
        templateUrl: 'views/newrecord.html',
        controller: 'NewRecordCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });


