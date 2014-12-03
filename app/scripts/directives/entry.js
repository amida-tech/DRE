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
      		scope.entryTemplatePath = "/views/templates/details/allergies.html";
      		break;
      		case 'encounters':
      		scope.entryTitle = scope.entryData.encounter.name;
      		scope.entrySubTitleOne = scope.entryData.locations[0].name;
      		scope.entrySubTitleTwo = scope.entryData.date_time.displayDate;
      		scope.entryTemplatePath = "/views/templates/details/encounters.html";
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
