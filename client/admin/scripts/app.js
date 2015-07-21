/// <reference path="../../../typings/jquery/jquery.d.ts"/>
/// <reference path="/../../../typings/angularjs/angular.d.ts"/>
'use strict';

/**
 * @ngdoc overview
 * @name phrAdminApp
 * @description
 * # phrAdminApp
 *
 * Main module of the application.
 */
angular
    .module('phrAdminApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'vm',
                requireLogin: false
            })
            .when('/admin/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                requireLogin: false
            })
            .when('/admin/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            })
            .when('/admin/clients', {
                templateUrl: '/views/clients.html',
                controller: 'ClientsCtrl',
                controllerAs: 'vm',
                requireLogin: true,
                permissions: 'admin'
            })
            .when('/403', {
                templateUrl: '/views/403.html'
            })
            .otherwise({
                redirectTo: '/admin'
            });
    })
    .run(function ($rootScope, $location, authentication) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            authentication.authStatus(function (err, auth) {
                if (err) {
                    console.log("routeChangeStart auth error: ", err);
                }
                $rootScope.isAuthorized = auth;
                $rootScope.$broadcast("authAvailable", auth);
                if (next.requireLogin) {
                    if (!auth) {
                        event.preventDefault();
                        $location.path("/admin/login");
                    }
                }
                if (next.permissions !== undefined && next.permissions === 'admin') {
                    authentication.adminStatus(function (err, role) {
                        if (err) {
                            console.log('NOT AUTHORIZED FOR THIS ROUTE:', err);
                            event.preventDefault();
                            $location.path("/403");
                        }
                    });

                }
            });
        });
    });
