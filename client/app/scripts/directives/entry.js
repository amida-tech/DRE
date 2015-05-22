'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:entry
 * @description
 * # entry
 */
angular.module('phrPrototypeApp')
    .directive('entry', function (format, notes) {
        return {
            template: '<ng-include src="getTemplateUrl()"/>',
            restrict: 'EA',
            transclude: true,
            controller: function ($scope) {
                $scope.getTemplateUrl = function () {
                    if ($scope.type === 'medications') {
                        return 'views/templates/entries/medications.html';
                    } else {
                        return 'views/templates/entry.html';
                    }
                };
            },
            link: function postLink(scope, element, attrs) {
                //Attribute Variables.
                scope.type = attrs.type;
                scope.entryIndex = attrs.entryIndex;

                //Scope Inherited Variables.
                scope.entryData = scope.recordEntry.data;
                scope.entryMetaData = scope.recordEntry.metadata;

                //Generated Variables.
                scope.entryTemplatePath = "views/templates/details/" + scope.type + ".html";

                function countStarredComments(recordIndex) {
                    var commentCount = 0;
                    _.each(scope.entryMetaData.comments, function (comment) {
                        if (comment.starred) {
                            commentCount++;
                        }
                    });
                    scope.entryMetaData.starred_comments = commentCount;
                }
                countStarredComments();

                scope.clickStar = function (starVal, starIndex, recordIndex, entry) {
                    console.log("click Star ", !starVal, entry);

                    notes.starNote(entry.note_id, !starVal, function (err, data) {
                        console.log('err ', err);
                        console.log('updated note ', data);
                    });

                    if (starVal) {
                        scope.entryMetaData.comments[starIndex].starred = false;
                    } else {
                        scope.entryMetaData.comments[starIndex].starred = true;
                    }
                    countStarredComments();
                };
                scope.toggleNewStar = function () {
                    scope.newComment.starred = !scope.newComment.starred;
                };

                scope.toggleStar = function () {
                    notes.starNote(scope.entryMetaData.comments[0].note_id, !scope.entryMetaData.comments[0].starred, function (err, data) {
                        if (err) {
                            console.log("err: " + err);
                        } else {
                            console.log("new star data: ", data);
                            scope.entryMetaData.comments[0].starred = !scope.entryMetaData.comments[0].starred;
                            countStarredComments();
                        }
                    });
                };

                scope.addNote = function () {
                    scope.newComment.entry = scope.recordEntry.data._id;
                    scope.newComment.note = scope.newComment.comment;
                    scope.newComment.section = scope.recordEntry.category;

                    notes.addNote(scope.newComment, function (err, data) {
                        console.log('err ', err);
                        console.log('data ', data);

                        scope.newComment.entry_id = data.entry;
                        scope.newComment.note_id = data._id;

                        scope.entryMetaData.comments = [scope.newComment];

                        console.log(scope.newComment.starred);
                        if (angular.isUndefined(scope.newComment.starred)) {
                            scope.newComment.starred = false;
                        }
                        notes.starNote(scope.newComment.note_id, scope.newComment.starred, function (err, data) {
                            console.log('add note star error ', err);
                            console.log('add note with star ', data);
                        });

                        countStarredComments();

                        console.log("scope.newComment", scope.newComment);
                        scope.newComment = {};

                    });

                };

                scope.newComment = {};

                scope.cancelEdit = function () {
                    console.log("cancel edit");
                    scope.editflag = false;
                };

                scope.editNote = function () {
                    console.log("edit note");
                    scope.editflag = true;
                    scope.editComment = scope.entryMetaData.comments[0].comment;
                };

                scope.deleteNote = function () {
                    console.log("delete note");
                    notes.deleteNote(scope.entryMetaData.comments[0].note_id, function (err, data) {
                        console.log('deleting note ', err);
                        console.log('deleting note ', data);
                    });
                    scope.entryMetaData.comments = [];
                    countStarredComments();
                    scope.editflag = false;
                };

                scope.saveNote = function (editComment) {
                    console.log("save note");
                    scope.entryMetaData.comments[0].comment = editComment;
                    var noteID = scope.entryMetaData.comments[0].note_id;
                    notes.editNote(noteID, editComment, function (err, data) {
                        if (err) {
                            console.log("err: " + err);
                        } else {
                            console.log("edited note saved: ", data);
                        }
                    });
                    scope.editflag = false;
                };

            }
        };
    });
