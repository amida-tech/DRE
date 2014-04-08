angular.module('bt.datepicker', [])
  .directive('btDatepicker', function() {
    return {
      restrict: 'E',
      template: '<div class="form-group"><div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-default"><span class="fui-calendar"></span></button></span><input type="text" class="form-control" value="" /></div></div>',
      require: '?ngModel',
      link: function(scope, elem, attr, ngModel) {
        var $input = elem.find('input');

        $input.datepicker({
          showOtherMonths: true,
          selectOtherMonths: true,
          changeYear: true,
          changeMonth: true,
          yearRange: '1900:' + new Date().getFullYear(),
          dateFormat: "d MM, yy"
        }).prev('.btn').on('click', function(e) {
          if (e) {
            e.preventDefault();
          }
          $input.focus();
        });

        $.extend($.datepicker, {
          _checkOffset: function(inst, offset, isFixed) {
            return offset;
          }
        });

        elem.find('.input-group').on('focus', '.form-control', function() {
          $(this).closest('.form-group').addClass('focus');
        }).on('blur', '.form-control', function() {
          $(this).closest('.form-group').removeClass('focus');
        });

        // Now let's align datepicker with the prepend button
        $input.datepicker('widget').css({
          'margin-left': -$input.prev('.input-group-btn').find('.btn').outerWidth()
        });

        $input.parent()
          .datepicker('widget')
          .css({
            'margin-left': -$input.prev('.btn').outerWidth()
          });

        elem.find('input').change(function() {
          if (ngModel) {
            scope.$apply(function() {
              ngModel.$setViewValue(elem.find('input').val());
            });
          }
        });
      }
    };
  });