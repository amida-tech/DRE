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
                '<span ng-if="index !== (pageBreadCrumb.length - 1)"><a href="{{entry.path}}">{{entry.name}}</a><span> <i class="fa fa-angle-right"></i> </span></span>' +
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
                            pathString = "#/home/";
                            tmpObject.name = "Home";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "files") {
                            pathString = "#/files";
                            tmpObject.name = "My files";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "record") {
                            pathString = "#/record/";
                            tmpObject.name = "My record";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "profile") {
                            pathString = "#/profile";
                            tmpObject.name = "My profile";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "billing") {
                            pathString = "#/billing";
                            tmpObject.name = "My billing";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "review") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Review updates";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "download") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Download record";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "upload") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Upload record";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "import") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Import data";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "account") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My account";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "notes") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My notes";
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
