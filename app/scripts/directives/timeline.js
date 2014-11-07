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
                
            	// Find SVG on the page.
                var d3 = $window.d3;
                var rawSvg = element.find("svg")[0];
                var svg = d3.select(rawSvg);

            	var width = parseInt(svg.style('width'), 10);

            	svg.attr("height", 50);

            	var plotCircles = [];
            	var plotDomain = [];
            	var timeScale;

            	var format = d3.time.format("%m/%d/%Y");

            	function gatherData () {
            		var dataToPlot = scope[attrs.chartData];
            		var dataType = attrs.chartType;
            		if (dataType === 'account') {
            			
            			for (var i in dataToPlot.recordHistory) {
            				var plotDate = format.parse(dataToPlot.recordHistory[i].date);
            				plotCircles.push({"date": plotDate});
            				plotDomain.push(plotDate);
            			}
            		}
            	}

            	function buildScale () {
	            	timeScale = d3.time.scale()
	    				.range([0, width])
	    				.domain(plotDomain);
            	}

            	function structureData () {
            		for (var i in plotCircles) {
            			plotCircles[i].x_axis = timeScale(plotCircles[i].date);
            			plotCircles[i].y_axis = 30;
            			plotCircles[i].radius = 10;
            			plotCircles[i].color = "green";
            		}
            	}

            	gatherData();
            	buildScale();
            	structureData();

            	var circles = svg.selectAll("circle").data(plotCircles).enter().append("circle");

            	var circleAttributes = circles
                     .attr("cx", function (d) { return d.x_axis; }
                       )
                      .attr("cy", function (d) { return d.y_axis; })
                      .attr("r", function (d) { return d.radius; })
                      .style("fill", function(d) { return d.color; });


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