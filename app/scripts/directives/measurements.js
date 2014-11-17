'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:measurements
 * @description
 * # measurements
 */
angular.module('phrPrototypeApp')
    .directive('measurements', function ($window) {
        return {
            template: '<svg></svg>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {

                //Initial Variables.
                var d3 = $window.d3;
                var rawSvg = element.find("svg")[0];
                var svg = d3.select(rawSvg);
                var vitals = scope.masterRecord.vitals;
                var graphVitals = [];
                var graphVitalsTwo = [];
                var graphDates = [];
                var graphValues = [];
                var margin = 60;
                var width = 200;
                var height = 200;

                //Override variables.
                if (attrs.svgWidth) {
                    width = attrs.svgWidth;
                }

                if (attrs.svgHeight) {
                    width = attrs.svgHeight;
                }

                //ISO 8601 Format.
                var format = d3.time.format("%Y-%m-%dT%H:%M:%SZ");

                svg.attr("height", height);
                svg.attr("width", width);

                //Restructure for graph.
                _.each(vitals, function (entry) {
                    var tmpVital = {};

                    if (attrs.graphType === "weight") {
                        if (entry.vital.name === "Patient Body Weight - Measured") {
                            tmpVital.value = entry.value;
                            tmpVital.unit = entry.unit;
                            tmpVital.date = format.parse(entry.date_time.point.date);
                            graphVitals.push(tmpVital);
                            graphDates.push(tmpVital.date);
                            graphValues.push(tmpVital.value);
                        }
                    }

                    if (attrs.graphType === "bloodPressure") {

                        if (entry.vital.name === "Intravascular Diastolic") {
                            tmpVital.value = entry.value;
                            tmpVital.unit = entry.unit;
                            tmpVital.date = format.parse(entry.date_time.point.date);
                            graphVitals.push(tmpVital);
                            graphDates.push(tmpVital.date);
                            graphValues.push(tmpVital.value);
                        }

                        if (entry.vital.name === "Intravascular Systolic") {
                            tmpVital.value = entry.value;
                            tmpVital.unit = entry.unit;
                            tmpVital.date = format.parse(entry.date_time.point.date);
                            graphVitalsTwo.push(tmpVital);
                            graphDates.push(tmpVital.date);
                            graphValues.push(tmpVital.value);
                        }
                    }

                });

                var padding = 30;
                var pathClass = "path";
                var xTimeScale, yTimeScale, xAxisGen, yAxisGen, lineFun;

                function setChartParameters() {
                    xTimeScale = d3.time.scale()
                        .domain([d3.min(graphDates), d3.max(graphDates)])
                        .range([padding - 2, rawSvg.clientWidth - padding - 2]);

                    yTimeScale = d3.scale.linear()
                        .domain([d3.min(graphValues) - (d3.min(graphValues) * 0.1), d3.max(graphValues) + (d3.max(graphValues) * 0.1)])
                        .range([rawSvg.clientHeight - padding, 0]);

                    xAxisGen = d3.svg.axis()
                        .scale(xTimeScale)
                        .orient("bottom")
                        .tickFormat(d3.time.format("%m/%d"))
                        .outerTickSize([2])
                        .tickValues([d3.min(graphDates), d3.max(graphDates)]);

                    yAxisGen = d3.svg.axis()
                        .scale(yTimeScale)
                        .orient("left")
                        .ticks(4)
                        .outerTickSize([2]);

                    lineFun = d3.svg.line()
                        .x(function (d) {
                            return xTimeScale(d.date);
                        })
                        .y(function (d) {
                            return yTimeScale(d.value);
                        })
                        .interpolate("basis");
                }

                function drawLineChart() {

                    setChartParameters();

                    svg.append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height - (padding) + 10) + ")")
                        .call(xAxisGen);

                    svg.append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + (padding) + ",10)")
                        .call(yAxisGen);

                    if (graphVitals.length > 0) {
                        svg.append("svg:path")
                            .attr({
                                d: lineFun(graphVitals),
                                "stroke": "blue",
                                "stroke-width": 2,
                                "fill": "none",
                                "class": pathClass
                            });
                    }

                    if (graphVitalsTwo.length > 0) {
                        svg.append("svg:path")
                            .attr({
                                d: lineFun(graphVitalsTwo),
                                "stroke": "blue",
                                "stroke-width": 2,
                                "fill": "none",
                                "class": pathClass
                            });
                    }
                }

                drawLineChart();

            }
        };
    });