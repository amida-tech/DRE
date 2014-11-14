'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:breadcrumb
 * @description
 * # breadcrumb
 */
angular.module('phrPrototypeApp')
    .directive('breadcrumb', function ($location) {
        return {
            template: '<span ng-repeat="(index, entry) in pageBreadCrumb">' + 
            		  '<span ng-if="index !== (pageBreadCrumb.length - 1)"><a href="{{entry.path}}">{{entry.name}}</a><span> <i class="fa fa-angle-double-right"></i> </span></span>' +
            		  '<span ng-if="index === (pageBreadCrumb.length - 1)">{{entry.name}}</span>' +
            		  '</span>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {

                var getBreadcrumb = function () {

                    var breadCrumb = [];
                    var parsedPath = $location.path().split('/');
                    var pathString = "";


                    for (var i in parsedPath) {

                        var tmpObject = {};

                        //Make Names User Friendly.
                        if (parsedPath[i] === "") {
                        	pathString = pathString + "#/";
                            tmpObject.name = "Home";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "files") {
                        	pathString = pathString + "files/";
                            tmpObject.name = "My Files";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "record") {
                            pathString = pathString + "record/";
                            tmpObject.name = "My Record";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "allergies") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Allergies";
                            tmpObject.path = pathString;
                        }


                        breadCrumb.push(tmpObject);
                    }

                    return breadCrumb;

                };

                scope.pageBreadCrumb = getBreadcrumb();
                //console.log(scope.pageBreadCrumb);
            }
        };
    });