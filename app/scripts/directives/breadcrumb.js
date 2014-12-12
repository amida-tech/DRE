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
                            tmpObject.name = "My Files";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "record") {
                            pathString = "#/record/";
                            tmpObject.name = "My Record";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "profile") {
                            pathString = "#/profile";
                            tmpObject.name = "My Profile";
                            tmpObject.path = pathString;
                        }


                        if (parsedPath[i] === "allergies") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Allergies";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "encounters") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Encounters";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "billing") {
                            pathString = "#/billing/insurance/";
                            tmpObject.name = "My Billing";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "claims") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Claims";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "insurance") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Insurance";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "immunizations") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Immunizations";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "medications") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Medications";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "conditions") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Conditions";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "procedures") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Procedures";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "vitals") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Vital Signs";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "results") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Test Results";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "social") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Social History";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "review") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Review Updates";
                            tmpObject.path = pathString;
                        }

                        if (parsedPath[i] === "download") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Download Record";
                            tmpObject.path = pathString;   
                        }

                        if (parsedPath[i] === "upload") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "Upload Record";
                            tmpObject.path = pathString;   
                        }


                        if (parsedPath[i] === "account") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Account";
                            tmpObject.path = pathString;   
                        }

                        if (parsedPath[i] === "notes") {
                            pathString = pathString + parsedPath[i] + "/";
                            tmpObject.name = "My Notes";
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