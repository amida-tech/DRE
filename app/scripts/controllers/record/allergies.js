'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordAllergiesCtrl
 * @description
 * # RecordAllergiesCtrl
 * Controller of the phrPrototypeApp
 */
 angular.module('phrPrototypeApp')
 .controller('RecordAllergiesCtrl', function ($scope, allergies, format, partial) {

    $scope.entryType = 'allergies';
    $scope.masterEntries = [];
    $scope.entries = [];
    $scope.updateDate = null;
    $scope.inactiveFlag = false;
    $scope.partialEntries = [];
    $scope.alertShow = true;

    $scope.newComment = {
        'starred': false
    };


    $scope.swapTabs = function(entryClass, entryIndex) {

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

    $scope.closeAlert = function () {
        $scope.alertShow = false;
    }

    function getUpdateDate () {
        	//Should grab from files/update history.  Stubbed for now.
        	$scope.updateDate = '12/1/2014';
        }

        function getRecords(callback) {

            allergies.getRecord(function (err, results) {
                $scope.masterEntries = results;
                callback();
            });
        }

        function getPartials() {
            partial.getPartialMatches($scope.entryType, function(err, results) {

                $scope.partialEntries = results;

            });
        }

        function filterInactive () {
            if ($scope.inactiveFlag === false) {
                $scope.entries = _.filter(_.clone($scope.masterEntries), function(entry) {

                    if (entry.data.observation) {
                        if (entry.data.observation.status) {

                            if (entry.data.observation.status.name === "Active") {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                });
            } else {
                $scope.entries = _.clone($scope.masterEntries);
            }
        }

        function formatDates () {

        	//Add displayDate to all entries.
        	_.each($scope.masterEntries, function(entry) {
        		if (entry.data.date_time) {
        			_.each(entry.data.date_time, function(dateEntry) {
        				format.formatDate(dateEntry);
        			});
                    entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
                    entry.data.date_time.plotDate = format.plotDate(entry.data.date_time);
                }
            });
        }


        //Adds to record metadata a count of all starred comments for display.
        //Optionally takes recordIndex for updating count as stars are clicked.
        function countStarredComments (recordIndex) {
            if (!_.isUndefined(recordIndex)) {
                var commentCount = 0;
                _.each($scope.masterEntries[recordIndex].metadata.comments, function(comment) {
                    if (comment.starred) {
                        commentCount++;
                    }
                });
                $scope.masterEntries[recordIndex].metadata.starred_comments = commentCount;
            } else {
             _.each($scope.masterEntries, function(entry) {
                var commentCount = 0;
                _.each(entry.metadata.comments, function(comment) {
                    if (comment.starred) {
                        commentCount++;
                    }
                });
                entry.metadata.starred_comments = commentCount;
            });

         }
     }

     $scope.refresh = function () {
        getRecords(function (err) {
         getUpdateDate();
         formatDates();
         filterInactive();
         countStarredComments();
         getPartials();
     });
    }

    $scope.clickStar = function(starVal, starIndex, recordIndex) {
        if (starVal) {
            $scope.entries[recordIndex].metadata.comments[starIndex].starred = false;
        } else {
            $scope.entries[recordIndex].metadata.comments[starIndex].starred = true;
        }
        countStarredComments(recordIndex);

    };

    $scope.newStar = function(starVal, recordIndex) {
        if (starVal) {
            $scope.newComment.starred = false;
        } else {
            $scope.newComment.starred = true;
        }  
    }

    $scope.addNote = function(recordIndex) {
        $scope.newComment.date = new Date();
        $scope.entries[recordIndex].metadata.comments.push($scope.newComment);
        $scope.newComment = {
            "starred": false
        }
        countStarredComments(recordIndex);
    }

    $scope.$watch('inactiveFlag', function() {
       filterInactive();
   });

    $scope.refresh();

});