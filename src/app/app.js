/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular
  .module('phix', [
    'bt.forms',
    'ngRoute',
    'phix.authenticationService',
    'phix.tabService',
    'phix.inboxService',
    'phix.enrollCtrl',
    'phix.verifyCtrl',
    'phix.inboxCtrl',
    'phix.landingCtrl',
    'phix.listRecordsCtrl',
    'phix.listRulesCtrl',
    'phix.loginCtrl',
    'phix.navbarCtrl',
    'phix.outboxCtrl',
    'phix.pendingCtrl',
    'phix.previewCtrl',
    'phix.profileCtrl',
    'phix.recordCtrl',
    'phix.signupCtrl',
    'phix.exchangeCtrl',
    'phix.lookupCtrl'
  ])
    // Note TabService is included but not used to ensure its been instantiated
  .run(['$rootScope', '$location', 'AuthenticationService', 'TabService', 'InboxService', function ($rootScope, $location, AuthenticationService) {

    var configuration="phix";
    var nodeLocation="http://localhost:3000";
    //var serviceLocation="http://localhost:3001";

    var dev={phix_host:"localhost", phix_port:3000, clinician_host:"localhost", clinician_port:3000};
    var prod={phix_host:"phix.amida-demo.com", clinician_host:"clinician.amida-demo.com"};

    /*if ($location.host()===dev.phix_host && $location.port()===dev.phix_port) {
        configuration="phix";
        nodeLocation="http://"+dev.phix_host+":"+dev.phix_port;
        //serviceLocation="http://"+dev.phix_host+":"+dev.phix_port;
    } else if ($location.host()===dev.clinician_host && $location.port()===dev.clinician_port) {
        configuration="clinician";
        nodeLocation="http://"+dev.phix_host+":"+dev.phix_port;
        //serviceLocation="http://"+dev.clinician_host+":"+dev.clinician_port;
    } else if ($location.host()===prod.phix_host) {
        configuration="phix";
        nodeLocation="http://"+prod.phix_host;
        //serviceLocation="http://"+prod.phix_host;
    } else if ($location.host()===prod.clinician_host) {
        configuration="clinician";
        nodeLocation="http://"+prod.clinician_host;
        //serviceLocation="http://"+prod.clinician_host;
    }*/

    $rootScope.appConfiguration = {
        //serviceLocation: serviceLocation,
        nodeLocation: nodeLocation, //I think this should point to PHIX when we are in Clinician mode
        configuration: configuration  //Either 'clinician' or 'phix'
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        AuthenticationService.authenticated(function (authStatus) {
          if ($.inArray('patient', next.roles) >= 0 && authStatus && !AuthenticationService.clinician()) {
            // do nothing.
          } else if ($.inArray('clinician', next.roles) >= 0 && authStatus && AuthenticationService.clinician()){
            // do nothing.
          } else if (!authStatus && ($.inArray('patient', next.roles) >= 0 || $.inArray('clinician', next.roles) >= 0)) {
            $location.path('/');
          }
        });
    });
  }])
  .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/landing',
        controller: 'LandingCtrl'
      })
      .when('/login', {
        templateUrl: '/partials/login',
        controller: 'LoginCtrl'
      })
      .when('/lookup', {
        templateUrl: '/partials/lookup',
        controller: 'LookupCtrl'
      })
      .when('/signup', {
        templateUrl: '/partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/verification', {
        templateUrl: '/partials/verify',
        controller: 'VerifyCtrl'
      })
      .when('/:user', {
        templateUrl: '/partials/record',
        controller: 'RecordCtrl',
        tab: 'user',
        roles: ['patient']
      })
      .when('/:user/enroll', {
        templateUrl: '/partials/enroll',
        controller: 'EnrollCtrl',
        roles: ['patient', 'clinician']
      })
      .when('/:user/mail/inbox', {
        templateUrl: '/partials/mail/inbox',
        controller: 'InboxCtrl',
        tab: 'mail',
        roles: ['patient', 'clinician']
      })
      .when('/:user/mail/outbox', {
        templateUrl: '/partials/mail/outbox',
        controller: 'OutboxCtrl',
        tab: 'mail',
        roles: ['patient', 'clinician']
      })
      .when('/:user/pending', {
        templateUrl: '/partials/confirmation',
        controller: 'PendingCtrl',
        tab: 'pending',
        roles: ['patient', 'clinician']
      })
      .when('/:user/profile', {
        templateUrl: '/partials/profile',
        controller: 'ProfileCtrl',
        tab: 'gear',
        roles: ['patient']
      })
      .when('/:user/rules', {
        templateUrl: '/partials/rules/list',
        controller: 'ListRulesCtrl',
        tab: 'lock',
        roles: ['patient']
      })
      .when('/:user/store', {
        templateUrl: '/partials/records/list',
        controller: 'ListRecordsCtrl',
        tab: 'folder',
        roles: ['patient']
      })
      .when('/:user/exchange', {
        templateUrl: '/partials/exchange',
        controller: 'ExchangeCtrl',
        tab: 'exchange',
        roles: ['patient']
      });
  }]);
