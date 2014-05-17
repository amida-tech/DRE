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

var dre = angular
  .module('dre', [
    'ngRoute',
    'dre.record',
    'dre.storage',
    'dre.dashboard',
    'dre.match',
    'dre.match.review',
    'directives.fileModel',
    'services.fileUpload',
    'services.getNotifications',
    'services.recordFunctions'
  ])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/dashboard/dashboard.tpl.html',
        controller: 'dashboardCtrl'
    });
      
  }])
    // Note TabService is included but not used to ensure its been instantiated
  .run(['$rootScope', '$location', function ($rootScope, $location) {

  }]);