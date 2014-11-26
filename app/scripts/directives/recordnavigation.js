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
      template: '<div class="col-sm-12 ">' +
            '<div class="">' +
            '<ul class="nav ">' +
      			'<li><a href="#/record/allergies" id="navallergies" class="">Allergies</a></li>' + 
      			'<li><a href="#/record/encounters" id="navencounters" class="">Encounters</a></li>' +
      			'<li><a href="#/record/immunizations" id="navimmunizations" class="">Immunizations</a></li>' +
      			'<li><a href="#/record/medications" id="navmedications" class="">Medications</a></li>' +
      			'<li><a href="#/record/conditions" id="navconditions" class="">Conditions</a></li>' +
      			'<li><a href="#/record/procedures" id="navprocedures" class="">Procedures</a></li>' +
      			'<li><a href="#/record/vitals" id="navvitals" class="">Vital Signs</a></li>' +
      			'<li><a href="#/record/results" id="navresults" class="">Test Results</a></li>' +
      			'<li><a href="#/record/social" id="navsocial" class="">Social History</a></li>' +
            '</ul>' +
      			'</div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        
          //Active Link Highlighting.
          element.find("a#nav" + scope.entryType).addClass("active");

      }
    };
  });
