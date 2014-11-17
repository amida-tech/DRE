'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:recordNavigation
 * @description
 * # recordNavigation
 */
angular.module('phrPrototypeApp')
  .directive('recordNavigation', function ($location) {
    return {
      template: '<div class="btn-group-vertical col-sm-12">' +
      			'<a href="#/record/allergies" id="navallergies" class="btn btn-default btn-block">Allergies</a>' + 
      			'<a href="#/record/encounters" id="navencounters" class="btn btn-default btn-block">Encounters</a>' +
      			'<a href="#/record/immunizations" id="navimmunizations" class="btn btn-default btn-block">Immunizations</a>' +
      			'<a href="#/record/medications" id="navmedications" class="btn btn-default btn-block">Medications</a>' +
      			'<a href="#/record/conditions" id="navconditions" class="btn btn-default btn-block">Conditions</a>' +
      			'<a href="#/record/procedures" id="navprocedures" class="btn btn-default btn-block">Procedures</a>' +
      			'<a href="#/record/vitals" id="navvitals" class="btn btn-default btn-block">Vital Signs</a>' +
      			'<a href="#/record/results" id="navresults" class="btn btn-default btn-block">Test Results</a>' +
      			'<a href="#/record/social" id="navsocial" class="btn btn-default btn-block">Social History</a>' +
      			'</div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        
          //Active Link Highlighting.
          element.find("a#nav" + scope.entryType).addClass("active");

      }
    };
  });
