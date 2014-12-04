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
      	scope.entryIndex = attrs.entryIndex;

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
      		scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
      		break;
      		case 'encounters':
      		scope.entryTitle = scope.entryData.encounter.name;
      		scope.entrySubTitleOne = scope.entryData.locations[0].name;
      		scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
      		scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'immunizations':
                  scope.entryTitle = scope.entryData.product.product.name;
                  scope.entrySubTitleOne = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'medications':
                  scope.entryTitle = scope.entryData.product.product.name;
                  scope.entrySubTitleOne = scope.entryData.administration.route.name;
                  scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'conditions':
                  scope.entryTitle = scope.entryData.problem.code.name;
                  scope.entrySubTitleOne = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'procedures':
                  scope.entryTitle = scope.entryData.procedure.name;
                  scope.entrySubTitleOne = scope.entryData.status;
                  scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'vitals':
                  scope.entryTitle = scope.entryData.displayQuantity;
                  scope.entrySubTitleOne = scope.entryData.vital.name;
                  scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'results':
                  scope.entryTitle = scope.entryData.result_set.name;
                  scope.entrySubTitleOne = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'social':
                  scope.entryTitle = scope.entryData.value;
                  scope.entrySubTitleOne = scope.entryData.code.name;
                  scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'claims':
                  scope.entryTitle = scope.entryData.payer[0];
                  scope.entrySubTitleOne = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;
                  case 'insurance':
                  scope.entryTitle = scope.entryData.name;
                  if (scope.entryData.date_time) {
                        scope.entrySubTitleOne = scope.entryData.date_time.displayDate;      
                  }
                  scope.entryTemplatePath = "/views/templates/details/" + entryType + ".html";
                  break;

      	}

      	function countStarredComments (recordIndex) {
      		var commentCount = 0;
      		_.each(scope.entryMetaData.comments, function(comment) {
      			if (comment.starred) {
      				commentCount++;
      			}
      		});
      		scope.entryMetaData.starred_comments = commentCount;
      	}

      	countStarredComments();

      	scope.swapTabs = function(entryClass, entryIndex) {

      		if (entryClass === "details") {
      			$("#comments" + entryIndex).removeClass("in");  
      			$("#history" + entryIndex).removeClass("in");    
      		} else if (entryClass === "comments") {
      			$("#details" + entryIndex).removeClass("in");  
      			$("#history" + entryIndex).removeClass("in");    
      		} else if (entryClass === "history") {
      			$("#details" + entryIndex).removeClass("in");  
      			$("#comments" + entryIndex).removeClass("in");    
      		}

      	};

      	scope.clickStar = function (starVal, starIndex, recordIndex) {
      		if (starVal) {
      			scope.entryMetaData.comments[starIndex].starred = false;
      		} else {
      			scope.entryMetaData.comments[starIndex].starred = true;
      		}
      		countStarredComments();
      	};

      	scope.newStar = function(starVal, recordIndex) {
      		if (starVal) {
      			scope.newComment.starred = false;
      		} else {
      			scope.newComment.starred = true;
      		}  
      	};

      	scope.addNote = function() {
      		scope.newComment.date = new Date();
      		scope.entryMetaData.comments.push(scope.newComment);
      		scope.newComment = {
      			"starred": false
      		};
      		countStarredComments();
      	};

      }
  };
});
