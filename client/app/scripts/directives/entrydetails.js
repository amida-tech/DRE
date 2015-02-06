'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:recordNavigation
 * @description
 * # recordNavigation
 */
angular.module('phrPrototypeApp').directive('entryDetails', ['$window', '$location',
    function($window, $location) {
        return {
            templateUrl: 'views/templates/entrydetails.html',
            restrict: 'EA',
            scope: {
                details: '=',
                category: '@',
                tab: '&'
            },
            link: function postLink(scope, element, attrs) {
                scope.entryTemplatePath = "views/templates/matches/" + scope.category + ".html";


                function compareMatches(masterEntry, updateEntry) {
                    var tmpDiff = DeepDiff.diff(masterEntry, updateEntry);
                    var filteredDiff = _.filter(tmpDiff, function(diff) {
                        return !_.contains(diff.path, "_id"); //&& diff.kind !== "D";
                    });
                    return filteredDiff;
                }

                function constructDiffFlags(list) {
                    var flagData = {};
                    function assign(base, path, value) {
                        var a = base;
                    for (var i in path) {
                        var x = path[i];
                        a[x] = Number(i) === path.length - 1 ? value : {};

                        //if (i === path.length - 1)


                        a = a[x];
                    }


                    }
                    _.each(list, function(item) {
                        var tmpObj = {};
                        assign(tmpObj,item.path,item);
                        $.extend(true, flagData,tmpObj);
                        
                    });
                    return flagData;
                    
                }
                scope.$watch('details', function(newVals, oldVals) {
                    if (!_.isUndefined(scope.details)) {
                        scope.entryData = scope.details.entry;
                        scope.matchData = scope.details.matches[0].match_entry;
                        scope.finalData = {};
                        angular.copy(scope.details.matches[0].match_entry, scope.finalData);
                        
                        if (_.isUndefined(scope.diffList)) {
                            scope.diffList = compareMatches(scope.matchData, scope.entryData);
                        }
                        scope.flagData = constructDiffFlags(scope.diffList);
                    }
                }, true);
                scope.updateButton = function (diffs) {
                    _.each(diffs, function (change) {
                        DeepDiff.applyChange(scope.finalData, true, change);
                    });
                    scope.showUndo = true;

                };
                scope.undoButton = function (diffs) {
                    _.each(diffs, function (change) {
                        DeepDiff.revertChange(scope.finalData, true, change);
                    });

                };
                scope.undoAllButton = function () {
                    _.each(scope.diffList, function (change) {
                        DeepDiff.revertChange(scope.finalData, true, change);
                    });

                };
                scope.areEqual = function(obj1,obj2) {
                

                    return angular.equals(obj1,obj2);
                };
                scope.submitButton = function() {
                    //stub to send scope.finalData to merge service
                    var send = $window.confirm("Are these changes accurate?");
                    if (send) {
                        console.log("sending...",scope.finalData);
                    //switch to detail tab
                } else {
                    console.log("didn't send");
                    scope.undoAllButton();
                    
                }
                };
            }
        };
    }
]);