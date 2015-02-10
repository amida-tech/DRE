'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:entry
 * @description
 * # entry
 */
 angular.module('phrPrototypeApp')
 .directive('billingentry', function () {
 	return {
 		templateUrl: 'views/templates/billingentry.html',
 		restrict: 'EA',
 		link: function postLink(scope, element, attrs) {

      	//Attribute Variables.
      	var entryType = attrs.entryType;
      	scope.entryIndex = attrs.entryIndex;

      	//Scope Inherited Variables.
      	scope.entryData = scope.recordEntry.data;
      	scope.entryMetaData = scope.recordEntry.metadata;	

            console.log("BILLING META ",scope.recordEntry);

      	//Generated Variables.
      	scope.entryTitle = "";
      	scope.entrySubTitleOne = "";
      	scope.entrySubTitleTwo = "";

      	switch (entryType) {
                  case 'claims':
                  scope.entryTitle = scope.entryData.payer[0];
                  scope.entrySubTitleOne = scope.entryData.date_time.displayDate;
                  scope.entryTemplatePath = "views/templates/details/" + entryType + ".html";
                  break;
                  case 'insurance':
                  scope.entryTitle = scope.entryData.policy.insurance.performer.organization[0].name[0];
                  if (scope.entryData.date_time) {
                        scope.entrySubTitleOne = scope.entryData.date_time.displayDate;      
                  }
                  scope.entryTemplatePath = "views/templates/details/" + entryType + ".html";
                  break;

      	}

      	function countStarredComments (recordIndex) {
      		var commentCount = 0;

                  return;

                  //TODO: fix this, it breaks now

                  /*
      		_.each(scope.entryMetaData.comments, function(comment) {
      			if (comment.starred) {
      				commentCount++;
      			}
      		});
      		scope.entryMetaData.starred_comments = commentCount;
                  */
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
