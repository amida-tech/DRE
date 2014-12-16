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
      .when('/billing/claims', {
        templateUrl: 'views/billing/claims.html',
        controller: 'BillingClaimsCtrl'
      })
      .when('/billing/insurance', {
        templateUrl: 'views/billing/insurance.html',
        controller: 'BillingInsuranceCtrl'
      })
      .when('/record/medications', {
        templateUrl: 'views/record/medications.html',
        controller: 'RecordMedicationsCtrl'
      })
      .when('/record/conditions', {
        templateUrl: 'views/record/conditions.html',
        controller: 'RecordConditionsCtrl'
      })
      .when('/record/procedures', {
        templateUrl: 'views/record/procedures.html',
        controller: 'RecordProceduresCtrl'
      })
      .when('/record/vitals', {
        templateUrl: 'views/record/vitals.html',
        controller: 'RecordVitalsCtrl'
      })
      .when('/record/results', {
        templateUrl: 'views/record/results.html',
        controller: 'RecordResultsCtrl'
      })
      .when('/record/social', {
        templateUrl: 'views/record/social.html',
        controller: 'RecordSocialCtrl'
      })
      .when('/review', {
        templateUrl: 'views/review.html',
        controller: 'ReviewCtrl'
      })
      .when('/review/allergies', {
        templateUrl: 'views/review/allergies.html',
        controller: 'ReviewAllergiesCtrl'
      })
      .when('/record/allergies/review', {
        templateUrl: 'views/record/allergies/review.html',
        controller: 'RecordAllergiesReviewCtrl'
      })
      .when('/record/download', {
        templateUrl: 'views/record/download.html',
        controller: 'RecordDownloadCtrl'
      })
      .when('/files/upload', {
        templateUrl: 'views/files/upload.html',
        controller: 'FilesUploadCtrl'
      })
      .when('/record/encounters/review', {
        templateUrl: 'views/record/encounters/review.html',
        controller: 'RecordEncountersReviewCtrl'
      })
      .when('/record/immunizations/review', {
        templateUrl: 'views/record/immunizations/review.html',
        controller: 'RecordImmunizationsReviewCtrl'
      })
      .when('/record/conditions/review', {
        templateUrl: 'views/record/conditions/review.html',
        controller: 'RecordConditionsReviewCtrl'
      })
      .when('/record/medications/review', {
        templateUrl: 'views/record/medications/review.html',
        controller: 'RecordMedicationsReviewCtrl'
      })
      .when('/record/procedures/review', {
        templateUrl: 'views/record/procedures/review.html',
        controller: 'RecordProceduresReviewCtrl'
      })
      .when('/record/results/review', {
        templateUrl: 'views/record/results/review.html',
        controller: 'RecordResultsReviewCtrl'
      })
      .when('/record/vitals/review', {
        templateUrl: 'views/record/vitals/review.html',
        controller: 'RecordVitalsReviewCtrl'
      })
      .when('/record/social/review', {
        templateUrl: 'views/record/social/review.html',
        controller: 'RecordSocialReviewCtrl'
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


