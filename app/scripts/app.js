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
    'ngTouch'
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
      .when('/record/allergies', {
        templateUrl: 'views/record/allergies.html',
        controller: 'RecordAllergiesCtrl'
      })
      .when('/record/encounters', {
        templateUrl: 'views/record/encounters.html',
        controller: 'RecordEncountersCtrl'
      })
      .when('/record/immunizations', {
        templateUrl: 'views/record/immunizations.html',
        controller: 'RecordImmunizationsCtrl'
      })
      .when('/record/medications', {
        templateUrl: 'views/record/medications.html',
        controller: 'RecordMedicationsCtrl'
      })
      .when('/record/conditions', {
        templateUrl: 'views/record/conditions.html',
        controller: 'RecordConditionsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
