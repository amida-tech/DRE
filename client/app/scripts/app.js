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
    .config(function($routeProvider) {
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
            .when('/matches', {
                templateUrl: 'views/matches.html',
                controller: 'MatchesCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function($rootScope, $location, authentication) {

        var routesThatDontRequireAuth = ['/login', '/', '/register'];

        // if current location matches route  
        var routeClean = function (route) {
          return _.find(routesThatDontRequireAuth,
            function (noAuthRoute) {
              return _.str.startsWith(route, noAuthRoute);
            });
        };

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            // if route requires auth and user is not logged in
            authentication.authStatus(function(err, res) {
              var url = $location.url();              
              //console.log('res', res);
                if (!res) {
                    //console.log('url', url, (url ==='/login')||(url==='/')||(url==='/register'));
                    if ((url ==='/login')||(url==='/')||(url==='/register')) {
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
