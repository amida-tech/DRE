'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordProceduresReviewCtrl
 * @description
 * # RecordProceduresReviewCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('RecordProceduresReviewCtrl', function ($scope, $location, procedures, format) {

        $scope.entryType = 'procedures';
        $scope.masterEntries = [];
        $scope.entries = [];
        $scope.updateDate = null;
        $scope.partialEntries = [];
        $scope.alertShow = true;
        $scope.match = [];

        //Instantiate empty clone of object structure.
        var selectedOriginal = {
            "performer": null
        };

        $scope.selected = angular.copy(selectedOriginal);

        $scope.closeAlert = function () {
            $scope.alertShow = false;
        }

        function getRecords(callback) {
            procedures.getRecord(function (err, results) {
                $scope.masterEntries = results;
                $scope.entries = results;
                callback();
            });
        }

        function getPartial(callback) {
            procedures.getPartialRecord(function (err, results) {
                $scope.entries = results;
                callback();
            });
        }

        function getMatch(callback) {
            procedures.getPartialMatch(function (err, results) {
                $scope.match = results;

                //Duplicate originals for restore.
                _.each($scope.match, function (match) {
                    match.origMatch = angular.copy(match.srcMatch);
                })

                callback();
            });
        }

        function formatDates() {
            //Add displayDate to all entries.
            _.each($scope.match, function (entry) {

                //Format newMatch Date Display.
                _.each(entry.newMatch.date_time, function (dateEntry) {
                    format.formatDate(dateEntry);
                });
                entry.newMatch.date_time.displayDate = format.outputDate(entry.newMatch.date_time);

                //Format srcMatch Date Display.
                _.each(entry.srcMatch.date_time, function (dateEntry) {
                    format.formatDate(dateEntry);
                });
                entry.srcMatch.date_time.displayDate = format.outputDate(entry.srcMatch.date_time);

            });
        }

        function formatDisplay() {
        	_.each($scope.match, function(entry) {

        		_.each(entry.newMatch.performer, function (perf) {

        			_.each(perf.address, function(addr) {
        				format.formatAddress(addr);
        			});


                	_.each(perf.organization, function(org) {

                        _.each(org.address, function(orgAddr) {
                            format.formatAddress(orgAddr);

                        });

                    });
        		});

        		_.each(entry.srcMatch.performer, function(perf) {

        			_.each(perf.address, function(addr) {
        				format.formatAddress(addr);
        			});

                	_.each(perf.organization, function(org) {

                        _.each(org.address, function(orgAddr) {
                            format.formatAddress(orgAddr);

                        });

                    });
        		});
        	});
        }

        $scope.selectEntry = function (matchIndex) {
            _.each($scope.selected, function (elem, name, list) {

                if (elem === true) {
                    $scope.match[matchIndex].srcMatch[name] = $scope.match[matchIndex].newMatch[name];
                } else if (elem === false) {
                    $scope.match[matchIndex].srcMatch[name] = $scope.match[matchIndex].origMatch[name];
                    formatDates();
                } else if (_.isObject(elem)) {
                    // Handle status
                    if (elem.status === true) {
                        $scope.match[matchIndex].srcMatch[name].status = $scope.match[matchIndex].newMatch[name].status;
                    } else if (elem.status === false) {
                        $scope.match[matchIndex].srcMatch[name].status = $scope.match[matchIndex].origMatch[name].status;
                    }
                    //Explicitly handle reactions.
                    _.each(elem.reactions, function (rElem, rName, rList) {

                        if (rElem === true) {

                            var newReaction = $scope.match[matchIndex].newMatch[name].reactions[rName];
                            newReaction.srcMatchIndex = rName;

                            if (!$scope.match[matchIndex].srcMatch[name].reactions) {
                                $scope.match[matchIndex].srcMatch[name].reactions = [];
                            }

                            $scope.match[matchIndex].srcMatch[name].reactions.push(newReaction);
                        } else if (rElem === false) {

                            //Index to splice.
                            //console.log(rName);

                            _.each($scope.match[matchIndex].srcMatch[name].reactions, function (rxElem, rxName, rxList) {

                                if (rxElem.srcMatchIndex) {
                                    if (rxElem.srcMatchIndex === rName) {
                                        //Splice ID.
                                        console.log(rxName);
                                        $scope.match[matchIndex].srcMatch[name].reactions.splice(rxName);
                                    }
                                }
                            });
                        }

                    });

                }

            });

        }

        $scope.clearAll = function (matchIndex) {

            $scope.selected = angular.copy(selectedOriginal);  
            $scope.match[matchIndex].srcMatch = angular.copy($scope.match[matchIndex].origMatch);
            formatDates();
            formatDisplay();

        }

        $scope.saveUpdate = function (matchIndex) {

            console.log($scope.match[matchIndex].srcMatch);

            procedures.saveEntry($scope.match[matchIndex].srcMatch, function (err) {

                $location.path('/record/procedures');


            });

        }

        $scope.refresh = function () {
            getMatch(function (err) {
                formatDates();
                formatDisplay();
            });
        }

        $scope.refresh();
  });
