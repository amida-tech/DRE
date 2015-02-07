'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:entry
 * @description
 * # entry
 */
angular.module('phrPrototypeApp').directive('entry', function(format, $http) {
    return {
        templateUrl: 'views/templates/entry.html',
        restrict: 'EA',
        link: function postLink(scope, element, attrs) {
            //Attribute Variables.
            scope.type = attrs.type;
            scope.entryIndex = attrs.entryIndex;
            //Scope Inherited Variables.
            scope.entryData = scope.recordEntry.data;
            scope.entryMetaData = scope.recordEntry.metadata;
            //Generated Variables.
            scope.entryTitle = "";
            scope.entrySubTitleOne = "";
            scope.entrySubTitleTwo = "";
            scope.entryTemplatePath = "views/templates/details/" + scope.type + ".html";



            switch (scope.type) {
                case 'allergies':
                    if (scope.entryData.observation.allergen.name) {
                        scope.entryTitle = scope.entryData.observation.allergen.name;
                    } 
                    if (scope.entryData.observation.severity.code.name) {
                        scope.entrySubTitleOne = scope.entryData.observation.severity.code.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;                        
                    }
                    break;
                case 'encounters':
                    if (scope.entryData.encounter.name) {
                        scope.entryTitle = scope.entryData.encounter.name;
                    }
                    if (scope.entryData.locations[0].name) {
                        scope.entrySubTitleOne = scope.entryData.locations[0].name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'immunizations':
                    if (scope.entryData.product.product.name) {
                        scope.entryTitle = scope.entryData.product.product.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'medications':
                    if (scope.entryData.product.product.name) {
                        scope.entryTitle = scope.entryData.product.product.name;
                    }
                    if (scope.entryData.administration.route.name) {
                        scope.entrySubTitleOne = scope.entryData.administration.route.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'conditions':
                    if (scope.entryData.problem.code.name) {
                        scope.entryTitle = scope.entryData.problem.code.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'procedures':
                    if (scope.entryData.procedure.name) {
                        scope.entryTitle = scope.entryData.procedure.name;
                    }
                    if (scope.entryData.status) {
                        scope.entrySubTitleOne = scope.entryData.status;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'vitals':
                    var quantityUnit = "";
                    if (scope.entryData.unit === "[in_i]") {
                        quantityUnit = "inches";
                    } else if (scope.entryData.unit === "[lb_av]") {
                        quantityUnit = "lbs";
                    } else if (scope.entryData.unit === "mm[Hg]") {
                        quantityUnit = "mm";
                    } else {
                        quantityUnit = scope.entryData.unit;
                    }
                    if (scope.entryData.value + " " + quantityUnit) {
                        scope.entryTitle = scope.entryData.value + " " + quantityUnit;
                    }
                    if (scope.entryData.vital.name) {
                        scope.entrySubTitleOne = scope.entryData.vital.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'results':
                    if (scope.entryData.result_set.name) {
                        scope.entryTitle = scope.entryData.result_set.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'social':
                    if (scope.entryData.value) {
                        scope.entryTitle = scope.entryData.value;
                    }
                    if (scope.entryData.code.name) {
                        scope.entrySubTitleOne = scope.entryData.code.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'claims':
                    if (scope.entryData.payer[0]) {
                        scope.entryTitle = scope.entryData.payer[0];
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'insurance':
                    if (scope.entryData.name) {
                        scope.entryTitle = scope.entryData.name;
                    }
                    if (scope.entryData.date_time) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
            }

            function countStarredComments(recordIndex) {
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
                    $("#match" + entryIndex).removeClass("in");
                } else if (entryClass === "comments") {
                    $("#details" + entryIndex).removeClass("in");
                    $("#history" + entryIndex).removeClass("in");
                    $("#match" + entryIndex).removeClass("in");
                } else if (entryClass === "history") {
                    $("#details" + entryIndex).removeClass("in");
                    $("#comments" + entryIndex).removeClass("in");
                    $("#match" + entryIndex).removeClass("in");
                } else if (entryClass === "match") {
                    $("#details" + entryIndex).removeClass("in");
                    $("#comments" + entryIndex).removeClass("in");
                    $("#history" + entryIndex).removeClass("in");
                }

            };
            scope.clickStar = function(starVal, starIndex, recordIndex) {
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
                console.log("adding note");
                console.log(scope);
                //scope.entryMetaData.comments.push(scope.newComment);
                
                scope.newComment.starred = false;

                scope.newComment.entry = scope.recordEntry.data._id;
                scope.newComment.note = scope.newComment.comment;
                scope.newComment.section = scope.recordEntry.category;

                countStarredComments();

                console.log(scope.newComment);

                $http.post('api/v1/notes/add', scope.newComment)
                    .success(function(data) {
                        console.log("note added successfuly");
                    })
                    .error(function(data) {
                        console.log("adding note failed");
                    });

            };

            scope.newComment = {};
        }
    };
});
