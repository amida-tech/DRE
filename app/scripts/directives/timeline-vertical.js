'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timelineVertical
 * @description
 * # timelineVertical
 */
angular.module('phrPrototypeApp')
  .directive('timelineVertical', function ($window) {
    return {
      template: '<svg class="vertical-bar" style="height: 75px; width: 20px;"></svg>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {

      			var d3 = $window.d3;

      			//console.log(attrs.parent);

      			var selector = "#" + attrs.parent;

      			//console.log(selector);

      			var myParent = d3.select(selector);

      			//console.log(myParent.attr('height'));
                
                //var parent = d3.select(".")
                var svg = d3.select(".vertical-bar");

                var width = parseInt(svg.style('width'), 10);
                var height = parseInt(svg.style('height'), 10);

                console.log(height);

                //svg.attr('width', width);
                //svg.attr('height', height /2);

                var boundaryData = {
                	"x": 0,
                	"y": 0,
                	"width": 20,
                	"height": 20,
                	"color": "green"
                };

                var boundaries = svg.selectAll("rect").data(boundaryData).enter().append("rect");
                        var boundaryAttributes = boundaries
                            .attr("x", function (d) {
                                return d.x;
                            })
                            .attr("y", function (d) {
                                return d.y;
                            })
                            .attr("width", function (d) {
                                return d.width;
                            })
                            .attr("height", function (d) {
                                return d.height;
                            })
                            .style("fill", function (d) {
                                return d.color;
                            });



      }
    };
  });
