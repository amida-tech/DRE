'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:recordNavigation
 * @description
 * # recordNavigation
 */
angular.module('phrPrototypeApp')
  .directive('recordNavigation', function () {
    return {
      template: '<div class="btn-group-vertical col-sm-12">' +
      			'<a href="#/record/allergies" class="btn btn-default btn-block">Allergies</a>' + 
      			'<a href="#/record/encounters" class="btn btn-default btn-block">Encounters</a>' +
      			'<a href="#/record/immunizations" class="btn btn-default btn-block">Immunizations</a>' +
      			'<a href="#/record/medications" class="btn btn-default btn-block">Medications</a>' +
      			'<a href="#/record/conditions" class="btn btn-default btn-block">Conditions</a>' +
      			'<a href="#/record/procedures" class="btn btn-default btn-block">Procedures</a>' +
      			'<a href="#/record/vitals" class="btn btn-default btn-block">Vital Signs</a>' +
      			'<a href="#/record/results" class="btn btn-default btn-block">Results</a>' +
      			'<a href="#/record/social" class="btn btn-default btn-block">Social History</a>' +
      			'</div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        
      }
    };
  });
