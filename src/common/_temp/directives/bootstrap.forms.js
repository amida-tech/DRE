angular.module('bt.forms', [])
  .directive('btCheckbox', ['$parse',
    function($parse) {
      return {
        restrict: 'E',
        template: '<input type="checkbox" />',
        scope: {
          'ngModel': '=',
          'myClick': '&ngClick'
        },
        link: function(scope, elem, attr) {
          elem.find('input').checkbox();

          var fn = $parse(scope.myClick);
          elem.parent().find('span.icons').on('click', function(e) {
            scope.$apply(function() {
              scope.changing = true;
              scope.ngModel = !scope.ngModel;
            });
            scope.$apply(function() {
              scope.changing = false;
              fn(scope, {
                $event: e
              });
            });
          });
          scope.$watch('ngModel', function(value) {
            if (!scope.changing) {
              if (value) {
                elem.find('input').checkbox('check');
              } else {
                elem.find('input').checkbox('uncheck');
              }
            }
          });
        }
      };
    }
  ])
  .directive('btRadio', function() {
    return {
      restrict: 'E',
      scope: false,
      template: '<input type="radio" />',
      replace: true,
      link: function(scope, elem, attr) {
        elem.radio();
        elem.on('change', function() {
          scope.$apply();
        });
      }
    };
  });