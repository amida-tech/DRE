'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:entry
 * @description
 * # entry
 */
 angular.module('phrPrototypeApp')
 .directive('entry', function () {
 	return {
 		templateUrl: 'views/templates/entry.html',
 		restrict: 'EA',
 		link: function postLink(scope, element, attrs) {

      	//Attribute Variables.
      	var entryType = attrs.entryType;
      	var entryIndex = attrs.entryIndex;

      	//Scope Inherited Variables.
      	scope.entryData = scope.recordEntry.data;
      	scope.entryMetaData = scope.recordEntry.metadata;	

      	//Generated Variables.
      	scope.entryTitle = "";
      	scope.entrySubTitleOne = "";
      	scope.entrySubTitleTwo = "";

      	switch (entryType) {
      		case 'allergies':
      		scope.entryTitle = scope.entryData.observation.allergen.name;
      		scope.entrySubTitleOne = scope.entryData.observation.severity.code.name;
      		scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
      		break;
      	}



      }
  };
});
