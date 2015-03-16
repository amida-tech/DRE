'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:measurements
 * @description
 * # measurements
 */
angular.module('phrPrototypeApp').directive('d3template', ['$window', '$timeout', 'd3Service',
        function($window, $timeout, d3Service) {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                link: function(scope, ele, attrs) {
                    //bring in d3 code as a service
                    d3Service.d3().then(function(d3) {
                        var renderTimeout;
                        var margin = {
                                top: 0,
                                right: 20,
                                bottom: 28,
                                left: 20
                            },
                            w = 300 - margin.left - margin.right,
                            h = 200 - margin.top - margin.bottom;
                        //set initial svg values
                        var svg = d3.select(ele[0]).append('svg').attr('class', 'chart').attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                        //watch window resize to re-render
                        $window.onresize = function() {
                            scope.$apply();
                        };

                        scope.$watch(function() {
                            return angular.element($window)[0].innerWidth;
                        }, function() {
                            scope.render(scope.data);
                        });

                        //watch your attributes for changes to re-render
                        scope.$watch('data', function(newVals, oldVals) {
                            scope.render(newVals);
                        }, true);
                        //called to render chart
                        scope.render = function(data) {
                            console.log("d3template DIRECTIVE RENDER");
                            //clean svg
                            svg.selectAll('*').remove();
                            //check to see if there is any data before drawing the chart (enable when using data attribute)
                            //if (!data)
                            //  return;
                            if (renderTimeout) {
                                clearTimeout(renderTimeout);
                            }
                            renderTimeout = $timeout(function() {
                                //updates chart size on page resize
                                if (d3.select(ele[0]).node().offsetWidth > 0) {
                                    w = d3.select(ele[0]).node().offsetWidth - margin.left - margin.right;
                                    h = d3.select(ele[0]).node().offsetHeight - margin.top - margin.bottom;
                                    svg.attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom);
                                }
                                //write your chart code here!
                                svg.append('rect').attr('width', w).attr('height', h).attr('fill', 'black');
                            }, 100);
                        };
                    });
                }
            };
        }
    ])
    /*.directive('measurements', function ($window) {
        return {
            template: '<svg width="1000"></svg>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                //Initial Variables.
                var d3 = $window.d3;
                var rawSvg = element.find("svg")[0];
                var svg = d3.select(rawSvg);
                var vitals = scope.entries.vitals;
                var graphVitals = [];
                var graphVitalsTwo = [];
                var graphDates = [];
                var graphValues = [];
                var margin = 60;
                var width = 1000;
                var height = 200;
                //Override variables.
                if (attrs.svgWidth) {
                    width = attrs.svgWidth;
                }
                if (attrs.svgHeight) {
                    width = attrs.svgHeight;
                }
                //ISO 8601 Format.
                console.log("measurement.js vitals PRE");
                var format = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
                svg.attr("height", height);
                svg.attr("width", width);


                console.log("measurement.js vitals", vitals);

                //Restructure for graph.
                _.each(vitals, function (entry) {
                    var tmpVital = {};
                    if (attrs.graphType === "weight") {
                        if (entry.data.vital.name === "Patient Body Weight - Measured") {
                            tmpVital.value = entry.data.value;
                            tmpVital.unit = entry.data.unit;
                            tmpVital.date = format.parse(entry.data.date_time.point.date);
                            graphVitals.push(tmpVital);
                            graphDates.push(tmpVital.date);
                            graphValues.push(tmpVital.value);
                        }
                    }
                    if (attrs.graphType === "bloodPressure") {
                        if (entry.data.vital.name === "Intravascular Diastolic") {
                            tmpVital.value = entry.data.value;
                            tmpVital.unit = entry.data.unit;
                            tmpVital.date = format.parse(entry.data.date_time.point.date);
                            graphVitals.push(tmpVital);
                            graphDates.push(tmpVital.date);
                            graphValues.push(tmpVital.value);
                        }
                        if (entry.data.vital.name === "Intravascular Systolic") {
                            tmpVital.value = entry.data.value;
                            tmpVital.unit = entry.data.unit;
                            tmpVital.date = format.parse(entry.data.date_time.point.date);
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
                    xTimeScale = d3.time.scale().domain([d3.min(graphDates), d3.max(graphDates)]).range([padding - 2, rawSvg.clientWidth - padding - 2]);
                    yTimeScale = d3.scale.linear().domain([d3.min(graphValues) - (d3.min(graphValues) * 0.1), d3.max(graphValues) + (d3.max(graphValues) * 0.1)]).range([rawSvg.clientHeight - padding, 0]);
                    xAxisGen = d3.svg.axis().scale(xTimeScale).orient("bottom").tickFormat(d3.time.format("%m/%d")).outerTickSize([2]).tickValues([d3.min(graphDates), d3.max(graphDates)]);
                    yAxisGen = d3.svg.axis().scale(yTimeScale).orient("left").ticks(4).outerTickSize([2]);
                    lineFun = d3.svg.line().x(function (d) {
                        return xTimeScale(d.date);
                    }).y(function (d) {
                        return yTimeScale(d.value);
                    }).interpolate("basis");
                }

                function drawLineChart() {
                    setChartParameters();
                    svg.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + (height - (padding) + 10) + ")").call(xAxisGen);
                    svg.append("svg:g").attr("class", "y axis").attr("transform", "translate(" + (padding) + ",10)").call(yAxisGen);
                    if (graphVitals.length > 0) {
                        svg.append("svg:path").attr({
                            d: lineFun(graphVitals),
                            "stroke": "#6AA6FF",
                            "stroke-width": 2,
                            "fill": "none",
                            "class": pathClass
                        });
                    }
                    if (graphVitalsTwo.length > 0) {
                        svg.append("svg:path").attr({
                            d: lineFun(graphVitalsTwo),
                            "stroke": "#6AA6FF",
                            "stroke-width": 2,
                            "fill": "none",
                            "class": pathClass
                        });
                    }
                }
                console.log("measurements DIRECTIVE");

                drawLineChart();
            }
        };
    }) */
    .directive('linechart', ['$window', '$timeout', 'd3Service',
        function($window, $timeout, d3Service) {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                link: function(scope, ele, attrs) {
                    //bring in d3 code as a service
                    d3Service.d3().then(function(d3) {
                        var renderTimeout;
                        var margin = {
                                top: 0,
                                right: 20,
                                bottom: 28,
                                left: 20
                            },
                            w = 1000 - margin.left - margin.right,
                            h = 250 - margin.top - margin.bottom;
                        //set initial svg values
                        var svg = d3.select(ele[0]).append('svg').attr('class', 'chart').attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                        //watch window resize to re-render
                        $window.onresize = function() {
                            console.log("RESIZE");

                            scope.$apply();
                        };
                        scope.$watch(function() {
                            return angular.element($window)[0].innerWidth;
                        }, function() {
                            console.log("WIDTH CHANGES");

                            scope.render(scope.data);
                        });

                        scope.$on('tabchange', function(event, args) {
                            console.log("TAB CHANGES");
                            scope.render(scope.data);
                        });

                        //watch your attributes for changes to re-render
                        scope.$watch('data', function(newVals, oldVals) {
                            console.log("DATA CHANGES");
                            scope.render(newVals);
                        }, true);

                        //called to render chart
                        scope.render = function(entries) {
                            var vitals = [];
                            _.each(entries, function(entry) {
                                if (entry.category === "vitals") {
                                    console.log("entry >>>>> ", entry.metadata.datetime[0].date);
                                    vitals.push(entry);
                                }
                            });
                            console.log("linechart DIRECTIVE RENDER");

                            console.log("VITALS ", vitals);

                            if (vitals.length === 0) {
                                return;
                            }

                            //clean svg
                            svg.selectAll('*').remove();
                            //check to see if there is any data before drawing the chart (enable when using data attribute)
                            //if (!data)
                            //  return;
                            if (renderTimeout) {
                                clearTimeout(renderTimeout);
                            }
                            renderTimeout = $timeout(function() {
                                //updates chart size on page resize
                                if (d3.select(ele[0]).node().offsetWidth > 0) {
                                    w = d3.select(ele[0]).node().offsetWidth - margin.left - margin.right;
                                    h = d3.select(ele[0]).node().offsetHeight - margin.top - margin.bottom;
                                    svg.attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom);
                                }
                                //write your chart code here!
                                var graphVitals = [];
                                var graphVitalsTwo = [];
                                var graphDates = [];
                                var graphValues = [];
                                var yAxisValues = [];
                                var format = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");
                                _.each(vitals, function(entry) {
                                    var tmpVital = {};
                                    if (attrs.graphType === "weight") {
                                        if (entry.data.vital.name === "Patient Body Weight - Measured") {
                                            if (entry.data.unit === "kg") {
                                                tmpVital.value = Math.floor(2.20462*entry.data.value);
                                                tmpVital.unit = entry.data.unit;
                                            } else {
                                                tmpVital.value = entry.data.value;
                                                tmpVital.unit = entry.data.unit;
                                            }

                                            tmpVital.date = format.parse(entry.data.date_time.point.date);
                                            graphVitals.push(tmpVital);
                                            graphDates.push(tmpVital.date);
                                            graphValues.push(tmpVital.value);
                                        }
                                        yAxisValues = [130, 140, 150, 160];
                                    }
                                    if (attrs.graphType === "bloodPressure") {
                                        if (entry.data.vital.name === "Intravascular Diastolic") {
                                            tmpVital.value = entry.data.value;
                                            tmpVital.unit = entry.data.unit;
                                            tmpVital.date = format.parse(entry.data.date_time.point.date);
                                            graphVitals.push(tmpVital);
                                            graphDates.push(tmpVital.date);
                                            graphValues.push(tmpVital.value);
                                        }
                                        if (entry.data.vital.name === "Intravascular Systolic") {
                                            tmpVital.value = entry.data.value;
                                            tmpVital.unit = entry.data.unit;
                                            tmpVital.date = format.parse(entry.data.date_time.point.date);
                                            graphVitalsTwo.push(tmpVital);
                                            graphDates.push(tmpVital.date);
                                            graphValues.push(tmpVital.value);
                                        }
                                        yAxisValues = [80, 100, 120, 140];
                                    }
                                });
                                var padding = 30;
                                var pathClass = "path";
                                var xScale, yScale, xAxisGen, yAxisGen, lineFun;

                                function setChartParameters() {
                                    console.log(">>GRAPH DATES ", graphDates);

                                    xScale = d3.time.scale().domain([d3.min(graphDates), d3.max(graphDates)]).nice(d3.time.week).range([margin.left, w - margin.right]);
                                    yScale = d3.scale.linear().domain([d3.min(graphValues) - (d3.min(graphValues) * 0.1), d3.max(graphValues) + (d3.max(graphValues) * 0.1)]).range([h - margin.top, margin.bottom]);
                                    xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%m/%d")).outerTickSize([2]).tickValues(graphDates);
                                    yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(4).outerTickSize([2]);
                                    lineFun = d3.svg.line().x(function(d) {
                                        return xScale(d.date);
                                    }).y(function(d) {
                                        return yScale(d.value);
                                    }).interpolate("cardinal").tension(0.5);
                                }

                                function drawLineChart() {
                                    setChartParameters();
                                    svg.append("svg:g").attr("class", "x-axis").attr("transform", "translate(0," + (h - (margin.top)) + ")").call(xAxisGen);
                                    svg.append("svg:g").attr("class", "y-axis").attr("transform", "translate(" + (margin.right) + ",2)").call(yAxisGen);

                                    var lineTooltip = d3.select('body').append("div").attr("id", "cluster_tooltip").style("max-width", "300px").style("padding", "10px").style("background-color", "rgba(255, 255, 255, 0.7)").style("border-radius", "10px").style("box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)").style("position", "absolute").style("z-index", "10").style("visibility", "hidden");

                                    var tooltip_mouseover = function(d) {
                                        svg.selectAll("#tipline").remove();
                                        var xPos = parseFloat(d3.select(this).attr('cx'));
                                        var yPos = parseFloat(d3.select(this).attr('cy'));
                                        var tipLineValues = [
                                            [
                                                [xPos, h],
                                                [xPos, yPos + 5]
                                            ],
                                            [
                                                [margin.left, yPos],
                                                [xPos - 5, yPos]
                                            ]
                                        ];
                                        svg.append("g").attr("id", "tipline").selectAll(".line-to-axis").data(tipLineValues).enter().append("path").attr('d', d3.svg.line().interpolate("linear")).attr('stroke', '#444').attr('stroke-width', 1).style("stroke-dasharray", "4,2");
                                        var tooltipText = d.value; //write any html styling you want
                                        lineTooltip.html(tooltipText);
                                        return lineTooltip.style("visibility", "visible");
                                    };
                                    var tooltip_positioned_mousemove = function() {
                                        return lineTooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                                    };
                                    var tooltip_hide_tooltip = function() {
                                        return lineTooltip.style("visibility", "hidden");
                                    };

                                    if (graphVitals.length > 0) {
                                        svg.append("svg:path").attr({
                                            d: lineFun(graphVitals),
                                            "stroke": "#6AA6FF",
                                            "stroke-width": 2,
                                            "fill": "none",
                                            "class": pathClass
                                        });
                                        svg.selectAll("dot").data(graphVitals).enter().append("circle").attr("r", 4.5).attr("cx", function(d) {
                                                return xScale(d.date);
                                            }).attr("cy", function(d) {
                                                return yScale(d.value);
                                            }).on("mouseover", tooltip_mouseover)
                                            .on("mousemove", tooltip_positioned_mousemove)
                                            .on("mouseout", tooltip_hide_tooltip);

                                        svg.selectAll("xtick").data(graphVitals)
                                            .enter()
                                            .append("rect")
                                            .attr("width", 2)
                                            .attr("height", 5)
                                            .attr("x", function(d) {
                                                return xScale(d.date);
                                            }).attr("y", h);

                                        svg.selectAll("ytick").data(yAxisValues)
                                            .enter()
                                            .append("rect")
                                            .attr("width", 5)
                                            .attr("height", 2)
                                            .attr("x", margin.left - 5).attr("y", function(d) {
                                                return yScale(d);
                                            });

                                    }
                                    if (graphVitalsTwo.length > 0) {
                                        svg.append("svg:path").attr({
                                            d: lineFun(graphVitalsTwo),
                                            "stroke": "#6AA6FF",
                                            "stroke-width": 2,
                                            "fill": "none",
                                            "class": pathClass
                                        });
                                        svg.selectAll("dot").data(graphVitalsTwo).enter().append("circle").attr("r", 4.5).attr("cx", function(d) {
                                                return xScale(d.date);
                                            }).attr("cy", function(d) {
                                                return yScale(d.value);
                                            }).on("mouseover", tooltip_mouseover)
                                            .on("mousemove", tooltip_positioned_mousemove)
                                            .on("mouseout", tooltip_hide_tooltip);
                                    }
                                    svg.selectAll("circle").style('fill', '#fff').style('stroke', '#000');
                                }
                                drawLineChart();
                            }, 100);
                        };
                    });
                }
            };
        }
    ]);
