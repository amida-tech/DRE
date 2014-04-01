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

angular.module('phix.requestCtrl', [])
  .controller('RequestCtrl', ['$scope', '$element',
    function($scope, $element) {
      $scope.checked = [{
        name: 'encounters',
        checked: false
      }, {
        name: 'vitals',
        checked: false
      }, {
        name: 'labs',
        checked: false
      }, {
        name: 'medications',
        checked: false
      }, {
        name: 'immunizations',
        checked: false
      }, {
        name: 'allergies',
        checked: false
      }, {
        name: 'problems',
        checked: false
      }, {
        name: 'all',
        checked: false
      }];
      $scope.request = function() {
        if ($scope.pname === 'joe') {
          $scope.result = 'found';
        } else {
          $scope.result = 'notfound';
        }
      };

      $scope.reset = function() {
        //$element;
        $scope.pname = '';
        $scope.result = '';
      };
    }
  ]);