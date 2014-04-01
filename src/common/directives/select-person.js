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

angular.module('phix.selectPerson', ['bt.datepicker'])
  .directive('phPerson', function() {
    return {
      restrict: 'E',
      template: "<div ng-include='\"partials/select-person\"' onload='onload()'></div>",
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
        scope.location = '';

        scope.locations = ['1234 olive st', '2344 wall st', '13344 sky way unit 3324'];

        scope.selectLoc = function(loc) {
          scope.location = loc;
          scope.done = true;
        };

        scope.$watch('pname', function() {
          elem.find('#name').val(attr.pname);
        });

        scope.onload = function() {
          elem.find('#name').change(function() {
            if (ngModel) {
              ngModel.$setViewValue(elem.find('#name').val());
            }
          });
        };
      }
    };
  });