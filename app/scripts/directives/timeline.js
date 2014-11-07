'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timeline
 * @Takes two inputs, chartData and chartType.
 * # timeline
 */
angular.module('phrPrototypeApp')
    .directive('timeline', function ($window) {
        return {
            restrict: 'EA',
            template: "<svg style='width:100%;'></svg>",
            link: function postLink(scope, element, attrs) {

            	var plotHeight = 50;
            	var boundaryOffset = 15;
            	var boundaryWidth = 5;

                var plotCircles = [];
                var plotDomain = [];
                var timeScale;
                var d3 = $window.d3;
                var rawSvg = element.find("svg")[0];
                var svg = d3.select(rawSvg).attr("height", plotHeight);
                var format = d3.time.format("%m/%d/%Y");

                function gatherData() {
                    var dataToPlot = scope[attrs.chartData];
                    var dataType = attrs.chartType;
                    var tmpDomain = [];

                    if (dataType === 'account') {

                        for (var i in dataToPlot.recordHistory) {
                            var plotDate = format.parse(dataToPlot.recordHistory[i].date);
                            plotCircles.push({
                                "date": plotDate
                            });
                            tmpDomain.push(plotDate);
                        }

                        var minDate = d3.min(tmpDomain);
                        var maxDate = d3.max(tmpDomain);
                        var plotFloor = d3.time.month.floor(d3.time.month.offset(minDate, -1));
                        var plotCeiling = d3.time.month.floor(d3.time.month.offset(maxDate, 1));
                        plotDomain = [plotFloor, plotCeiling];
                    }
                }

                function renderPlot() {

                	var width;

                    function getSVGWidth() {
                        width = parseInt(svg.style('width'), 10);
                    }

                    function buildScale() {

                        timeScale = d3.time.scale()
                            .range([(boundaryOffset + (boundaryWidth / 2)),width - (boundaryOffset - (boundaryWidth / 2 ))])
                            .domain(plotDomain);
                    }

                    function structureData() {
                        for (var i in plotCircles) {
                            plotCircles[i].x_axis = timeScale(plotCircles[i].date);
                            plotCircles[i].y_axis = plotHeight / 2;
                            plotCircles[i].radius = 10;
                            plotCircles[i].color = "green";
                        }
                    }

                    function plotData() {
                        svg.selectAll('*').remove();

var boundaryData = [{
                        "x": boundaryOffset,
                        "y": 0,
                        "width": boundaryWidth,
                        "height": plotHeight,
                        "color": "orange"
                    }, {
                        "x": width - boundaryOffset,
                        "y": 0,
                        "width": boundaryWidth,
                        "height": plotHeight,
                        "color": "orange"
                    }];

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




                        var circles = svg.selectAll("circle").data(plotCircles).enter().append("circle");
                        var circleAttributes = circles
                            .attr("cx", function (d) {
                                return d.x_axis;
                            })
                            .attr("cy", function (d) {
                                return d.y_axis;
                            })
                            .attr("r", function (d) {
                                return d.radius;
                            })
                            .style("fill", function (d) {
                                return d.color;
                            });



                    


                    }

                    getSVGWidth();
                    buildScale();
                    structureData();
                    plotData();

                }

                //gatherData only on first run.
                gatherData();
                renderPlot();

                //Re-evaluate scope on resize.
                $window.onresize = function () {
                    scope.$apply();
                    renderPlot();
                };

                /*function resize() {
    // update width
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // reset x range
    x.range([0, width]);

    // do the actual resize...
}*/

                //console.log(plotDomain);
                //console.log(plotCircles);

                //console.log(timeScale(plotDomain[1]));

                /*
            	// Sample Circles.  Real circles will css class applied, x-axis only adjustment.
                var jsonCircles = [
                	{ "x_axis": 30, "y_axis": 30, "radius": 20, "color" : "green" },
					{ "x_axis": 60, "y_axis": 30, "radius": 20, "color" : "blue" },
					{ "x_axis": 90, "y_axis": 30, "radius": 20, "color" : "red" }
                ];



                //Set SVG size.
                

                //Start by grabbing all circles.
                var circles = svg.selectAll("circle").data(jsonCircles).enter().append("circle");

                var circleAttributes = circles
                     .attr("cx", function (d) { 

                     	d.x_axis = d.x_axis + 30;
                     	return d.x_axis; }

                       )
                      .attr("cy", function (d) { return d.y_axis; })
                      .attr("r", function (d) { return d.radius; })
                      .style("fill", function(d) { return d.color; });

                 //To make responsive, need to listen to $window resize event, and re-render.


                //Saved sample of click event.
                //var circle = svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r",20).on("click", function() { window.open("http://google.com"); });
	*/
            }
        };
    });